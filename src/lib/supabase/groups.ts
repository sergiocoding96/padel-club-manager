import { getSupabaseClient } from './client'
import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  Group,
  GroupPlayer,
  GroupStatus,
  Player,
  Coach,
  ScheduleTemplate,
  Database
} from '@/types/database'
import type {
  GroupWithRelations,
  GroupSummary,
  GroupFilters,
  GroupSortOptions,
  PaginationOptions,
  GroupCreateInput,
  GroupUpdateInput,
  PlayerInGroup,
  AvailablePlayer,
  PaginatedResponse
} from '@/types/groups'

// Type helper to get typed Supabase client
type TypedSupabaseClient = SupabaseClient<Database>

// ==========================================
// Security Helpers
// ==========================================

/**
 * Validate UUID format to prevent injection attacks
 */
function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}

/**
 * Sanitize search input to prevent SQL filter injection
 */
function sanitizeSearchInput(input: string): string {
  // Escape special SQL LIKE pattern characters
  return input.replace(/[%_\\]/g, '\\$&')
}

// ==========================================
// Group CRUD Operations
// ==========================================

/**
 * Get paginated list of groups with filters and sorting
 */
export async function getGroups(
  filters?: GroupFilters,
  sort?: GroupSortOptions,
  pagination?: PaginationOptions
): Promise<PaginatedResponse<GroupSummary>> {
  const supabase = getSupabaseClient()
  const page = pagination?.page ?? 1
  const pageSize = pagination?.pageSize ?? 10
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('groups')
    .select(`
      id,
      name,
      level_min,
      level_max,
      status,
      max_players,
      schedule_template,
      coach:coaches(name),
      players:group_players(count)
    `, { count: 'exact' })

  // Apply filters
  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }
  if (filters?.level_min !== undefined) {
    query = query.gte('level_min', filters.level_min)
  }
  if (filters?.level_max !== undefined) {
    query = query.lte('level_max', filters.level_max)
  }
  if (filters?.coach_id) {
    query = query.eq('coach_id', filters.coach_id)
  }
  if (filters?.search) {
    const sanitizedSearch = sanitizeSearchInput(filters.search)
    query = query.ilike('name', `%${sanitizedSearch}%`)
  }

  // Apply sorting
  const sortField = sort?.field ?? 'name'
  const sortDirection = sort?.direction ?? 'asc'
  query = query.order(sortField, { ascending: sortDirection === 'asc' })

  // Apply pagination
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    throw new Error(`Failed to fetch groups: ${error.message}`)
  }

  // Transform data to GroupSummary format
  const groups: GroupSummary[] = (data ?? []).map((group: Record<string, unknown>) => {
    const schedule = group.schedule_template as ScheduleTemplate | null
    const nextSession = schedule?.slots?.[0] ?? null
    const coachData = group.coach as { name: string } | null
    const playersData = group.players as { count: number }[] | null

    return {
      id: group.id as string,
      name: group.name as string,
      level_min: group.level_min as number | null,
      level_max: group.level_max as number | null,
      status: group.status as GroupStatus,
      max_players: group.max_players as number,
      player_count: playersData?.[0]?.count ?? 0,
      coach_name: coachData?.name ?? null,
      next_session: nextSession,
    }
  })

  return {
    data: groups,
    count: count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  }
}

/**
 * Get a single group by ID with all relations
 */
