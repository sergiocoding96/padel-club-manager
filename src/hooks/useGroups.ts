'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type {
  GroupWithRelations,
  GroupSummary,
  GroupFilters,
  GroupSortOptions,
  PaginationOptions,
  GroupCreateInput,
  GroupUpdateInput,
  PaginatedResponse,
  AvailablePlayer,
} from '@/types/groups'
import type { Group, GroupPlayer } from '@/types/database'
import type { GroupStatus } from '@/types/database'
import {
  getGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  addPlayerToGroup,
  removePlayerFromGroup,
  getAvailablePlayers,
  subscribeToGroups,
  subscribeToGroupPlayers,
  duplicateGroup,
  isGroupFull,
  getGroupPlayerCount,
  bulkUpdateGroupStatus,
  bulkDeleteGroups,
  bulkAssignCoach,
} from '@/lib/supabase/groups'

// ==========================================
// Types
// ==========================================

interface UseGroupsOptions {
  filters?: GroupFilters
  sort?: GroupSortOptions
  pagination?: PaginationOptions
  enableRealtime?: boolean
}

interface UseGroupsState {
  data: GroupSummary[]
  isLoading: boolean
  error: Error | null
  count: number
  page: number
  pageSize: number
  totalPages: number
}

interface UseGroupState {
  data: GroupWithRelations | null
  isLoading: boolean
  error: Error | null
}

interface MutationState {
  isLoading: boolean
  error: Error | null
}

// ==========================================
// useGroups Hook - List with real-time
// ==========================================

/**
 * Hook for fetching and managing groups list with real-time updates
 */
export function useGroups(options: UseGroupsOptions = {}) {
  const { filters, sort, pagination, enableRealtime = true } = options

  const [state, setState] = useState<UseGroupsState>({
    data: [],
    isLoading: true,
    error: null,
    count: 0,
    page: pagination?.page ?? 1,
    pageSize: pagination?.pageSize ?? 10,
    totalPages: 0,
  })

  const filtersRef = useRef(filters)
  const sortRef = useRef(sort)
  const paginationRef = useRef(pagination)

  // Update refs when options change
  useEffect(() => {
    filtersRef.current = filters
    sortRef.current = sort
    paginationRef.current = pagination
  }, [filters, sort, pagination])

  // Fetch groups function
  const fetchGroups = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await getGroups(
        filtersRef.current,
        sortRef.current,
        paginationRef.current
      )

      setState({
        data: response.data,
        isLoading: false,
        error: null,
        count: response.count,
        page: response.page,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
      })
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err : new Error('Failed to fetch groups'),
      }))
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  // Refetch when filters/sort/pagination change
  useEffect(() => {
    fetchGroups()
  }, [filters, sort, pagination, fetchGroups])

  // Real-time subscription
  useEffect(() => {
    if (!enableRealtime) return

    const unsubscribe = subscribeToGroups((payload) => {
      // Refetch on any change to keep data consistent with filters/sort
      fetchGroups()
    })

    return () => {
      unsubscribe()
    }
  }, [enableRealtime, fetchGroups])

  // Pagination helpers
  const setPage = useCallback((page: number) => {
    setState(prev => ({ ...prev, page }))
  }, [])

  const nextPage = useCallback(() => {
    setState(prev => {
      if (prev.page < prev.totalPages) {
        return { ...prev, page: prev.page + 1 }
      }
      return prev
    })
  }, [])

  const prevPage = useCallback(() => {
    setState(prev => {
      if (prev.page > 1) {
        return { ...prev, page: prev.page - 1 }
      }
      return prev
    })
  }, [])

  return {
    ...state,
    refetch: fetchGroups,
    setPage,
    nextPage,
    prevPage,
    hasNextPage: state.page < state.totalPages,
    hasPrevPage: state.page > 1,
  }
}

// ==========================================
// useGroup Hook - Single group with real-time
// ==========================================

interface UseGroupOptions {
  enableRealtime?: boolean
}

/**
 * Hook for fetching a single group by ID with real-time updates
 */
