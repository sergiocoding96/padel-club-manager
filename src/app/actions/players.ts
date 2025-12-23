'use server'

/**
 * Server actions for player CRUD operations
 */

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Player } from '@/types/database'
import type { PlayerFilters, PlayerSort, PaginationParams, PaginatedResponse } from '@/types/player'
import { getLevelConfig } from '@/types/player'
import {
  createPlayerSchema,
  updatePlayerSchema,
  playerIdSchema,
  playerFilterSchema,
  playerSortSchema,
  paginationSchema,
  transformEmptyStringsToNull,
  type CreatePlayerInput,
  type UpdatePlayerInput,
} from '@/lib/validations/player'

// Response types
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; errors?: Record<string, string[]> }

// Get paginated list of players with filtering and sorting
export async function getPlayers(
  filters?: PlayerFilters,
  sort?: PlayerSort,
  pagination?: PaginationParams
): Promise<ActionResult<PaginatedResponse<Player>>> {
  try {
    const supabase = await createClient()

    // Validate inputs
    const validatedFilters = playerFilterSchema.parse(filters ?? {})
    const validatedSort = playerSortSchema.parse(sort ?? {})
    const validatedPagination = paginationSchema.parse(pagination ?? {})

    // Calculate offset
    const offset = (validatedPagination.page - 1) * validatedPagination.pageSize

    // Build query
    let query = supabase.from('players').select('*', { count: 'exact' })

    // Apply filters
    if (validatedFilters.search) {
      query = query.or(`name.ilike.%${validatedFilters.search}%,email.ilike.%${validatedFilters.search}%,phone.ilike.%${validatedFilters.search}%`)
    }

    if (validatedFilters.status && validatedFilters.status !== 'all') {
      query = query.eq('status', validatedFilters.status)
    }

    if (validatedFilters.levelMin !== undefined) {
      query = query.gte('level_numeric', validatedFilters.levelMin)
    }

    if (validatedFilters.levelMax !== undefined) {
      query = query.lte('level_numeric', validatedFilters.levelMax)
    }

    // Apply sorting
    query = query.order(validatedSort.field, { ascending: validatedSort.direction === 'asc' })

    // Apply pagination
    query = query.range(offset, offset + validatedPagination.pageSize - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching players:', error)
      return { success: false, error: 'Failed to fetch players' }
    }

    const totalPages = Math.ceil((count ?? 0) / validatedPagination.pageSize)

    return {
      success: true,
      data: {
        data: (data ?? []) as Player[],
        total: count ?? 0,
        page: validatedPagination.page,
        pageSize: validatedPagination.pageSize,
        totalPages,
      },
    }
  } catch (error) {
    console.error('Error in getPlayers:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Get a single player by ID
export async function getPlayer(id: string): Promise<ActionResult<Player>> {
  try {
    // Validate ID
    const validationResult = playerIdSchema.safeParse(id)
    if (!validationResult.success) {
      return { success: false, error: 'Invalid player ID format' }
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return { success: false, error: 'Player not found' }
      }
      console.error('Error fetching player:', error)
      return { success: false, error: 'Failed to fetch player' }
    }

    return { success: true, data: data as Player }
  } catch (error) {
    console.error('Error in getPlayer:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Create a new player
export async function createPlayer(input: CreatePlayerInput): Promise<ActionResult<Player>> {
  try {
    // Validate input
    const validationResult = createPlayerSchema.safeParse(input)
    if (!validationResult.success) {
      const errors: Record<string, string[]> = {}
      for (const issue of validationResult.error.issues) {
        const path = issue.path.join('.') || 'root'
        if (!errors[path]) errors[path] = []
        errors[path].push(issue.message)
      }
      return { success: false, error: 'Validation failed', errors }
    }

    const supabase = await createClient()

    // Transform data and get level category
    const data = transformEmptyStringsToNull(validationResult.data)
    const levelConfig = getLevelConfig(data.level_numeric)

    const { data: player, error } = await supabase
      .from('players')
      .insert({
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        level_numeric: data.level_numeric,
        level_category: levelConfig?.category ?? null,
        status: data.status,
        notes: data.notes || null,
        objectives: data.objectives || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating player:', error)
      if (error.code === '23505') {
        return { success: false, error: 'A player with this email already exists' }
      }
      return { success: false, error: 'Failed to create player' }
    }

    // Revalidate the players list page
    revalidatePath('/players')

    return { success: true, data: player as Player }
  } catch (error) {
    console.error('Error in createPlayer:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Update an existing player
export async function updatePlayer(
  id: string,
  input: UpdatePlayerInput
): Promise<ActionResult<Player>> {
  try {
    // Validate ID
    const idValidation = playerIdSchema.safeParse(id)
    if (!idValidation.success) {
      return { success: false, error: 'Invalid player ID format' }
    }

    // Validate input
    const validationResult = updatePlayerSchema.safeParse(input)
    if (!validationResult.success) {
      const errors: Record<string, string[]> = {}
      for (const issue of validationResult.error.issues) {
        const path = issue.path.join('.') || 'root'
        if (!errors[path]) errors[path] = []
        errors[path].push(issue.message)
      }
      return { success: false, error: 'Validation failed', errors }
    }

    const supabase = await createClient()

    // Transform data
    const data = transformEmptyStringsToNull(validationResult.data)

    // Build update object
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (data.name !== undefined) updateData.name = data.name
    if (data.email !== undefined) updateData.email = data.email || null
    if (data.phone !== undefined) updateData.phone = data.phone || null
    if (data.level_numeric !== undefined) {
      updateData.level_numeric = data.level_numeric
      const levelConfig = getLevelConfig(data.level_numeric)
      updateData.level_category = levelConfig?.category ?? null
    }
    if (data.status !== undefined) updateData.status = data.status
    if (data.notes !== undefined) updateData.notes = data.notes || null
    if (data.objectives !== undefined) updateData.objectives = data.objectives || null

    const { data: player, error } = await supabase
      .from('players')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating player:', error)
      if (error.code === 'PGRST116') {
        return { success: false, error: 'Player not found' }
      }
      if (error.code === '23505') {
        return { success: false, error: 'A player with this email already exists' }
      }
      return { success: false, error: 'Failed to update player' }
    }

    // Revalidate pages
    revalidatePath('/players')
    revalidatePath(`/players/${id}`)

    return { success: true, data: player as Player }
  } catch (error) {
    console.error('Error in updatePlayer:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Delete a player (soft delete by setting status to inactive)
export async function deletePlayer(id: string): Promise<ActionResult<Player>> {
  try {
    // Validate ID
    const idValidation = playerIdSchema.safeParse(id)
    if (!idValidation.success) {
      return { success: false, error: 'Invalid player ID format' }
    }

    const supabase = await createClient()

    const { data: player, error } = await supabase
      .from('players')
      .update({
        status: 'inactive',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error deleting player:', error)
      if (error.code === 'PGRST116') {
        return { success: false, error: 'Player not found' }
      }
      return { success: false, error: 'Failed to delete player' }
    }

    // Revalidate pages
    revalidatePath('/players')
    revalidatePath(`/players/${id}`)

    return { success: true, data: player as Player }
  } catch (error) {
    console.error('Error in deletePlayer:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Permanently delete a player (hard delete)
export async function permanentlyDeletePlayer(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    // Validate ID
    const idValidation = playerIdSchema.safeParse(id)
    if (!idValidation.success) {
      return { success: false, error: 'Invalid player ID format' }
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error permanently deleting player:', error)
      return { success: false, error: 'Failed to permanently delete player' }
    }

    // Revalidate pages
    revalidatePath('/players')

    return { success: true, data: { id } }
  } catch (error) {
    console.error('Error in permanentlyDeletePlayer:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Get player statistics
export async function getPlayerStats(): Promise<ActionResult<{
  total: number
  active: number
  inactive: number
  suspended: number
  byLevel: Record<number, number>
}>> {
  try {
    const supabase = await createClient()

    // Get counts by status
    const { data: statusCounts, error: statusError } = await supabase
      .from('players')
      .select('status')

    if (statusError) {
      console.error('Error fetching player stats:', statusError)
      return { success: false, error: 'Failed to fetch player statistics' }
    }

    // Get counts by level
    const { data: levelCounts, error: levelError } = await supabase
      .from('players')
      .select('level_numeric')

    if (levelError) {
      console.error('Error fetching player level stats:', levelError)
      return { success: false, error: 'Failed to fetch player statistics' }
    }

    // Calculate status counts
    const stats = {
      total: statusCounts?.length ?? 0,
      active: 0,
      inactive: 0,
      suspended: 0,
      byLevel: {} as Record<number, number>,
    }

    statusCounts?.forEach((player: { status: string }) => {
      if (player.status === 'active') stats.active++
      else if (player.status === 'inactive') stats.inactive++
      else if (player.status === 'suspended') stats.suspended++
    })

    // Calculate level counts
    levelCounts?.forEach((player: { level_numeric: number | null }) => {
      if (player.level_numeric !== null) {
        const level = Math.round(player.level_numeric)
        stats.byLevel[level] = (stats.byLevel[level] ?? 0) + 1
      }
    })

    return { success: true, data: stats }
  } catch (error) {
    console.error('Error in getPlayerStats:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