export async function getGroupById(id: string): Promise<GroupWithRelations | null> {
  const supabase = getSupabaseClient()

  const { data: groupData, error } = await supabase
    .from('groups')
    .select(`
      *,
      coach:coaches(*),
      group_players(
        *,
        player:players(*)
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Not found
    }
    throw new Error(`Failed to fetch group: ${error.message}`)
  }

  if (!groupData) return null

  // Cast to a workable type
  const group = groupData as unknown as Record<string, unknown>
  const groupPlayers = (group.group_players ?? []) as Array<Record<string, unknown>>

  // Transform players data
  const players: PlayerInGroup[] = groupPlayers.map((gp) => {
    const player = gp.player as Player
    return {
      id: player.id,
      name: player.name,
      email: player.email,
      level_numeric: player.level_numeric,
      level_category: player.level_category,
      joined_at: gp.joined_at as string,
      membership_status: gp.status as GroupPlayer['status'],
    }
  })

  // Build the result with proper typing
  const result: GroupWithRelations = {
    id: group.id as string,
    name: group.name as string,
    description: group.description as string | null,
    level_min: group.level_min as number | null,
    level_max: group.level_max as number | null,
    coach_id: group.coach_id as string | null,
    court_id: group.court_id as string | null,
    max_players: group.max_players as number,
    schedule_template: group.schedule_template as ScheduleTemplate | null,
    color: group.color as string | null,
    status: group.status as GroupStatus,
    created_at: group.created_at as string,
    updated_at: group.updated_at as string,
    coach: group.coach as Coach | null,
    court: null, // TODO: Add court relation when needed
    players,
    player_count: players.length,
  }

  return result
}

/**
 * Create a new group
 */
export async function createGroup(input: GroupCreateInput): Promise<Group> {
  const supabase = getSupabaseClient()

  const insertData = {
    name: input.name,
    description: input.description ?? null,
    level_min: input.level_min,
    level_max: input.level_max,
    max_players: input.max_players,
    coach_id: input.coach_id ?? null,
    court_id: input.court_id ?? null,
    schedule_template: input.schedule_template ?? null,
    color: input.color ?? null,
    status: 'active' as const,
  }


  const { data, error } = await (supabase as any)
    .from('groups')
    .insert(insertData)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create group: ${error.message}`)
  }

  return data as Group
}

/**
 * Update an existing group
 */