export function useGroup(id: string | null, options: UseGroupOptions = {}) {
  const { enableRealtime = true } = options

  const [state, setState] = useState<UseGroupState>({
    data: null,
    isLoading: !!id,
    error: null,
  })

  // Fetch group function
  const fetchGroup = useCallback(async () => {
    if (!id) {
      setState({ data: null, isLoading: false, error: null })
      return
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const group = await getGroupById(id)
      setState({
        data: group,
        isLoading: false,
        error: group ? null : new Error('Group not found'),
      })
    } catch (err) {
      setState({
        data: null,
        isLoading: false,
        error: err instanceof Error ? err : new Error('Failed to fetch group'),
      })
    }
  }, [id])

  // Initial fetch
  useEffect(() => {
    fetchGroup()
  }, [fetchGroup])

  // Real-time subscription for group changes
  useEffect(() => {
    if (!enableRealtime || !id) return

    const unsubscribeGroups = subscribeToGroups((payload) => {
      if (payload.eventType === 'UPDATE' && payload.new?.id === id) {
        fetchGroup()
      } else if (payload.eventType === 'DELETE' && payload.old?.id === id) {
        setState({ data: null, isLoading: false, error: new Error('Group was deleted') })
      }
    })

    const unsubscribePlayers = subscribeToGroupPlayers(id, () => {
      // Refetch to get updated player list
      fetchGroup()
    })

    return () => {
      unsubscribeGroups()
      unsubscribePlayers()
    }
  }, [enableRealtime, id, fetchGroup])

  return {
    ...state,
    refetch: fetchGroup,
  }
}

// ==========================================
// useGroupMutations Hook
// ==========================================

/**
 * Hook for group mutations (create, update, delete, player management)
 */
export function useGroupMutations() {
  const [createState, setCreateState] = useState<MutationState>({
    isLoading: false,
    error: null,
  })

  const [updateState, setUpdateState] = useState<MutationState>({
    isLoading: false,
    error: null,
  })

  const [deleteState, setDeleteState] = useState<MutationState>({
    isLoading: false,
    error: null,
  })

  const [playerState, setPlayerState] = useState<MutationState>({
    isLoading: false,
    error: null,
  })

  // Create group
  const create = useCallback(async (input: GroupCreateInput): Promise<Group | null> => {
    setCreateState({ isLoading: true, error: null })

    try {
      const group = await createGroup(input)
      setCreateState({ isLoading: false, error: null })
      return group
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create group')
      setCreateState({ isLoading: false, error })
      return null
    }
  }, [])

  // Update group
  const update = useCallback(async (
    id: string,
    input: GroupUpdateInput
  ): Promise<Group | null> => {
    setUpdateState({ isLoading: true, error: null })

    try {
      const group = await updateGroup(id, input)
      setUpdateState({ isLoading: false, error: null })
      return group
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update group')
      setUpdateState({ isLoading: false, error })
      return null
    }
  }, [])

  // Delete group
  const remove = useCallback(async (id: string, soft = true): Promise<boolean> => {
    setDeleteState({ isLoading: true, error: null })

    try {
      await deleteGroup(id, soft)
      setDeleteState({ isLoading: false, error: null })
      return true
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete group')
      setDeleteState({ isLoading: false, error })
      return false
    }
  }, [])

  // Add player to group
  const addPlayer = useCallback(async (
    groupId: string,
    playerId: string
  ): Promise<GroupPlayer | null> => {
    setPlayerState({ isLoading: true, error: null })

    try {
      const groupPlayer = await addPlayerToGroup(groupId, playerId)
      setPlayerState({ isLoading: false, error: null })
      return groupPlayer
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to add player')
      setPlayerState({ isLoading: false, error })
      return null
    }
  }, [])

  // Remove player from group
  const removePlayer = useCallback(async (
    groupId: string,
    playerId: string
  ): Promise<boolean> => {
    setPlayerState({ isLoading: true, error: null })

    try {
      await removePlayerFromGroup(groupId, playerId)
      setPlayerState({ isLoading: false, error: null })
      return true
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to remove player')
      setPlayerState({ isLoading: false, error })
      return false
    }
  }, [])

  // Duplicate group
  const duplicate = useCallback(async (
    sourceGroupId: string,
    options?: { copyPlayers?: boolean; copySchedule?: boolean }
  ): Promise<Group | null> => {
    setCreateState({ isLoading: true, error: null })

    try {
      const group = await duplicateGroup(sourceGroupId, options)
      setCreateState({ isLoading: false, error: null })
      return group
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to duplicate group')
      setCreateState({ isLoading: false, error })
      return null
    }
  }, [])

  // Reset errors
  const resetErrors = useCallback(() => {
    setCreateState(prev => ({ ...prev, error: null }))
    setUpdateState(prev => ({ ...prev, error: null }))
    setDeleteState(prev => ({ ...prev, error: null }))
    setPlayerState(prev => ({ ...prev, error: null }))
  }, [])

  return {
    create,
    update,
    remove,
    addPlayer,
    removePlayer,
    duplicate,
    resetErrors,
    createState,
    updateState,
    deleteState,
    playerState,
    isLoading:
      createState.isLoading ||
      updateState.isLoading ||
      deleteState.isLoading ||
      playerState.isLoading,
  }
}

