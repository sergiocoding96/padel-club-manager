'use server'

import { createClient } from '@/lib/supabase/server'
import type { Court } from '@/types/database'

export type CourtFormData = {
  name: string
  surface_type: 'indoor' | 'outdoor' | null
  location: string | null
  status: 'available' | 'maintenance' | 'reserved'
}

export type ActionResult<T = void> = {
  success: boolean
  data?: T
  error?: string
}

export async function getCourts(): Promise<ActionResult<Court[]>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('courts')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return { success: true, data: (data as Court[]) ?? [] }
  } catch (error) {
    console.error('Error fetching courts:', error)
    return { success: false, error: 'Failed to fetch courts' }
  }
}

export async function getCourtById(id: string): Promise<ActionResult<Court>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('courts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return { success: true, data: data as Court }
  } catch (error) {
    console.error('Error fetching court:', error)
    return { success: false, error: 'Failed to fetch court' }
  }
}

export async function createCourt(formData: CourtFormData): Promise<ActionResult<Court>> {
  try {
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from('courts') as any)
      .insert({
        name: formData.name,
        surface_type: formData.surface_type,
        location: formData.location,
        status: formData.status,
      })
      .select()
      .single()

    if (error) throw error
    return { success: true, data: data as Court }
  } catch (error) {
    console.error('Error creating court:', error)
    return { success: false, error: 'Failed to create court' }
  }
}

export async function updateCourt(id: string, formData: CourtFormData): Promise<ActionResult<Court>> {
  try {
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from('courts') as any)
      .update({
        name: formData.name,
        surface_type: formData.surface_type,
        location: formData.location,
        status: formData.status,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return { success: true, data: data as Court }
  } catch (error) {
    console.error('Error updating court:', error)
    return { success: false, error: 'Failed to update court' }
  }
}

export async function deleteCourt(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()

    // Check for existing bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('id')
      .eq('court_id', id)
      .limit(1)

    if (bookingsError) throw bookingsError

    if (bookings && bookings.length > 0) {
      return {
        success: false,
        error: 'Cannot delete court with existing bookings. Please cancel or reassign bookings first.'
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('courts') as any)
      .delete()
      .eq('id', id)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error deleting court:', error)
    return { success: false, error: 'Failed to delete court' }
  }
}
