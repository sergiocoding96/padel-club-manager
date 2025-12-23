'use server'

import { createClient } from '@/lib/supabase/server'
import type { Booking } from '@/types/database'
import type { BookingWithRelations, BookingFormData, DateRange, RecurringPattern } from '@/types/bookings'

export type ActionResult<T = void> = {
  success: boolean
  data?: T
  error?: string
}

export async function getBookingsByDateRange(
  startDate: string,
  endDate: string
): Promise<ActionResult<BookingWithRelations[]>> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        court:courts(*),
        coach:coaches(*),
        group:groups(*),
        player:players(*)
      `)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true })
      .order('start_time', { ascending: true })

    if (error) throw error

    return { success: true, data: (data as BookingWithRelations[]) ?? [] }
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return { success: false, error: 'Failed to fetch bookings' }
  }
}

export async function getBookingById(id: string): Promise<ActionResult<BookingWithRelations>> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        court:courts(*),
        coach:coaches(*),
        group:groups(*),
        player:players(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    return { success: true, data: data as BookingWithRelations }
  } catch (error) {
    console.error('Error fetching booking:', error)
    return { success: false, error: 'Failed to fetch booking' }
  }
}

export async function createBooking(formData: BookingFormData): Promise<ActionResult<BookingWithRelations>> {
  try {
    const supabase = await createClient()

    // Check for conflicts first
    const conflictCheck = await checkCourtConflict(
      formData.courtId,
      formData.date,
      formData.startTime,
      formData.endTime
    )

    if (!conflictCheck.success || conflictCheck.data?.hasConflict) {
      return {
        success: false,
        error: conflictCheck.data?.message || 'Court is already booked at this time'
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from('bookings') as any)
      .insert({
        court_id: formData.courtId,
        date: formData.date,
        start_time: formData.startTime,
        end_time: formData.endTime,
        booking_type: formData.bookingType,
        group_id: formData.groupId || null,
        player_id: formData.playerId || null,
        coach_id: formData.coachId || null,
        is_recurring: formData.isRecurring,
        recurring_pattern: formData.recurringPattern || null,
        notes: formData.notes || null,
        status: formData.status,
      })
      .select(`
        *,
        court:courts(*),
        coach:coaches(*),
        group:groups(*),
        player:players(*)
      `)
      .single()

    if (error) throw error

    return { success: true, data: data as BookingWithRelations }
  } catch (error) {
    console.error('Error creating booking:', error)
    return { success: false, error: 'Failed to create booking' }
  }
}

export async function updateBooking(
  id: string,
  formData: Partial<BookingFormData>
): Promise<ActionResult<BookingWithRelations>> {
  try {
    const supabase = await createClient()

    // If time/court changed, check for conflicts
    if (formData.courtId || formData.date || formData.startTime || formData.endTime) {
      // Get current booking to merge with updates
      const currentResult = await getBookingById(id)
      if (!currentResult.success || !currentResult.data) {
        return { success: false, error: 'Booking not found' }
      }

      const current = currentResult.data
      const courtId = formData.courtId || current.court_id
      const date = formData.date || current.date
      const startTime = formData.startTime || current.start_time
      const endTime = formData.endTime || current.end_time

      const conflictCheck = await checkCourtConflict(courtId, date, startTime, endTime, id)

      if (!conflictCheck.success || conflictCheck.data?.hasConflict) {
        return {
          success: false,
          error: conflictCheck.data?.message || 'Court is already booked at this time'
        }
      }
    }

    // Build update object
    const updateData: Record<string, unknown> = {}
    if (formData.courtId !== undefined) updateData.court_id = formData.courtId
    if (formData.date !== undefined) updateData.date = formData.date
    if (formData.startTime !== undefined) updateData.start_time = formData.startTime
    if (formData.endTime !== undefined) updateData.end_time = formData.endTime
    if (formData.bookingType !== undefined) updateData.booking_type = formData.bookingType
    if (formData.groupId !== undefined) updateData.group_id = formData.groupId || null
    if (formData.playerId !== undefined) updateData.player_id = formData.playerId || null
    if (formData.coachId !== undefined) updateData.coach_id = formData.coachId || null
    if (formData.isRecurring !== undefined) updateData.is_recurring = formData.isRecurring
    if (formData.recurringPattern !== undefined) updateData.recurring_pattern = formData.recurringPattern
    if (formData.notes !== undefined) updateData.notes = formData.notes || null
    if (formData.status !== undefined) updateData.status = formData.status

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from('bookings') as any)
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        court:courts(*),
        coach:coaches(*),
        group:groups(*),
        player:players(*)
      `)
      .single()

    if (error) throw error

    return { success: true, data: data as BookingWithRelations }
  } catch (error) {
    console.error('Error updating booking:', error)
    return { success: false, error: 'Failed to update booking' }
  }
}

