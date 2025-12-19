// Padel Club Manager - Database Types
// Auto-generated based on Supabase schema

// =============================================
// ENUMS & CONSTANTS
// =============================================

export type PlayerStatus = 'active' | 'inactive' | 'suspended';
export type CoachStatus = 'active' | 'inactive';
export type CourtStatus = 'available' | 'maintenance' | 'reserved';
export type CourtSurfaceType = 'indoor' | 'outdoor';
export type GroupStatus = 'active' | 'inactive';
export type GroupPlayerStatus = 'active' | 'inactive';
export type BookingType = 'rental' | 'group_class' | 'private_lesson';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';
export type AttendanceStatus = 'pending' | 'present' | 'absent' | 'late' | 'excused';
export type CheckInMethod = 'coach' | 'self' | 'auto';
export type UserRole = 'admin' | 'coach' | 'player';

// Player level (1-7 scale)
export type PlayerLevel = 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5 | 5.5 | 6 | 6.5 | 7;

// =============================================
// BASE TYPES
// =============================================

export interface Player {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  level_numeric: number | null;
  level_category: string | null;
  status: PlayerStatus;
  notes: string | null;
  objectives: string | null;
  created_at: string;
  updated_at: string;
}

export interface Coach {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  color_code: string | null;
  status: CoachStatus;
  created_at: string;
  updated_at: string;
}

export interface Court {
  id: string;
  name: string;
  surface_type: CourtSurfaceType | null;
  location: string | null;
  status: CourtStatus;
  created_at: string;
  updated_at: string;
}

export interface ScheduleTemplate {
  day_of_week: number; // 0-6, Sunday-Saturday
  start_time: string;
  end_time: string;
  court_id?: string;
}

export interface Group {
  id: string;
  name: string;
  level_min: number | null;
  level_max: number | null;
  coach_id: string | null;
  max_players: number;
  schedule_template: ScheduleTemplate[] | null;
  status: GroupStatus;
  created_at: string;
  updated_at: string;
}

export interface GroupPlayer {
  id: string;
  group_id: string;
  player_id: string;
  joined_at: string;
  status: GroupPlayerStatus;
}

export interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  days_of_week?: number[]; // 0-6
  end_date?: string;
  exceptions?: string[]; // Dates to skip
}

export interface Booking {
  id: string;
  court_id: string;
  date: string;
  start_time: string;
  end_time: string;
  booking_type: BookingType;
  group_id: string | null;
  player_id: string | null;
  coach_id: string | null;
  is_recurring: boolean;
  recurring_pattern: RecurringPattern | null;
  notes: string | null;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: string;
  booking_id: string;
  player_id: string;
  status: AttendanceStatus;
  marked_by: string | null;
  marked_at: string | null;
  notes: string | null;
  check_in_method: CheckInMethod | null;
  check_in_time: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  player_id: string | null;
  coach_id: string | null;
  avatar_url: string | null;
  locale: string;
  created_at: string;
  updated_at: string;
}

// =============================================
// RELATION TYPES (Joined Data)
// =============================================

export interface GroupWithCoach extends Group {
  coach: Coach | null;
}

export interface GroupWithPlayers extends Group {
  players: Player[];
  player_count: number;
}

export interface GroupPlayerWithDetails extends GroupPlayer {
  player: Player;
  group: Group;
}

export interface BookingWithRelations extends Booking {
  court: Court;
  group: Group | null;
  player: Player | null;
  coach: Coach | null;
}

export interface AttendanceWithRelations extends Attendance {
  player: Player;
  booking: BookingWithRelations;
  marked_by_coach: Coach | null;
}

export interface AttendanceWithPlayer extends Attendance {
  player: Player;
}

export interface AttendanceWithBooking extends Attendance {
  booking: Booking;
}

// =============================================
// INPUT TYPES (For Create/Update Operations)
// =============================================

export interface CreatePlayerInput {
  name: string;
  email?: string | null;
  phone?: string | null;
  level_numeric?: number | null;
  level_category?: string | null;
  status?: PlayerStatus;
  notes?: string | null;
  objectives?: string | null;
}

export interface UpdatePlayerInput extends Partial<CreatePlayerInput> {
  id: string;
}

export interface CreateCoachInput {
  name: string;
  email?: string | null;
  phone?: string | null;
  role?: string;
  color_code?: string | null;
  status?: CoachStatus;
}

export interface UpdateCoachInput extends Partial<CreateCoachInput> {
  id: string;
}

export interface CreateCourtInput {
  name: string;
  surface_type?: CourtSurfaceType | null;
  location?: string | null;
  status?: CourtStatus;
}

export interface UpdateCourtInput extends Partial<CreateCourtInput> {
  id: string;
}

export interface CreateGroupInput {
  name: string;
  level_min?: number | null;
  level_max?: number | null;
  coach_id?: string | null;
  max_players?: number;
  schedule_template?: ScheduleTemplate[] | null;
  status?: GroupStatus;
}

export interface UpdateGroupInput extends Partial<CreateGroupInput> {
  id: string;
}

