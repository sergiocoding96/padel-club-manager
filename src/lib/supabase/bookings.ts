import { getSupabaseClient } from './client'
import type {
  Booking,
  BookingType,
  BookingStatus,
  RecurringPattern,
} from '@/types/database'
import type { ScheduleTemplate, ScheduleSlot } from '@/types/database'

// ==========================================
// Types
// ==========================================

export interface BookingCreateInput {
  court_id: string
  date: string // YYYY-MM-DD
  start_time: string // HH:MM
  end_time: string // HH:MM
  booking_type: BookingType
  group_id?: string | null
  player_id?: string | null
  coach_id?: string | null
  is_recurring?: boolean
  recurring_pattern?: RecurringPattern | null
  notes?: string | null
  status?: BookingStatus
}

export interface RecurringBookingOptions {
  groupId: string
  courtId: string
  schedule: ScheduleTemplate
  coachId?: string | null
  weeksAhead?: number // Default 4
  startDate?: Date // Default today
}

export interface BookingConflict {
  date: string
  startTime: string
  endTime: string
  existingBookingId: string
}

// ==========================================
// Helper Functions
// ==========================================

/**
 * Get the next N occurrences of a day of the week from a start date
 */
function getNextDayOccurrences(
  dayOfWeek: number, // 0 = Sunday, 6 = Saturday
  startDate: Date,
  count: number
): Date[] {
  const dates: Date[] = []
  const current = new Date(startDate)

  // Adjust to the next occurrence of the target day
  const daysUntilTarget = (dayOfWeek - current.getDay() + 7) % 7
  if (daysUntilTarget > 0) {
    current.setDate(current.getDate() + daysUntilTarget)
  }

  // Collect 'count' occurrences
  for (let i = 0; i < count; i++) {
    dates.push(new Date(current))
    current.setDate(current.getDate() + 7) // Move to next week
  }

  return dates
}

/**
 * Format date to YYYY-MM-DD string
 */
function formatDateToString(date: Date): string {
  return date.toISOString().split('T')[0]
}

// ==========================================
// Booking CRUD Operations
// ==========================================

/**
 * Create a single booking
 */
export async function createBooking(input: BookingCreateInput): Promise<Booking> {
  const supabase = getSupabaseClient()

  const insertData = {
    court_id: input.court_id,
    date: input.date,
    start_time: input.start_time,
    end_time: input.end_time,
    booking_type: input.booking_type,
    group_id: input.group_id ?? null,
    player_id: input.player_id ?? null,
    coach_id: input.coach_id ?? null,
    is_recurring: input.is_recurring ?? false,
    recurring_pattern: input.recurring_pattern ?? null,
    notes: input.notes ?? null,
    status: input.status ?? 'confirmed',
  }


  const { data, error } = await (supabase as any)
    .from('bookings')
    .insert(insertData)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create booking: ${error.message}`)
  }

  return data as Booking
}

/**
 * Get bookings for a specific date range and court
 */
export async function getBookingsForDateRange(
  courtId: string,
  startDate: string,
  endDate: string
): Promise<Booking[]> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('court_id', courtId)
    .gte('date', startDate)
    .lte('date', endDate)
    .neq('status', 'cancelled')
    .order('date', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch bookings: ${error.message}`)
  }

  return (data ?? []) as Booking[]
}

/**
 * Get bookings for a group
 */