// ==========================================
// useAvailablePlayers Hook
// ==========================================

interface UseAvailablePlayersOptions {
  groupId: string
  levelMin?: number
  levelMax?: number
  search?: string
}

/**
 * Hook for fetching available players that can be added to a group
 */
export function useAvailablePlayers(options: UseAvailablePlayersOptions) {
  const { groupId, levelMin, levelMax, search } = options

  const [state, setState] = useState<{
    data: AvailablePlayer[]
    isLoading: boolean
    error: Error | null
  }>({
    data: [],
    isLoading: true,
    error: null,
  })

  const fetchPlayers = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const players = await getAvailablePlayers(groupId, levelMin, levelMax, search)
      setState({
        data: players,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      setState({
        data: [],
        isLoading: false,
        error: err instanceof Error ? err : new Error('Failed to fetch players'),
      })
    }
  }, [groupId, levelMin, levelMax, search])

  useEffect(() => {
    fetchPlayers()
  }, [fetchPlayers])

  return {
    ...state,
    refetch: fetchPlayers,
  }
}

// ==========================================
// useGroupCapacity Hook
// ==========================================

/**
 * Hook for checking group capacity
 */
export function useGroupCapacity(groupId: string | null) {
  const [state, setState] = useState<{
    isFull: boolean
    playerCount: number
    isLoading: boolean
    error: Error | null
  }>({
    isFull: false,
    playerCount: 0,
    isLoading: !!groupId,
    error: null,
  })

  const checkCapacity = useCallback(async () => {
    if (!groupId) {
      setState({ isFull: false, playerCount: 0, isLoading: false, error: null })
      return
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const [full, count] = await Promise.all([
        isGroupFull(groupId),
        getGroupPlayerCount(groupId),
      ])

      setState({
        isFull: full,
        playerCount: count,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err : new Error('Failed to check capacity'),
      }))
    }
  }, [groupId])

  useEffect(() => {
    checkCapacity()
  }, [checkCapacity])

  // Subscribe to player changes
  useEffect(() => {
    if (!groupId) return

    const unsubscribe = subscribeToGroupPlayers(groupId, () => {
      checkCapacity()
    })

    return () => {
      unsubscribe()
    }
  }, [groupId, checkCapacity])

  return {
    ...state,
    refetch: checkCapacity,
  }
}

// ==========================================
// useGroupFilters Hook
// ==========================================

/**
 * Hook for managing group filter state
 */