export interface CreateBookingInput {
  court_id: string;
  date: string;
  start_time: string;
  end_time: string;
  booking_type: BookingType;
  group_id?: string | null;
  player_id?: string | null;
  coach_id?: string | null;
  is_recurring?: boolean;
  recurring_pattern?: RecurringPattern | null;
  notes?: string | null;
  status?: BookingStatus;
}

export interface UpdateBookingInput extends Partial<CreateBookingInput> {
  id: string;
}

export interface CreateAttendanceInput {
  booking_id: string;
  player_id: string;
  status?: AttendanceStatus;
  marked_by?: string | null;
  notes?: string | null;
  check_in_method?: CheckInMethod | null;
}

export interface UpdateAttendanceInput {
  id: string;
  status?: AttendanceStatus;
  marked_by?: string | null;
  marked_at?: string | null;
  notes?: string | null;
  check_in_method?: CheckInMethod | null;
  check_in_time?: string | null;
}

export interface MarkAttendanceInput {
  booking_id: string;
  player_id: string;
  status: AttendanceStatus;
  notes?: string | null;
  marked_by?: string | null;
  check_in_method?: CheckInMethod;
}

export interface BulkMarkAttendanceInput {
  booking_id: string;
  attendances: Array<{
    player_id: string;
    status: AttendanceStatus;
    notes?: string | null;
  }>;
  marked_by?: string | null;
}

// =============================================
// QUERY/FILTER TYPES
// =============================================

export interface DateRange {
  start: string;
  end: string;
}

export interface AttendanceFilters {
  player_id?: string;
  group_id?: string;
  coach_id?: string;
  booking_id?: string;
  status?: AttendanceStatus | AttendanceStatus[];
  date_range?: DateRange;
  check_in_method?: CheckInMethod;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface AttendanceQueryParams extends AttendanceFilters, PaginationParams {
  sort_by?: 'date' | 'status' | 'player_name';
  sort_order?: 'asc' | 'desc';
}

// =============================================
// STATISTICS & REPORT TYPES
// =============================================

export interface AttendanceStats {
  total_sessions: number;
  attended: number;
  absent: number;
  late: number;
  excused: number;
  pending: number;
  attendance_rate: number; // Percentage (0-100)
  streak: number; // Consecutive present sessions
}

export interface PlayerAttendanceStats extends AttendanceStats {
  player_id: string;
  player_name: string;
  group_comparison?: number; // Difference from group average
}

export interface GroupAttendanceStats extends AttendanceStats {
  group_id: string;
  group_name: string;
  player_stats: PlayerAttendanceStats[];
  average_players_per_session: number;
}

export interface DailyAttendanceSummary {
  date: string;
  total_sessions: number;
  total_players: number;
  present: number;
  absent: number;
  late: number;
  attendance_rate: number;
}

export interface AttendanceReport {
  generated_at: string;
  date_range: DateRange;
  overall_stats: AttendanceStats;
  daily_summaries: DailyAttendanceSummary[];
  player_breakdown?: PlayerAttendanceStats[];
  group_breakdown?: GroupAttendanceStats[];
}

export interface AttendanceHeatmapData {
  date: string;
  count: number;
  rate: number;
  level: 0 | 1 | 2 | 3 | 4; // For GitHub-style heatmap coloring
}

// =============================================
// UI STATE TYPES
// =============================================

export interface AttendancePlayerState {
  player_id: string;
  player: Player;
  current_status: AttendanceStatus;
  original_status: AttendanceStatus;
  notes: string;
  is_dirty: boolean;
  is_saving: boolean;
}

export interface AttendanceSessionState {
  booking_id: string;
  booking: BookingWithRelations;
  players: AttendancePlayerState[];
  is_loading: boolean;
  is_saving: boolean;
  has_unsaved_changes: boolean;
  last_saved_at: string | null;
}

// =============================================
// NOTIFICATION TYPES
// =============================================

export interface AbsenceNotification {
  id: string;
  player_id: string;
  booking_id: string;
  notification_type: 'absence_alert' | 'reminder' | 'auto_cancel';
  sent_at: string | null;
  scheduled_for: string;
  status: 'pending' | 'sent' | 'failed';
}

// =============================================
// CONSTANTS FOR UI
// =============================================

export const ATTENDANCE_STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'stone',
    bgColor: 'bg-stone-100',
    textColor: 'text-stone-700',
    borderColor: 'border-stone-300',
    icon: 'Clock',
  },
  present: {
    label: 'Present',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    borderColor: 'border-green-300',
    icon: 'CheckCircle',
  },
  late: {
    label: 'Late',
    color: 'amber',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-300',
    icon: 'Clock',
  },
  absent: {
    label: 'Absent',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    borderColor: 'border-red-300',
    icon: 'XCircle',
  },
  excused: {
    label: 'Excused',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-300',
    icon: 'AlertCircle',
  },
} as const;

export const DEFAULT_ATTENDANCE_STATUS: AttendanceStatus = 'pending';
export const AUTO_CANCEL_THRESHOLD = 2; // Minimum players required
export const SELF_CHECKIN_WINDOW_BEFORE = 30; // Minutes before session
export const SELF_CHECKIN_WINDOW_AFTER = 15; // Minutes after session start
export const LATE_THRESHOLD_MINUTES = 10; // Minutes after which player is marked late
