-- Padel Club Manager - Attendance System Enhancements
-- Version: 1.1.0
-- This migration adds additional columns and features for the attendance system

-- =============================================
-- ADD NEW COLUMNS TO ATTENDANCE TABLE
-- =============================================

-- Add check_in_method to track how attendance was recorded
ALTER TABLE attendance
ADD COLUMN IF NOT EXISTS check_in_method VARCHAR(20)
CHECK (check_in_method IN ('coach', 'self', 'auto'));

-- Add check_in_time for tracking when player actually arrived (for late detection)
ALTER TABLE attendance
ADD COLUMN IF NOT EXISTS check_in_time TIMESTAMP WITH TIME ZONE;

-- Add created_at and updated_at if they don't exist
ALTER TABLE attendance
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE attendance
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- =============================================
-- UPDATE STATUS CHECK CONSTRAINT
-- =============================================

-- Drop the existing constraint and add new one with 'excused' status
ALTER TABLE attendance DROP CONSTRAINT IF EXISTS attendance_status_check;
ALTER TABLE attendance
ADD CONSTRAINT attendance_status_check
CHECK (status IN ('pending', 'present', 'absent', 'late', 'excused'));

-- =============================================
-- ADD TRIGGER FOR UPDATED_AT
-- =============================================

-- Create trigger for attendance updated_at (reusing existing function)
DROP TRIGGER IF EXISTS update_attendance_updated_at ON attendance;
CREATE TRIGGER update_attendance_updated_at
BEFORE UPDATE ON attendance
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ADD INDEXES FOR PERFORMANCE
-- =============================================

-- Index for filtering by status
CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance(status);

-- Index for date-based queries (via booking)
CREATE INDEX IF NOT EXISTS idx_attendance_marked_at ON attendance(marked_at);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_attendance_player_status ON attendance(player_id, status);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on attendance table
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can do everything
CREATE POLICY admin_all_attendance ON attendance
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.role = 'admin'
  )
);

-- Policy: Coaches can view and update attendance for their bookings
CREATE POLICY coach_manage_attendance ON attendance
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles up
    JOIN bookings b ON b.id = attendance.booking_id
    WHERE up.id = auth.uid()
    AND up.role = 'coach'
    AND b.coach_id = up.coach_id
  )
);

-- Policy: Players can view their own attendance
CREATE POLICY player_view_own_attendance ON attendance
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.player_id = attendance.player_id
  )
);

-- Policy: Players can self check-in (insert/update their own pending attendance)
CREATE POLICY player_self_checkin ON attendance
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.player_id = attendance.player_id
    AND attendance.status = 'pending'
  )
)
WITH CHECK (
  check_in_method = 'self'
);

-- =============================================
-- HELPER FUNCTIONS FOR ATTENDANCE
-- =============================================

-- Function to calculate attendance rate for a player
CREATE OR REPLACE FUNCTION get_player_attendance_rate(
  p_player_id UUID,
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL
)
RETURNS DECIMAL AS $$
DECLARE
  total_count INTEGER;
  present_count INTEGER;
BEGIN
  SELECT
    COUNT(*),
    COUNT(*) FILTER (WHERE a.status IN ('present', 'late'))
  INTO total_count, present_count
  FROM attendance a
  JOIN bookings b ON b.id = a.booking_id
  WHERE a.player_id = p_player_id
    AND a.status != 'pending'
    AND (p_start_date IS NULL OR b.date >= p_start_date)
    AND (p_end_date IS NULL OR b.date <= p_end_date);

  IF total_count = 0 THEN
    RETURN 0;
  END IF;

  RETURN ROUND((present_count::DECIMAL / total_count) * 100, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get attendance streak for a player
CREATE OR REPLACE FUNCTION get_player_attendance_streak(p_player_id UUID)
RETURNS INTEGER AS $$
DECLARE
  streak INTEGER := 0;
  prev_status VARCHAR(20);
  curr_status VARCHAR(20);
BEGIN
  FOR curr_status IN
    SELECT a.status
    FROM attendance a
    JOIN bookings b ON b.id = a.booking_id
    WHERE a.player_id = p_player_id
      AND a.status != 'pending'
    ORDER BY b.date DESC, b.start_time DESC
  LOOP
    IF curr_status IN ('present', 'late') THEN
      streak := streak + 1;
    ELSE
      EXIT;
    END IF;
  END LOOP;

  RETURN streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if booking should be auto-cancelled
CREATE OR REPLACE FUNCTION should_auto_cancel_booking(
  p_booking_id UUID,
  p_threshold INTEGER DEFAULT 2
)
RETURNS BOOLEAN AS $$
DECLARE
  confirmed_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO confirmed_count
  FROM attendance
  WHERE booking_id = p_booking_id
    AND status IN ('present', 'pending');

  RETURN confirmed_count < p_threshold;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================

COMMENT ON COLUMN attendance.check_in_method IS 'How the attendance was recorded: coach (by coach), self (player self check-in), auto (automatic)';
COMMENT ON COLUMN attendance.check_in_time IS 'Actual time the player checked in, used for late detection';
COMMENT ON FUNCTION get_player_attendance_rate IS 'Calculates attendance rate (percentage) for a player within an optional date range';
COMMENT ON FUNCTION get_player_attendance_streak IS 'Returns the current consecutive attendance streak for a player';
COMMENT ON FUNCTION should_auto_cancel_booking IS 'Checks if a booking should be auto-cancelled due to low attendance';
