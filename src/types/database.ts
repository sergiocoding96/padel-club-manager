/**
 * Supabase Database Types
 * Based on supabase/migrations/001_initial_schema.sql
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Status enums
export type PlayerStatus = 'active' | 'inactive' | 'suspended'
export type CoachStatus = 'active' | 'inactive'
export type CourtStatus = 'available' | 'maintenance' | 'reserved'
export type CourtSurfaceType = 'indoor' | 'outdoor'
export type GroupStatus = 'active' | 'inactive'
export type GroupPlayerStatus = 'active' | 'inactive'
export type BookingType = 'rental' | 'group_class' | 'private_lesson'
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled'
export type AttendanceStatus = 'pending' | 'present' | 'absent' | 'late'
export type UserRole = 'admin' | 'coach' | 'player'

// Schedule template type (JSONB)
export interface ScheduleSlot {
  day: number // 0-6 (Sunday-Saturday)
  startTime: string // "HH:MM" format
  endTime: string // "HH:MM" format
  courtId?: string
}

export interface ScheduleTemplate {
  slots: ScheduleSlot[]
}

// Recurring pattern type (JSONB)
export interface RecurringPattern {
  frequency: 'weekly' | 'biweekly' | 'monthly'
  dayOfWeek?: number
  endDate?: string
}

// Database schema type for Supabase client
export interface Database {
  public: {
    Tables: {
      players: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          level_numeric: number | null
          level_category: string | null
          status: PlayerStatus
          notes: string | null
          objectives: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          level_numeric?: number | null
          level_category?: string | null
          status?: PlayerStatus
          notes?: string | null
          objectives?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          level_numeric?: number | null
          level_category?: string | null
          status?: PlayerStatus
          notes?: string | null
          objectives?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      coaches: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          role: string
          color_code: string | null
          status: CoachStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          role?: string
          color_code?: string | null
          status?: CoachStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          role?: string
          color_code?: string | null
          status?: CoachStatus
          created_at?: string
          updated_at?: string
        }
      }
      courts: {
        Row: {
          id: string
          name: string
          surface_type: CourtSurfaceType | null
          location: string | null
          status: CourtStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          surface_type?: CourtSurfaceType | null
          location?: string | null
          status?: CourtStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          surface_type?: CourtSurfaceType | null
          location?: string | null
          status?: CourtStatus
          created_at?: string
          updated_at?: string
        }
      }
      groups: {
        Row: {
          id: string
          name: string
          description: string | null
          level_min: number | null
          level_max: number | null
          coach_id: string | null
          court_id: string | null
          max_players: number
          schedule_template: Json | null
          color: string | null
          status: GroupStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          level_min?: number | null
          level_max?: number | null
          coach_id?: string | null
          court_id?: string | null
          max_players: number
          schedule_template?: Json | null
          color?: string | null
          status?: GroupStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          level_min?: number | null
          level_max?: number | null
          coach_id?: string | null
          court_id?: string | null
          max_players?: number
          schedule_template?: Json | null
          color?: string | null
          status?: GroupStatus
          created_at?: string
          updated_at?: string
        }
      }
      group_players: {
        Row: {
          id: string
          group_id: string
          player_id: string
          joined_at: string
          status: GroupPlayerStatus
        }
        Insert: {
          id?: string
          group_id: string
          player_id: string
          joined_at?: string
          status?: GroupPlayerStatus
        }
        Update: {
          id?: string
          group_id?: string
          player_id?: string
          joined_at?: string
          status?: GroupPlayerStatus
        }
      }
      bookings: {
        Row: {
          id: string
          court_id: string
          date: string
          start_time: string
          end_time: string
          booking_type: BookingType
          group_id: string | null
          player_id: string | null
          coach_id: string | null
          is_recurring: boolean
          recurring_pattern: Json | null
          notes: string | null
          status: BookingStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          court_id: string
          date: string
          start_time: string
          end_time: string
          booking_type: BookingType
          group_id?: string | null
          player_id?: string | null
          coach_id?: string | null
          is_recurring?: boolean
          recurring_pattern?: Json | null
          notes?: string | null
          status?: BookingStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          court_id?: string
          date?: string
          start_time?: string
          end_time?: string
          booking_type?: BookingType
          group_id?: string | null
          player_id?: string | null
          coach_id?: string | null
          is_recurring?: boolean
          recurring_pattern?: Json | null
          notes?: string | null
          status?: BookingStatus
          created_at?: string
          updated_at?: string
        }
      }
      attendance: {
        Row: {
          id: string
          booking_id: string
          player_id: string
          status: AttendanceStatus
          marked_by: string | null
          marked_at: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          booking_id: string
          player_id: string
          status?: AttendanceStatus
          marked_by?: string | null
          marked_at?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          booking_id?: string
          player_id?: string
          status?: AttendanceStatus
          marked_by?: string | null
          marked_at?: string | null
          notes?: string | null
        }
      }
      user_profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          role: UserRole
          player_id: string | null
          coach_id: string | null
          avatar_url: string | null
          locale: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          role: UserRole
          player_id?: string | null
          coach_id?: string | null
          avatar_url?: string | null
          locale?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          role?: UserRole
          player_id?: string | null
          coach_id?: string | null
          avatar_url?: string | null
          locale?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      player_status: PlayerStatus
      coach_status: CoachStatus
      court_status: CourtStatus
      group_status: GroupStatus
      group_player_status: GroupPlayerStatus
      booking_type: BookingType
      booking_status: BookingStatus
      attendance_status: AttendanceStatus
      user_role: UserRole
    }
  }
}

// Convenience type aliases
export type Player = Database['public']['Tables']['players']['Row']
export type PlayerInsert = Database['public']['Tables']['players']['Insert']
export type PlayerUpdate = Database['public']['Tables']['players']['Update']

export type Coach = Database['public']['Tables']['coaches']['Row']
export type Court = Database['public']['Tables']['courts']['Row']
export type Group = Database['public']['Tables']['groups']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']
export type Attendance = Database['public']['Tables']['attendance']['Row']
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']

// Helper type for typed Supabase queries
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updatable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
