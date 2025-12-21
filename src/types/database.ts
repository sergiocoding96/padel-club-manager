export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Court types
export type CourtSurfaceType = 'indoor' | 'outdoor'
export type CourtStatus = 'available' | 'maintenance' | 'reserved'

export interface Court {
  id: string
  name: string
  surface_type: CourtSurfaceType | null
  location: string | null
  status: CourtStatus
  created_at: string
  updated_at: string
}

export interface CourtInsert {
  id?: string
  name: string
  surface_type?: CourtSurfaceType | null
  location?: string | null
  status?: CourtStatus
}

export interface CourtUpdate {
  name?: string
  surface_type?: CourtSurfaceType | null
  location?: string | null
  status?: CourtStatus
}

// Player types
export type PlayerStatus = 'active' | 'inactive' | 'suspended'

export interface Player {
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

// Coach types
export type CoachStatus = 'active' | 'inactive'

export interface Coach {
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

// Group types
export type GroupStatus = 'active' | 'inactive'

export interface Group {
  id: string
  name: string
  level_min: number | null
  level_max: number | null
  coach_id: string | null
  max_players: number
  schedule_template: Json | null
  status: GroupStatus
  created_at: string
  updated_at: string
}

// Booking types
export type BookingType = 'rental' | 'group_class' | 'private_lesson'
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled'

export interface Booking {
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

// Attendance types
export type AttendanceStatus = 'pending' | 'present' | 'absent' | 'late'

export interface Attendance {
  id: string
  booking_id: string
  player_id: string
  status: AttendanceStatus
  marked_by: string | null
  marked_at: string | null
  notes: string | null
}

// User profile types
export type UserRole = 'admin' | 'coach' | 'player'

export interface UserProfile {
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

// Database type for Supabase client (compatible with @supabase/supabase-js v2)
export type Database = {
  public: {
    Tables: {
      courts: {
        Row: Court
        Insert: CourtInsert
        Update: CourtUpdate
        Relationships: []
      }
      players: {
        Row: Player
        Insert: Omit<Player, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Player, 'id' | 'created_at' | 'updated_at'>>
        Relationships: []
      }
      coaches: {
        Row: Coach
        Insert: Omit<Coach, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Coach, 'id' | 'created_at' | 'updated_at'>>
        Relationships: []
      }
      groups: {
        Row: Group
        Insert: Omit<Group, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Group, 'id' | 'created_at' | 'updated_at'>>
        Relationships: []
      }
      bookings: {
        Row: Booking
        Insert: Omit<Booking, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Booking, 'id' | 'created_at' | 'updated_at'>>
        Relationships: []
      }
      attendance: {
        Row: Attendance
        Insert: Omit<Attendance, 'id'>
        Update: Partial<Omit<Attendance, 'id'>>
        Relationships: []
      }
      user_profiles: {
        Row: UserProfile
        Insert: Omit<UserProfile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper type for typed Supabase queries
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updatable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
