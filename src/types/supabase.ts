// Supabase Database Types
// This file provides type definitions for Supabase client

import type {
  Player,
  Coach,
  Court,
  Group,
  GroupPlayer,
  Booking,
  Attendance,
  UserProfile,
  PlayerStatus,
  CoachStatus,
  CourtStatus,
  CourtSurfaceType,
  GroupStatus,
  GroupPlayerStatus,
  BookingType,
  BookingStatus,
  AttendanceStatus,
  CheckInMethod,
  UserRole,
  ScheduleTemplate,
  RecurringPattern,
} from './database';

export interface Database {
  public: {
    Tables: {
      players: {
        Row: Player;
        Insert: Omit<Player, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Player, 'id' | 'created_at' | 'updated_at'>>;
      };
      coaches: {
        Row: Coach;
        Insert: Omit<Coach, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Coach, 'id' | 'created_at' | 'updated_at'>>;
      };
      courts: {
        Row: Court;
        Insert: Omit<Court, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Court, 'id' | 'created_at' | 'updated_at'>>;
      };
      groups: {
        Row: Group;
        Insert: Omit<Group, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Group, 'id' | 'created_at' | 'updated_at'>>;
      };
      group_players: {
        Row: GroupPlayer;
        Insert: Omit<GroupPlayer, 'id' | 'joined_at'> & {
          id?: string;
          joined_at?: string;
        };
        Update: Partial<Omit<GroupPlayer, 'id' | 'joined_at'>>;
      };
      bookings: {
        Row: Booking;
        Insert: Omit<Booking, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Booking, 'id' | 'created_at' | 'updated_at'>>;
      };
      attendance: {
        Row: Attendance;
        Insert: Omit<Attendance, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Attendance, 'id' | 'created_at' | 'updated_at'>>;
      };
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      player_status: PlayerStatus;
      coach_status: CoachStatus;
      court_status: CourtStatus;
      court_surface_type: CourtSurfaceType;
      group_status: GroupStatus;
      group_player_status: GroupPlayerStatus;
      booking_type: BookingType;
      booking_status: BookingStatus;
      attendance_status: AttendanceStatus;
      check_in_method: CheckInMethod;
      user_role: UserRole;
    };
  };
}

// Helper type to get table row type
export type TableRow<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

// Helper type to get table insert type
export type TableInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

// Helper type to get table update type
export type TableUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