export async function cancelBooking(id: string): Promise<ActionResult<BookingWithRelations>> {
  try {
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from('bookings') as any)
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select(`
        *,
        court:courts(*),
        coach:coaches(*),
        group:groups(*),
        player:players(*)
      `)
      .single()

    if (error) throw error

    return { success: true, data: data as BookingWithRelations }
  } catch (error) {
    console.error('Error cancelling booking:', error)
    return { success: false, error: 'Failed to cancel booking' }
  }
}

export async function deleteBooking(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('bookings') as any)
      .delete()
      .eq('id', id)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Error deleting booking:', error)
    return { success: false, error: 'Failed to delete booking' }
  }
}

// Conflict detection
type ConflictCheckResult = {
  hasConflict: boolean
  message?: string
  conflictingBookingId?: string
}

export async function checkCourtConflict(
  courtId: string,
  date: string,
  startTime: string,
  endTime: string,
  excludeBookingId?: string
): Promise<ActionResult<ConflictCheckResult>> {
  try {
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase.from('bookings') as any)
      .select('id, start_time, end_time')
      .eq('court_id', courtId)
      .eq('date', date)
      .neq('status', 'cancelled')

    if (excludeBookingId) {
      query = query.neq('id', excludeBookingId)
    }

    const { data: existingBookings, error } = await query

    if (error) throw error

    type BookingTimeSlot = { id: string; start_time: string; end_time: string }
    const bookings = (existingBookings || []) as BookingTimeSlot[]

    // Check for time overlap
    for (const booking of bookings) {
      const existingStart = booking.start_time
      const existingEnd = booking.end_time

      // Check if times overlap
      // New booking starts before existing ends AND new booking ends after existing starts
      if (startTime < existingEnd && endTime > existingStart) {
        return {
          success: true,
          data: {
            hasConflict: true,
            message: `Court is already booked from ${existingStart} to ${existingEnd}`,
            conflictingBookingId: booking.id
          }
        }
      }
    }

    return {
      success: true,
      data: { hasConflict: false }
    }
  } catch (error) {
    console.error('Error checking court conflict:', error)
    return { success: false, error: 'Failed to check conflicts' }
  }
}

export async function checkCoachConflict(
  coachId: string,
  date: string,
  startTime: string,
  endTime: string,
  excludeBookingId?: string
): Promise<ActionResult<ConflictCheckResult>> {
  try {
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase.from('bookings') as any)
      .select('id, start_time, end_time, court:courts(name)')
      .eq('coach_id', coachId)
      .eq('date', date)
      .neq('status', 'cancelled')

    if (excludeBookingId) {
      query = query.neq('id', excludeBookingId)
    }

    const { data: existingBookings, error } = await query

    if (error) throw error

    type BookingTimeSlot = { id: string; start_time: string; end_time: string }
    const bookings = (existingBookings || []) as BookingTimeSlot[]

    for (const booking of bookings) {
      const existingStart = booking.start_time
      const existingEnd = booking.end_time

      if (startTime < existingEnd && endTime > existingStart) {
        return {
          success: true,
          data: {
            hasConflict: true,
            message: `Coach is already teaching from ${existingStart} to ${existingEnd}`,
            conflictingBookingId: booking.id
          }
        }
      }
    }

    return {
      success: true,
      data: { hasConflict: false }
    }
  } catch (error) {
    console.error('Error checking coach conflict:', error)
    return { success: false, error: 'Failed to check conflicts' }
  }
}