export async function updateGroup(id: string, input: GroupUpdateInput): Promise<Group> {
  const supabase = getSupabaseClient()

  const updateData: Record<string, unknown> = {}

  if (input.name !== undefined) updateData.name = input.name
  if (input.description !== undefined) updateData.description = input.description
  if (input.level_min !== undefined) updateData.level_min = input.level_min
  if (input.level_max !== undefined) updateData.level_max = input.level_max
  if (input.max_players !== undefined) updateData.max_players = input.max_players
  if (input.coach_id !== undefined) updateData.coach_id = input.coach_id
  if (input.court_id !== undefined) updateData.court_id = input.court_id
  if (input.schedule_template !== undefined) updateData.schedule_template = input.schedule_template
  if (input.color !== undefined) updateData.color = input.color
  if (input.status !== undefined) updateData.status = input.status


  const { data, error } = await (supabase as any)
    .from('groups')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update group: ${error.message}`)
  }

  return data as Group
}

/**
 * Delete a group (or soft delete by setting status to inactive)
 */
export async function deleteGroup(id: string, soft = true): Promise<void> {
  const supabase = getSupabaseClient()

  if (soft) {
  
    const { error } = await (supabase as any)
      .from('groups')
      .update({ status: 'inactive' })
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to deactivate group: ${error.message}`)
    }
  } else {
  
    const { error } = await (supabase as any)
      .from('groups')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete group: ${error.message}`)
    }
  }
}

// ==========================================
// Group Player Operations
// ==========================================

/**
 * Add a player to a group
 */
export async function addPlayerToGroup(groupId: string, playerId: string): Promise<GroupPlayer> {
  const supabase = getSupabaseClient()

  const insertData = {
    group_id: groupId,
    player_id: playerId,
    status: 'active',
  }


  const { data, error } = await (supabase as any)
    .from('group_players')
    .insert(insertData)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      throw new Error('Player is already in this group')
    }
    throw new Error(`Failed to add player to group: ${error.message}`)
  }

  return data as GroupPlayer
}

/**
 * Remove a player from a group
 */
export async function removePlayerFromGroup(groupId: string, playerId: string): Promise<void> {
  const supabase = getSupabaseClient()

  const { error } = await supabase
    .from('group_players')
    .delete()
    .eq('group_id', groupId)
    .eq('player_id', playerId)

  if (error) {
    throw new Error(`Failed to remove player from group: ${error.message}`)
  }
}

/**
 * Get available players that can be added to a group
 */
export async function getAvailablePlayers(
  groupId: string,
  levelMin?: number,
  levelMax?: number,
  search?: string
): Promise<AvailablePlayer[]> {
  // Validate UUID to prevent injection
  if (!isValidUUID(groupId)) {
    throw new Error('Invalid group ID format')
  }

  const supabase = getSupabaseClient()

  // First, get existing player IDs in this group (safe approach)
  const { data: existingPlayers } = await supabase
    .from('group_players')
    .select('player_id')
    .eq('group_id', groupId)

  const existingPlayerIds = (existingPlayers as { player_id: string }[] | null)?.map(p => p.player_id) ?? []

  // Get players not already in this group
  let query = supabase
    .from('players')
    .select(`
      id,
      name,
      email,
      level_numeric,
      level_category,
      status,
      group_players(
        group:groups(name)
      )
    `)
    .eq('status', 'active')

  // Filter out existing players using safe array filter
  if (existingPlayerIds.length > 0) {
    query = query.not('id', 'in', `(${existingPlayerIds.join(',')})`)
  }

  if (search) {
    // Sanitize search input to prevent filter injection
    const sanitizedSearch = sanitizeSearchInput(search)
    query = query.or(`name.ilike.%${sanitizedSearch}%,email.ilike.%${sanitizedSearch}%`)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch available players: ${error.message}`)
  }

  return (data ?? []).map((player: Record<string, unknown>) => {
    const level = player.level_numeric as number | null
    const groupPlayers = player.group_players as { group: { name: string } }[] | null
    const isCompatible = level !== null && levelMin !== undefined && levelMax !== undefined
      ? level >= levelMin && level <= levelMax
      : true

    return {
      id: player.id as string,
      name: player.name as string,
      email: player.email as string | null,
      level_numeric: level,
      level_category: player.level_category as string | null,
      status: player.status as Player['status'],
      current_groups: groupPlayers?.map(gp => gp.group.name) ?? [],
      level_compatible: isCompatible,
    }
  })
}

// ==========================================
// Real-time Subscriptions
// ==========================================

/**
 * Subscribe to groups table changes
 */
export function subscribeToGroups(callback: (payload: {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: Group | null
  old: Group | null
}) => void) {
  const supabase = getSupabaseClient()

  const subscription = supabase
    .channel('groups-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'groups',
      },
      (payload) => {
        callback({
          eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
          new: payload.new as Group | null,
          old: payload.old as Group | null,
        })
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(subscription)
  }
}

/**
 * Subscribe to group_players table changes for a specific group
 */
