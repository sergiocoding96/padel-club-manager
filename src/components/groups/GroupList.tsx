'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  SortAsc,
  SortDesc,
  X,
  ChevronDown,
  Plus,
  Loader2,
  FolderOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { GroupCard, GroupCardSkeleton } from './GroupCard'
import type {
  GroupSummary,
  GroupFilters,
  GroupSortOptions,
  GroupSortField,
  ViewMode,
} from '@/types/groups'

interface GroupListProps {
  groups: GroupSummary[]
  isLoading?: boolean
  error?: Error | null
  filters?: GroupFilters
  sort?: GroupSortOptions
  viewMode?: ViewMode
  onFilterChange?: (filters: GroupFilters) => void
  onSortChange?: (sort: GroupSortOptions) => void
  onViewModeChange?: (mode: ViewMode) => void
  onCreateGroup?: () => void
  locale?: string
  className?: string
}

const SORT_OPTIONS: { field: GroupSortField; labelKey: string }[] = [
  { field: 'name', labelKey: 'sort.name' },
  { field: 'level_min', labelKey: 'sort.level' },
  { field: 'player_count', labelKey: 'sort.players' },
  { field: 'created_at', labelKey: 'sort.created' },
]

export function GroupList({
  groups,
  isLoading = false,
  error = null,
  filters = {},
  sort = { field: 'name', direction: 'asc' },
  viewMode = 'grid',
  onFilterChange,
  onSortChange,
  onViewModeChange,
  onCreateGroup,
  locale = 'es',
  className,
}: GroupListProps) {
  const t = useTranslations('groups')

  const [showFilters, setShowFilters] = useState(false)
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [searchValue, setSearchValue] = useState(filters.search || '')

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.status && filters.status !== 'all') count++
    if (filters.level_min !== undefined) count++
    if (filters.level_max !== undefined) count++
    if (filters.coach_id) count++
    if (filters.search) count++
    return count
  }, [filters])

  // Handle search input
  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    onFilterChange?.({ ...filters, search: value || undefined })
  }

  // Handle status filter
  const handleStatusChange = (status: 'active' | 'inactive' | 'all') => {
    onFilterChange?.({ ...filters, status })
  }

  // Handle sort change
  const handleSortChange = (field: GroupSortField) => {
    if (sort.field === field) {
      onSortChange?.({ field, direction: sort.direction === 'asc' ? 'desc' : 'asc' })
    } else {
      onSortChange?.({ field, direction: 'asc' })
    }
    setShowSortMenu(false)
  }

  // Clear all filters
  const handleClearFilters = () => {
    setSearchValue('')
    onFilterChange?.({})
  }

  // Render loading state
  if (isLoading && groups.length === 0) {
    return (
      <div className={cn('space-y-6', className)}>
        {/* Header Skeleton */}
        <div className="flex items-center justify-between gap-4">
          <div className="h-10 w-64 bg-stone-100 rounded-xl animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-stone-100 rounded-xl animate-pulse" />
            <div className="h-10 w-10 bg-stone-100 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <GroupCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-16', className)}>
        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
          <X className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-medium text-stone-900 mb-2">
          {t('messages.errorLoading')}
        </h3>
        <p className="text-stone-500 text-center max-w-md">
          {error.message}
        </p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Search & Filters */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:flex-none sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder={t('filters.search')}
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className={cn(
                'w-full h-10 pl-10 pr-4 rounded-xl bg-stone-50 border border-stone-200',
                'text-sm placeholder:text-stone-400',
                'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
                'transition-all duration-200'
              )}
            />
            {searchValue && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'relative h-10 px-4 rounded-xl border transition-all duration-200',
              'flex items-center gap-2 text-sm font-medium',
              showFilters || activeFilterCount > 0
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
            )}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">{t('filters.title')}</span>
            {activeFilterCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-semibold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className={cn(
                'h-10 px-3 rounded-xl border border-stone-200 bg-white',
                'flex items-center gap-2 text-sm font-medium text-stone-600',
                'hover:bg-stone-50 transition-colors duration-200'
              )}
            >
              {sort.direction === 'asc' ? (
                <SortAsc className="w-4 h-4" />
              ) : (
                <SortDesc className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">{t(`sort.${sort.field}`)}</span>
              <ChevronDown className={cn(
                'w-4 h-4 transition-transform duration-200',
                showSortMenu && 'rotate-180'
              )} />
            </button>

            {/* Sort Menu */}
            {showSortMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowSortMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-stone-200 bg-white shadow-lg z-20 py-1 overflow-hidden">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.field}
                      onClick={() => handleSortChange(option.field)}
                      className={cn(
                        'w-full px-4 py-2 text-left text-sm flex items-center justify-between',
                        'hover:bg-stone-50 transition-colors',
                        sort.field === option.field && 'bg-blue-50 text-blue-700'
                      )}
                    >
                      <span>{t(option.labelKey)}</span>
                      {sort.field === option.field && (
                        sort.direction === 'asc' ? (
                          <SortAsc className="w-4 h-4" />
                        ) : (
                          <SortDesc className="w-4 h-4" />
                        )
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl border border-stone-200 bg-white p-1">
            <button
              onClick={() => onViewModeChange?.('grid')}
              className={cn(
                'p-2 rounded-lg transition-all duration-200',
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-600'
              )}
              aria-label={t('view.grid')}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange?.('list')}
              className={cn(
                'p-2 rounded-lg transition-all duration-200',
                viewMode === 'list'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-600'
              )}
              aria-label={t('view.list')}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Create Button */}
          {onCreateGroup && (
            <Button onClick={onCreateGroup} icon={Plus} size="md">
              <span className="hidden sm:inline">{t('addGroup')}</span>
              <span className="sm:hidden">{t('actions.create')}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-stone-600">
                {t('filters.status')}:
              </span>
              <div className="flex items-center gap-1">
                {(['all', 'active', 'inactive'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                      filters.status === status || (!filters.status && status === 'all')
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                    )}
                  >
                    {t(`status.${status}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {activeFilterCount > 0 && (
              <button
                onClick={handleClearFilters}
                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                {t('filters.clear')}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Active Filter Badges */}
      {activeFilterCount > 0 && !showFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-stone-500">
            {t('filters.activeFilters', { count: activeFilterCount })}:
          </span>
          {filters.status && filters.status !== 'all' && (
            <Badge variant="info" className="gap-1">
              {t(`status.${filters.status}`)}
              <button
                onClick={() => onFilterChange?.({ ...filters, status: 'all' })}
                className="hover:text-blue-900"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.search && (
            <Badge variant="info" className="gap-1">
              &quot;{filters.search}&quot;
              <button
                onClick={() => handleSearchChange('')}
                className="hover:text-blue-900"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Groups Grid/List */}
      {groups.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center mb-6">
            <FolderOpen className="w-10 h-10 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-stone-900 mb-2">
            {t('empty.title')}
          </h3>
          <p className="text-stone-500 text-center max-w-md mb-6">
            {t('empty.description')}
          </p>
          {onCreateGroup && (
            <Button onClick={onCreateGroup} icon={Plus} size="lg">
              {t('empty.action')}
            </Button>
          )}
        </div>
      ) : (
        <div
          className={cn(
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'flex flex-col gap-3'
          )}
        >
          {groups.map((group, index) => (
            <div
              key={group.id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <GroupCard
                group={group}
                locale={locale}
                className={viewMode === 'list' ? 'max-w-none' : ''}
              />
            </div>
          ))}
        </div>
      )}

      {/* Loading More Indicator */}
      {isLoading && groups.length > 0 && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
      )}
    </div>
  )
}