export async function getBookingsForGroup(groupId: string): Promise<Booking[]> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('group_id', groupId)
    .neq('status', 'cancelled')
    .order('date', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch group bookings: ${error.message}`)
  }

  return (data ?? []) as Booking[]
}

/**
 * Delete future bookings for a group
 */
export async function deleteFutureBookingsForGroup(
  groupId: string,
  fromDate: string = formatDateToString(new Date())
): Promise<number> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('bookings')
    .delete()
    .eq('group_id', groupId)
    .gte('date', fromDate)
    .select('id')

  if (error) {
    throw new Error(`Failed to delete group bookings: ${error.message}`)
  }

  return data?.length ?? 0
}

/**
 * Cancel a booking (soft delete)
 */
export async function cancelBooking(bookingId: string): Promise<void> {
  const supabase = getSupabaseClient()


  const { error } = await (supabase as any)
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)

  if (error) {
    throw new Error(`Failed to cancel booking: ${error.message}`)
  }
}

// ==========================================
// Conflict Detection
// ==========================================

/**
 * Check if a time slot conflicts with existing bookings
 */
function hasTimeOverlap(
  newStart: string,
  newEnd: string,
  existingStart: string,
  existingEnd: string
): boolean {
  return newStart < existingEnd && newEnd > existingStart
}

/**
 * Find booking conflicts for a given schedule
 */
export async function findBookingConflicts(
  courtId: string,
  dates: { date: string; startTime: string; endTime: string }[]
): Promise<BookingConflict[]> {
  const conflicts: BookingConflict[] = []

  if (dates.length === 0) return conflicts

  // Get date range
  const sortedDates = [...dates].sort((a, b) => a.date.localeCompare(b.date))
  const startDate = sortedDates[0].date
  const endDate = sortedDates[sortedDates.length - 1].date

  // Fetch existing bookings
  const existingBookings = await getBookingsForDateRange(courtId, startDate, endDate)

  // Check each proposed slot against existing bookings
  for (const slot of dates) {
    const conflictingBooking = existingBookings.find(
      (booking) =>
        booking.date === slot.date &&
        hasTimeOverlap(slot.startTime, slot.endTime, booking.start_time, booking.end_time)
    )

    if (conflictingBooking) {
      conflicts.push({
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        existingBookingId: conflictingBooking.id,
      })
    }
  }

  return conflicts
}

// ==========================================
// Recurring Bookings Generation
// ==========================================

/**
 * Generate recurring bookings from a group schedule
 * Returns the list of created bookings and any conflicts
 */
export async function generateRecurringBookings(
  options: RecurringBookingOptions
): Promise<{
  created: Booking[]
  conflicts: BookingConflict[]
  skipped: number
}> {
  const {
    groupId,
    courtId,
    schedule,
    coachId = null,
    weeksAhead = 4,
    startDate = new Date(),
  } = options

  const created: Booking[] = []
  const allConflicts: BookingConflict[] = []
  let skipped = 0

  if (!schedule.slots || schedule.slots.length === 0) {
    return { created, conflicts: allConflicts, skipped }
  }

  // Generate all proposed booking dates
  const proposedBookings: {
    date: string
    startTime: string
    endTime: string
    slot: ScheduleSlot
  }[] = []

  for (const slot of schedule.slots) {
    const occurrences = getNextDayOccurrences(slot.day, startDate, weeksAhead)

    for (const date of occurrences) {
      proposedBookings.push({
        date: formatDateToString(date),
        startTime: slot.startTime,
        endTime: slot.endTime,
        slot,
      })
    }
  }

  // Check for conflicts first
  const conflicts = await findBookingConflicts(
    courtId,
    proposedBookings.map(({ date, startTime, endTime }) => ({
      date,
      startTime,
      endTime,
    }))
  )

  // Create a set of conflicting date+time combinations for quick lookup
  const conflictSet = new Set(
    conflicts.map((c) => `${c.date}-${c.startTime}-${c.endTime}`)
  )

  // Create bookings for non-conflicting slots
  for (const booking of proposedBookings) {
    const key = `${booking.date}-${booking.startTime}-${booking.endTime}`

    if (conflictSet.has(key)) {
      skipped++
      allConflicts.push(
        conflicts.find(
          (c) =>
            c.date === booking.date &&
            c.startTime === booking.startTime &&
            c.endTime === booking.endTime
        )!
      )
      continue
    }

    try {
      const newBooking = await createBooking({
        court_id: booking.slot.courtId || courtId,
        date: booking.date,
        start_time: booking.startTime,
        end_time: booking.endTime,
        booking_type: 'group_class',
        group_id: groupId,
        coach_id: coachId,
        is_recurring: true,
        recurring_pattern: {
          frequency: 'weekly',
          dayOfWeek: booking.slot.day,
        },
        status: 'confirmed',
      })
      created.push(newBooking)
    } catch (error) {
      console.error('Failed to create booking:', error)
      skipped++
    }
  }

  return { created, conflicts: allConflicts, skipped }
}

/**
 * Regenerate bookings for a group
 * Deletes future bookings and creates new ones based on current schedule
 */
export async function regenerateGroupBookings(
  groupId: string,
  courtId: string,
  schedule: ScheduleTemplate,
  coachId?: string | null,
  weeksAhead: number = 4
): Promise<{
  deleted: number
  created: Booking[]
  conflicts: BookingConflict[]
}> {
  // Delete existing future bookings
  const deleted = await deleteFutureBookingsForGroup(groupId)

  // Generate new bookings
  const result = await generateRecurringBookings({
    groupId,
    courtId,
    schedule,
    coachId,
    weeksAhead,
  })

  return {
    deleted,
    created: result.created,
    conflicts: result.conflicts,
  }
}

// ==========================================
// Schedule Change Handler
// ==========================================

/**
 * Handle schedule changes for a group
 * Call this when a group's schedule_template is updated
 */
export async function handleGroupScheduleChange(
  groupId: string,
  newSchedule: ScheduleTemplate | null,
  courtId: string | null,
  coachId: string | null,
  options: {
    regenerateBookings?: boolean
    weeksAhead?: number
  } = {}
): Promise<{
  deleted: number
  created: Booking[]
  conflicts: BookingConflict[]
} | null> {
  const { regenerateBookings = true, weeksAhead = 4 } = options

  if (!regenerateBookings || !courtId) {
    return null
  }

  // If schedule is removed, just delete future bookings
  if (!newSchedule || !newSchedule.slots || newSchedule.slots.length === 0) {
    const deleted = await deleteFutureBookingsForGroup(groupId)
    return { deleted, created: [], conflicts: [] }
  }

  // Regenerate bookings
  return regenerateGroupBookings(groupId, courtId, newSchedule, coachId, weeksAhead)
}
