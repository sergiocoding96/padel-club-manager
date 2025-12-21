'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase'
import type { CourtInsert, CourtUpdate, CourtStatus } from '@/types/database'

// Validation types
interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
}

interface ActionResult<T = unknown> {
  success: boolean
  data?: T
  errors?: Record<string, string>
  error?: string
}

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function isValidUUID(id: string): boolean {
  return UUID_REGEX.test(id)
}

// Escape special pattern characters for LIKE/ILIKE queries
function escapePatternChars(input: string): string {
  return input.replace(/[%_\\]/g, '\\$&')
}

// Validation helper
function validateCourt(data: Partial<CourtInsert>): ValidationResult {
  const errors: Record<string, string> = {}

  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'El nombre es obligatorio'
  } else if (data.name.trim().length < 2) {
    errors.name = 'El nombre debe tener al menos 2 caracteres'
  } else if (data.name.length > 100) {
    errors.name = 'El nombre debe tener menos de 100 caracteres'
  }

  // Surface type validation
  if (data.surface_type && !['indoor', 'outdoor'].includes(data.surface_type)) {
    errors.surface_type = 'Tipo de superficie no valido'
  }

  // Status validation
  if (data.status && !['available', 'maintenance', 'reserved'].includes(data.status)) {
    errors.status = 'Estado no valido'
  }

  // Location validation (optional, but max length)
  if (data.location && data.location.length > 255) {
    errors.location = 'La ubicacion debe tener menos de 255 caracteres'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

// Get all courts with optional filters
export async function getCourts(options?: {
  status?: CourtStatus
  search?: string
}) {
  const supabase = createServerClient()

  let query = supabase.from('courts').select('*').order('name')

  if (options?.status) {
    query = query.eq('status', options.status)
  }

  if (options?.search) {
    const escapedSearch = escapePatternChars(options.search)
    query = query.ilike('name', `%${escapedSearch}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching courts:', error)
    throw new Error(`Failed to fetch courts: ${error.message}`)
  }

  return data || []
}

// Get single court by ID
export async function getCourtById(id: string) {
  if (!isValidUUID(id)) {
    throw new Error('Invalid court ID format')
  }

  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('courts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching court:', error)
    throw new Error(`Failed to fetch court: ${error.message}`)
  }

  return data
}

// Create a new court
export async function createCourt(formData: FormData): Promise<ActionResult> {
  const rawData: CourtInsert = {
    name: (formData.get('name') as string)?.trim() || '',
    surface_type: (formData.get('surface_type') as 'indoor' | 'outdoor') || null,
    location: (formData.get('location') as string)?.trim() || null,
    status: (formData.get('status') as CourtStatus) || 'available',
  }

  // Validate input
  const validation = validateCourt(rawData)
  if (!validation.valid) {
    return { success: false, errors: validation.errors }
  }

  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('courts')
    // @ts-ignore - Supabase SSR client type inference issue
    .insert(rawData)
    .select()
    .single()

  if (error) {
    console.error('Error creating court:', error)
    return { success: false, errors: { general: error.message } }
  }

  revalidatePath('/courts')
  return { success: true, data }
}

// Update an existing court
export async function updateCourt(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  if (!isValidUUID(id)) {
    return { success: false, error: 'Invalid court ID format' }
  }

  const rawData: CourtUpdate = {
    name: (formData.get('name') as string)?.trim() || '',
    surface_type: (formData.get('surface_type') as 'indoor' | 'outdoor') || null,
    location: (formData.get('location') as string)?.trim() || null,
    status: (formData.get('status') as CourtStatus) || 'available',
  }

  // Validate input
  const validation = validateCourt(rawData)
  if (!validation.valid) {
    return { success: false, errors: validation.errors }
  }

  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('courts')
    // @ts-ignore - Supabase SSR client type inference issue
    .update(rawData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating court:', error)
    return { success: false, errors: { general: error.message } }
  }

  revalidatePath('/courts')
  return { success: true, data }
}

// Delete a court
export async function deleteCourt(id: string): Promise<ActionResult> {
  if (!isValidUUID(id)) {
    return { success: false, error: 'Invalid court ID format' }
  }

  const supabase = createServerClient()

  const { error } = await supabase.from('courts').delete().eq('id', id)

  if (error) {
    console.error('Error deleting court:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/courts')
  return { success: true }
}

// Quick status update
export async function updateCourtStatus(
  id: string,
  status: CourtStatus
): Promise<ActionResult> {
  if (!isValidUUID(id)) {
    return { success: false, error: 'Invalid court ID format' }
  }

  // Validate status
  if (!['available', 'maintenance', 'reserved'].includes(status)) {
    return { success: false, error: 'Estado no valido' }
  }

  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('courts')
    // @ts-ignore - Supabase SSR client type inference issue
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating court status:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/courts')
  return { success: true, data }
}