export function subscribeToGroupPlayers(
  groupId: string,
  callback: (payload: {
    eventType: 'INSERT' | 'UPDATE' | 'DELETE'
    new: GroupPlayer | null
    old: GroupPlayer | null
  }) => void
) {
  const supabase = getSupabaseClient()

  const subscription = supabase
    .channel(`group-players-${groupId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'group_players',
        filter: `group_id=eq.${groupId}`,
      },
      (payload) => {
        callback({
          eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
          new: payload.new as GroupPlayer | null,
          old: payload.old as GroupPlayer | null,
        })
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(subscription)
  }
}

// ==========================================
// Utility Functions
// ==========================================

/**
 * Check if a group is full
 */
export async function isGroupFull(groupId: string): Promise<boolean> {
  const supabase = getSupabaseClient()

  const { data: groupData, error: groupError } = await supabase
    .from('groups')
    .select('max_players')
    .eq('id', groupId)
    .single()

  if (groupError) {
    throw new Error(`Failed to fetch group: ${groupError.message}`)
  }

  const group = groupData as unknown as { max_players: number } | null

  const { count, error: countError } = await supabase
    .from('group_players')
    .select('*', { count: 'exact', head: true })
    .eq('group_id', groupId)
    .eq('status', 'active')

  if (countError) {
    throw new Error(`Failed to count players: ${countError.message}`)
  }

  return (count ?? 0) >= (group?.max_players ?? 0)
}

/**
 * Get group player count
 */
export async function getGroupPlayerCount(groupId: string): Promise<number> {
  const supabase = getSupabaseClient()

  const { count, error } = await supabase
    .from('group_players')
    .select('*', { count: 'exact', head: true })
    .eq('group_id', groupId)
    .eq('status', 'active')

  if (error) {
    throw new Error(`Failed to count players: ${error.message}`)
  }

  return count ?? 0
}

/**
 * Duplicate a group
 */
export async function duplicateGroup(
  sourceGroupId: string,
  options: { copyPlayers?: boolean; copySchedule?: boolean } = {}
): Promise<Group> {
  const sourceGroup = await getGroupById(sourceGroupId)

  if (!sourceGroup) {
    throw new Error('Source group not found')
  }

  const newGroup = await createGroup({
    name: `${sourceGroup.name} (Copy)`,
    level_min: sourceGroup.level_min ?? 1,
    level_max: sourceGroup.level_max ?? 7,
    max_players: sourceGroup.max_players,
    coach_id: sourceGroup.coach_id,
    schedule_template: options.copySchedule ? sourceGroup.schedule_template : null,
  })

  if (options.copyPlayers && sourceGroup.players.length > 0) {
    const supabase = getSupabaseClient()
    const playerInserts = sourceGroup.players.map(p => ({
      group_id: newGroup.id,
      player_id: p.id,
      status: 'active' as const,
    }))

  
    const { error } = await (supabase as any)
      .from('group_players')
      .insert(playerInserts)

    if (error) {
      console.error('Failed to copy players:', error)
    }
  }

  return newGroup
}

// ==========================================
// Bulk Operations
// ==========================================

/**
 * Bulk update group status (activate/deactivate)
 */
export async function bulkUpdateGroupStatus(
  groupIds: string[],
  status: GroupStatus
): Promise<{ success: number; failed: number }> {
  const supabase = getSupabaseClient()

  let success = 0
  let failed = 0

  // Process in batches to avoid overloading
  for (const id of groupIds) {
    try {
    
      const { error } = await (supabase as any)
        .from('groups')
        .update({ status })
        .eq('id', id)

      if (error) {
        failed++
      } else {
        success++
      }
    } catch {
      failed++
    }
  }

  return { success, failed }
}

/**
 * Bulk delete groups (soft delete)
 */
export async function bulkDeleteGroups(
  groupIds: string[],
  soft = true
): Promise<{ success: number; failed: number }> {
  const supabase = getSupabaseClient()

  let success = 0
  let failed = 0

  for (const id of groupIds) {
    try {
      if (soft) {
      
        const { error } = await (supabase as any)
          .from('groups')
          .update({ status: 'inactive' })
          .eq('id', id)

        if (error) {
          failed++
        } else {
          success++
        }
      } else {
      
        const { error } = await (supabase as any)
          .from('groups')
          .delete()
          .eq('id', id)

        if (error) {
          failed++
        } else {
          success++
        }
      }
    } catch {
      failed++
    }
  }

  return { success, failed }
}

/**
 * Bulk assign coach to groups
 */
export async function bulkAssignCoach(
  groupIds: string[],
  coachId: string | null
): Promise<{ success: number; failed: number }> {
  const supabase = getSupabaseClient()

  let success = 0
  let failed = 0

  for (const id of groupIds) {
    try {
    
      const { error } = await (supabase as any)
        .from('groups')
        .update({ coach_id: coachId })
        .eq('id', id)

      if (error) {
        failed++
      } else {
        success++
      }
    } catch {
      failed++
    }
  }

  return { success, failed }
}