export function useGroupFilters(initialFilters: GroupFilters = {}) {
  const [filters, setFilters] = useState<GroupFilters>(initialFilters)

  const updateFilter = useCallback(<K extends keyof GroupFilters>(
    key: K,
    value: GroupFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({})
  }, [])

  const clearFilter = useCallback((key: keyof GroupFilters) => {
    setFilters(prev => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  const hasActiveFilters = Object.values(filters).some(
    v => v !== undefined && v !== '' && v !== 'all'
  )

  return {
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    clearFilter,
    hasActiveFilters,
  }
}

// ==========================================
// useGroupSort Hook
// ==========================================

/**
 * Hook for managing group sort state
 */
export function useGroupSort(initialSort: GroupSortOptions = { field: 'name', direction: 'asc' }) {
  const [sort, setSort] = useState<GroupSortOptions>(initialSort)

  const toggleDirection = useCallback(() => {
    setSort(prev => ({
      ...prev,
      direction: prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }, [])

  const setSortField = useCallback((field: GroupSortOptions['field']) => {
    setSort(prev => {
      if (prev.field === field) {
        return { ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
      }
      return { field, direction: 'asc' }
    })
  }, [])

  return {
    sort,
    setSort,
    toggleDirection,
    setSortField,
  }
}

// ==========================================
// useGroupPagination Hook
// ==========================================

/**
 * Hook for managing group pagination state
 */
export function useGroupPagination(
  initialPage = 1,
  initialPageSize = 10,
  totalItems = 0
) {
  const [pagination, setPagination] = useState<PaginationOptions>({
    page: initialPage,
    pageSize: initialPageSize,
  })

  const totalPages = Math.ceil(totalItems / pagination.pageSize)

  const goToPage = useCallback((page: number) => {
    setPagination(prev => ({
      ...prev,
      page: Math.max(1, Math.min(page, totalPages || 1)),
    }))
  }, [totalPages])

  const nextPage = useCallback(() => {
    setPagination(prev => ({
      ...prev,
      page: Math.min(prev.page + 1, totalPages || 1),
    }))
  }, [totalPages])

  const prevPage = useCallback(() => {
    setPagination(prev => ({
      ...prev,
      page: Math.max(prev.page - 1, 1),
    }))
  }, [])

  const setPageSize = useCallback((pageSize: number) => {
    setPagination({ page: 1, pageSize })
  }, [])

  return {
    pagination,
    setPagination,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
    totalPages,
    hasNextPage: pagination.page < totalPages,
    hasPrevPage: pagination.page > 1,
  }
}

// ==========================================
// useGroupSelection Hook
// ==========================================

/**
 * Hook for managing group selection state (multi-select)
 */
export function useGroupSelection(groupIds: string[] = []) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const toggle = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const select = useCallback((id: string) => {
    setSelectedIds(prev => new Set(prev).add(id))
  }, [])

  const deselect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(groupIds))
  }, [groupIds])

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  const isSelected = useCallback((id: string) => {
    return selectedIds.has(id)
  }, [selectedIds])

  return {
    selectedIds: Array.from(selectedIds),
    selectedCount: selectedIds.size,
    toggle,
    select,
    deselect,
    selectAll,
    deselectAll,
    isSelected,
    hasSelection: selectedIds.size > 0,
    isAllSelected: groupIds.length > 0 && selectedIds.size === groupIds.length,
    isPartiallySelected: selectedIds.size > 0 && selectedIds.size < groupIds.length,
  }
}

// ==========================================
// useBulkGroupOperations Hook
// ==========================================

interface BulkOperationResult {
  success: number
  failed: number
}

interface BulkOperationState {
  isLoading: boolean
  error: Error | null
  lastResult: BulkOperationResult | null
}

/**
 * Hook for bulk group operations (activate, deactivate, delete, assign coach)
 */
export function useBulkGroupOperations() {
  const [state, setState] = useState<BulkOperationState>({
    isLoading: false,
    error: null,
    lastResult: null,
  })

  const bulkActivate = useCallback(async (groupIds: string[]): Promise<BulkOperationResult | null> => {
    if (groupIds.length === 0) return null

    setState({ isLoading: true, error: null, lastResult: null })

    try {
      const result = await bulkUpdateGroupStatus(groupIds, 'active')
      setState({ isLoading: false, error: null, lastResult: result })
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to activate groups')
      setState({ isLoading: false, error, lastResult: null })
      return null
    }
  }, [])

  const bulkDeactivate = useCallback(async (groupIds: string[]): Promise<BulkOperationResult | null> => {
    if (groupIds.length === 0) return null

    setState({ isLoading: true, error: null, lastResult: null })

    try {
      const result = await bulkUpdateGroupStatus(groupIds, 'inactive')
      setState({ isLoading: false, error: null, lastResult: result })
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to deactivate groups')
      setState({ isLoading: false, error, lastResult: null })
      return null
    }
  }, [])


  const bulkDelete = useCallback(async (groupIds: string[], soft = true): Promise<BulkOperationResult | null> => {
    if (groupIds.length === 0) return null

    setState({ isLoading: true, error: null, lastResult: null })

    try {
      const result = await bulkDeleteGroups(groupIds, soft)
      setState({ isLoading: false, error: null, lastResult: result })
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete groups')
      setState({ isLoading: false, error, lastResult: null })
      return null
    }
  }, [])

  const bulkSetCoach = useCallback(async (
    groupIds: string[],
    coachId: string | null
  ): Promise<BulkOperationResult | null> => {
    if (groupIds.length === 0) return null

    setState({ isLoading: true, error: null, lastResult: null })

    try {
      const result = await bulkAssignCoach(groupIds, coachId)
      setState({ isLoading: false, error: null, lastResult: result })
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to assign coach')
      setState({ isLoading: false, error, lastResult: null })
      return null
    }
  }, [])

  const resetState = useCallback(() => {
    setState({ isLoading: false, error: null, lastResult: null })
  }, [])

  return {
    ...state,
    bulkActivate,
    bulkDeactivate,
    bulkDelete,
    bulkSetCoach,
    resetState,
  }
}
