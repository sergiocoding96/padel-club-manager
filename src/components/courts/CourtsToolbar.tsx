'use client'

import { Search, Grid3X3, List, Plus, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { Input, Select } from '@/components/ui'
import type { CourtStatus } from '@/types/database'

export type ViewMode = 'grid' | 'list'

interface CourtsToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: CourtStatus | 'all'
  onStatusFilterChange: (value: CourtStatus | 'all') => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  onAddCourt: () => void
}

export function CourtsToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  onAddCourt,
}: CourtsToolbarProps) {
  const t = useTranslations('courts')
  const tCommon = useTranslations('common')

  const statusOptions: { value: CourtStatus | 'all'; label: string }[] = [
    { value: 'all', label: t('allStatuses') },
    { value: 'available', label: t('available') },
    { value: 'maintenance', label: t('maintenance') },
    { value: 'reserved', label: t('reserved') },
  ]

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row gap-4',
        'p-4 bg-white rounded-xl',
        'border border-stone-200/60',
        'shadow-sm'
      )}
    >
      {/* Search */}
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <Input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="pl-10 pr-10"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2',
              'p-1 rounded-full',
              'text-stone-400 hover:text-stone-600 hover:bg-stone-100',
              'transition-colors duration-200'
            )}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Status Filter */}
      <div className="w-full sm:w-44">
        <Select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as CourtStatus | 'all')}
          options={statusOptions}
        />
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl">
        <button
          onClick={() => onViewModeChange('grid')}
          className={cn(
            'p-2.5 rounded-lg transition-all duration-200',
            viewMode === 'grid'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-stone-500 hover:text-stone-700'
          )}
          title={t('gridView')}
        >
          <Grid3X3 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          className={cn(
            'p-2.5 rounded-lg transition-all duration-200',
            viewMode === 'list'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-stone-500 hover:text-stone-700'
          )}
          title={t('listView')}
        >
          <List className="w-4 h-4" />
        </button>
      </div>

      {/* Add Court Button */}
      <button
        onClick={onAddCourt}
        className={cn(
          'flex items-center justify-center gap-2',
          'px-5 py-2.5 rounded-xl',
          'text-sm font-medium text-white',
          'bg-blue-600 hover:bg-blue-700',
          'shadow-sm hover:shadow-md',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-blue-500/30',
          'whitespace-nowrap'
        )}
      >
        <Plus className="w-4 h-4" />
        <span>{t('addCourt')}</span>
      </button>
    </div>
  )
}
