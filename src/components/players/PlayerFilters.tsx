'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { PlayerFilters as PlayerFiltersType, PlayerStatus, SortField, SortOrder } from '@/types/player'
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ArrowUpDown,
  LayoutGrid,
  List,
  Filter,
} from 'lucide-react'

interface PlayerFiltersProps {
  filters: PlayerFiltersType
  onFiltersChange: (filters: PlayerFiltersType) => void
  sortField: SortField
  sortOrder: SortOrder
  onSortChange: (field: SortField, order: SortOrder) => void
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  className?: string
}

const statusOptions: PlayerStatus[] = ['active', 'inactive', 'suspended']
const levelOptions = [1, 2, 3, 4, 5, 6, 7]
const sortOptions: { field: SortField; label: string }[] = [
  { field: 'name', label: 'name' },
  { field: 'level', label: 'level' },
  { field: 'createdAt', label: 'createdAt' },
  { field: 'updatedAt', label: 'updatedAt' },
]

export function PlayerFilters({
  filters,
  onFiltersChange,
  sortField,
  sortOrder,
  onSortChange,
  viewMode,
  onViewModeChange,
  className,
}: PlayerFiltersProps) {
  const t = useTranslations('players')
  const tLevels = useTranslations('levels')
  const tCommon = useTranslations('common')
  const [showFilters, setShowFilters] = useState(false)
  const [showSort, setShowSort] = useState(false)

  const hasActiveFilters =
    filters.search ||
    filters.status ||
    filters.levelMin !== undefined ||
    filters.levelMax !== undefined

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value || undefined })
  }

  const handleStatusChange = (status: PlayerStatus | undefined) => {
    onFiltersChange({ ...filters, status })
  }

  const handleLevelRangeChange = (min: number | undefined, max: number | undefined) => {
    onFiltersChange({ ...filters, levelMin: min, levelMax: max })
  }

  const clearFilters = () => {
    onFiltersChange({})
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder={t('filters.searchPlaceholder')}
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className={cn(
              'w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-10 pr-4',
              'text-sm placeholder:text-stone-400',
              'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
              'transition-all duration-200'
            )}
          />
          {filters.search && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter & Sort buttons */}
        <div className="flex gap-2">
          {/* Filter button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all',
              showFilters || hasActiveFilters
                ? 'border-blue-200 bg-blue-50 text-blue-700'
                : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">{tCommon('filter')}</span>
            {hasActiveFilters && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                {[filters.status, filters.levelMin !== undefined || filters.levelMax !== undefined].filter(Boolean).length}
              </span>
            )}
          </button>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSort(!showSort)}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition-all',
                'hover:bg-stone-50',
                showSort && 'bg-stone-50'
              )}
            >
              <ArrowUpDown className="h-4 w-4" />
              <span className="hidden sm:inline">{t('sort.sortBy')}</span>
              <ChevronDown className={cn('h-4 w-4 transition-transform', showSort && 'rotate-180')} />
            </button>

            {showSort && (
              <div className="absolute right-0 top-full z-20 mt-2 w-56 animate-scale-in rounded-xl border border-stone-200 bg-white py-2 shadow-xl">
                {sortOptions.map((option) => (
                  <button
                    key={option.field}
                    onClick={() => {
                      const newOrder = sortField === option.field && sortOrder === 'asc' ? 'desc' : 'asc'
                      onSortChange(option.field, newOrder)
                      setShowSort(false)
                    }}
                    className={cn(
                      'flex w-full items-center justify-between px-4 py-2 text-sm transition-colors',
                      sortField === option.field
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-stone-700 hover:bg-stone-50'
                    )}
                  >
                    {t(`sort.${option.label}`)}
                    {sortField === option.field && (
                      <span className="text-xs text-blue-500">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View mode toggle */}
          <div className="hidden sm:flex rounded-xl border border-stone-200 bg-white p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={cn(
                'rounded-lg p-2 transition-colors',
                viewMode === 'grid'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-500 hover:text-stone-700'
              )}
              title={t('view.grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={cn(
                'rounded-lg p-2 transition-colors',
                viewMode === 'list'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-500 hover:text-stone-700'
              )}
              title={t('view.list')}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Expandable filter panel */}
      {showFilters && (
        <div className="animate-fade-in rounded-xl border border-stone-200 bg-white p-4">
          <div className="flex flex-wrap gap-6">
            {/* Status filter */}
            <div className="min-w-[180px]">
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-stone-500">
                {t('status')}
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleStatusChange(undefined)}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-sm font-medium transition-all',
                    !filters.status
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  )}
                >
                  {t('filters.allStatuses')}
                </button>
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(filters.status === status ? undefined : status)}
                    className={cn(
                      'rounded-full px-3 py-1.5 text-sm font-medium transition-all',
                      filters.status === status
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    )}
                  >
                    {t(`status.${status}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Level range filter */}
            <div className="min-w-[220px]">
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-stone-500">
                {t('filters.levelRange')}
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={filters.levelMin ?? ''}
                  onChange={(e) =>
                    handleLevelRangeChange(
                      e.target.value ? Number(e.target.value) : undefined,
                      filters.levelMax
                    )
                  }
                  className="flex-1 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">{t('filters.from')}</option>
                  {levelOptions.map((level) => (
                    <option key={level} value={level}>
                      {level} - {tLevels(String(level))}
                    </option>
                  ))}
                </select>
                <span className="text-stone-400">—</span>
                <select
                  value={filters.levelMax ?? ''}
                  onChange={(e) =>
                    handleLevelRangeChange(
                      filters.levelMin,
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="flex-1 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">{t('filters.to')}</option>
                  {levelOptions.map((level) => (
                    <option key={level} value={level}>
                      {level} - {tLevels(String(level))}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <X className="h-4 w-4" />
                  {t('filters.clearFilters')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Active filter tags */}
      {hasActiveFilters && !showFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-stone-400" />
          {filters.status && (
            <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-sm">
              {t(`status.${filters.status}`)}
              <button
                onClick={() => handleStatusChange(undefined)}
                className="ml-1 rounded-full p-0.5 hover:bg-stone-200"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {(filters.levelMin !== undefined || filters.levelMax !== undefined) && (
            <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-sm">
              {t('level')}: {filters.levelMin ?? 1} - {filters.levelMax ?? 7}
              <button
                onClick={() => handleLevelRangeChange(undefined, undefined)}
                className="ml-1 rounded-full p-0.5 hover:bg-stone-200"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          <button
            onClick={clearFilters}
            className="text-sm text-stone-500 hover:text-stone-700"
          >
            {t('filters.clearFilters')}
          </button>
        </div>
      )}
    </div>
  )
}

export default PlayerFilters
