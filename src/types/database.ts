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
          status: 'active' | 'inactive' | 'suspended'
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
          status?: 'active' | 'inactive' | 'suspended'
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
          status?: 'active' | 'inactive' | 'suspended'
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
          status: 'active' | 'inactive'
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
          status?: 'active' | 'inactive'
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
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
      }
      courts: {
        Row: {
          id: string
          name: string
          surface_type: 'indoor' | 'outdoor' | null
          location: string | null
          status: 'available' | 'maintenance' | 'reserved'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          surface_type?: 'indoor' | 'outdoor' | null
          location?: string | null
          status?: 'available' | 'maintenance' | 'reserved'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          surface_type?: 'indoor' | 'outdoor' | null
          location?: string | null
          status?: 'available' | 'maintenance' | 'reserved'
          created_at?: string
          updated_at?: string
        }
      }
      groups: {
        Row: {
          id: string
          name: string
          level_min: number | null
          level_max: number | null
          coach_id: string | null
          max_players: number
          schedule_template: Json | null
          status: 'active' | 'inactive'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          level_min?: number | null
          level_max?: number | null
          coach_id?: string | null
          max_players?: number
          schedule_template?: Json | null
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          level_min?: number | null
          level_max?: number | null
          coach_id?: string | null
          max_players?: number
          schedule_template?: Json | null
          status?: 'active' | 'inactive'
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
          status: 'active' | 'inactive'
        }
        Insert: {
          id?: string
          group_id: string
          player_id: string
          joined_at?: string
          status?: 'active' | 'inactive'
        }
        Update: {
          id?: string
          group_id?: string
          player_id?: string
          joined_at?: string
          status?: 'active' | 'inactive'
        }
      }
      bookings: {
        Row: {
          id: string
          court_id: string
          date: string
          start_time: string
          end_time: string
          booking_type: 'rental' | 'group_class' | 'private_lesson'
          group_id: string | null
          player_id: string | null
          coach_id: string | null
          is_recurring: boolean
          recurring_pattern: Json | null
          notes: string | null
          status: 'pending' | 'confirmed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          court_id: string
          date: string
          start_time: string
          end_time: string
          booking_type: 'rental' | 'group_class' | 'private_lesson'
          group_id?: string | null
          player_id?: string | null
          coach_id?: string | null
          is_recurring?: boolean
          recurring_pattern?: Json | null
          notes?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          court_id?: string
          date?: string
          start_time?: string
          end_time?: string
          booking_type?: 'rental' | 'group_class' | 'private_lesson'
          group_id?: string | null
          player_id?: string | null
          coach_id?: string | null
          is_recurring?: boolean
          recurring_pattern?: Json | null
          notes?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
      attendance: {
        Row: {
          id: string
          booking_id: string
          player_id: string
          status: 'pending' | 'present' | 'absent' | 'late'
          marked_by: string | null
          marked_at: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          booking_id: string
          player_id: string
          status?: 'pending' | 'present' | 'absent' | 'late'
          marked_by?: string | null
          marked_at?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          booking_id?: string
          player_id?: string
          status?: 'pending' | 'present' | 'absent' | 'late'
          marked_by?: string | null
          marked_at?: string | null
          notes?: string | null
        }
      }
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'coach' | 'player'
          player_id: string | null
          coach_id: string | null
          avatar_url: string | null
          locale: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role: 'admin' | 'coach' | 'player'
          player_id?: string | null
          coach_id?: string | null
          avatar_url?: string | null
          locale?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'coach' | 'player'
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
      [_ in never]: never
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
