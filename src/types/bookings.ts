// Booking-specific types and interfaces
import type { Booking, Court, Coach, Group, Player } from './database'

// Booking type enum for type safety
export type BookingType = 'rental' | 'group_class' | 'private_lesson'
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled'

// Recurring pattern structure (stored as JSONB)
export interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly'
  daysOfWeek?: number[]  // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  endDate?: string       // ISO date string (YYYY-MM-DD)
  occurrences?: number   // Maximum number of occurrences
  exceptions?: string[]  // Dates to skip (ISO format)
}

// Booking with all related entities
export interface BookingWithRelations extends Booking {
  court: Court
  coach?: Coach | null
  group?: Group | null
  player?: Player | null
}

// Form data for creating/editing bookings
export interface BookingFormData {
  courtId: string
  date: string
  startTime: string
  endTime: string
  bookingType: BookingType
  groupId?: string | null
  playerId?: string | null
  coachId?: string | null
  isRecurring: boolean
  recurringPattern?: RecurringPattern | null
  notes?: string
  status: BookingStatus
}

// Calendar view types
export interface CalendarDay {
  date: Date
  isToday: boolean
  isCurrentMonth: boolean
  bookings: BookingWithRelations[]
}

export interface CalendarWeek {
  startDate: Date
  endDate: Date
  days: CalendarDay[]
}

// Time slot for calendar grid
export interface TimeSlot {
  time: string        // Format: "HH:MM"
  hour: number
  minute: number
  isHalfHour: boolean
}

// Conflict detection types
export interface ConflictCheckResult {
  hasConflict: boolean
  conflictType?: 'court' | 'coach' | 'group' | 'player'
  conflictingBookings?: BookingWithRelations[]
  message?: string
}

export interface ConflictWarning {
  type: 'error' | 'warning'
  message: string
  conflictingBooking?: BookingWithRelations
}

// Filter options for calendar
export interface BookingFilters {
  bookingTypes: BookingType[]
  courtIds: string[]
  coachId?: string | null
  status: BookingStatus[]
  showCancelled: boolean
}

// Booking color configuration
export interface BookingColorConfig {
  bg: string
  border: string
  text: string
  accent: string
}

// Color mapping for booking types
export const BOOKING_COLORS: Record<BookingType, BookingColorConfig> = {
  rental: {
    bg: 'bg-emerald-100',
    border: 'border-emerald-400',
    text: 'text-emerald-800',
    accent: 'bg-emerald-500'
  },
  group_class: {
    bg: 'bg-purple-100',
    border: 'border-purple-400',
    text: 'text-purple-800',
    accent: 'bg-purple-500'
  },
  private_lesson: {
    bg: 'bg-amber-100',
    border: 'border-amber-400',
    text: 'text-amber-800',
    accent: 'bg-amber-500'
  }
}

// Status styling
export const STATUS_STYLES: Record<BookingStatus, string> = {
  pending: 'border-dashed opacity-70',
  confirmed: 'border-solid',
  cancelled: 'opacity-40 line-through'
}

// Calendar configuration
export const CALENDAR_CONFIG = {
  startHour: 7,
  endHour: 22,
  slotDuration: 30, // minutes
  defaultBookingDuration: 90, // minutes (1.5 hours)
} as const

// Utility type for date range queries
export interface DateRange {
  startDate: string  // ISO date
  endDate: string    // ISO date
}

// Action result types
export interface BookingActionResult {
  success: boolean
  booking?: BookingWithRelations
  error?: string
}

export interface BatchBookingResult {
  success: boolean
  created: number
  failed: number
  errors?: string[]
  bookings?: BookingWithRelations[]
}
