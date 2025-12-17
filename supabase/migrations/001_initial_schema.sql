-- Padel Club Manager - Initial Database Schema
-- Version: 1.0.0

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PLAYERS TABLE
-- =============================================
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(50),
  level_numeric DECIMAL(2,1) CHECK (level_numeric >= 1 AND level_numeric <= 7),
  level_category VARCHAR(50),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  notes TEXT,
  objectives TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- COACHES TABLE
-- =============================================
CREATE TABLE coaches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(50),
  role VARCHAR(50) DEFAULT 'coach',
  color_code VARCHAR(20),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- COURTS TABLE
-- =============================================
CREATE TABLE courts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  surface_type VARCHAR(20) CHECK (surface_type IN ('indoor', 'outdoor')),
  location VARCHAR(255),
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'maintenance', 'reserved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- GROUPS TABLE
-- =============================================
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  level_min DECIMAL(2,1) CHECK (level_min >= 1 AND level_min <= 7),
  level_max DECIMAL(2,1) CHECK (level_max >= 1 AND level_max <= 7),
  coach_id UUID REFERENCES coaches(id) ON DELETE SET NULL,
  max_players INTEGER DEFAULT 4,
  schedule_template JSONB,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT level_range_check CHECK (level_min <= level_max)
);

-- =============================================
-- GROUP_PLAYERS (Junction Table)
-- =============================================
CREATE TABLE group_players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  UNIQUE(group_id, player_id)
);

-- =============================================
-- BOOKINGS TABLE
-- =============================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  court_id UUID NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  booking_type VARCHAR(30) NOT NULL CHECK (booking_type IN ('rental', 'group_class', 'private_lesson')),
  group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
  player_id UUID REFERENCES players(id) ON DELETE SET NULL,
  coach_id UUID REFERENCES coaches(id) ON DELETE SET NULL,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_pattern JSONB,
  notes TEXT,
  status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT time_range_check CHECK (start_time < end_time)
);

-- =============================================
-- ATTENDANCE TABLE
-- =============================================
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'present', 'absent', 'late')),
  marked_by UUID REFERENCES coaches(id),
  marked_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  UNIQUE(booking_id, player_id)
);

-- =============================================
-- USER_PROFILES TABLE (Auth)
-- =============================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'coach', 'player')),
  player_id UUID REFERENCES players(id) ON DELETE SET NULL,
  coach_id UUID REFERENCES coaches(id) ON DELETE SET NULL,
  avatar_url TEXT,
  locale VARCHAR(5) DEFAULT 'es',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_players_status ON players(status);
CREATE INDEX idx_players_level ON players(level_numeric);
CREATE INDEX idx_coaches_status ON coaches(status);
CREATE INDEX idx_courts_status ON courts(status);
CREATE INDEX idx_groups_coach ON groups(coach_id);
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_bookings_court_date ON bookings(court_id, date);
CREATE INDEX idx_attendance_booking ON attendance(booking_id);
CREATE INDEX idx_attendance_player ON attendance(player_id);

-- =============================================
-- UPDATED_AT TRIGGER FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coaches_updated_at BEFORE UPDATE ON coaches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courts_updated_at BEFORE UPDATE ON courts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
