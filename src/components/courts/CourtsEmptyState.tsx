'use client'

import { LayoutGrid, SearchX, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

interface CourtsEmptyStateProps {
  type: 'no-courts' | 'no-results'
  onAddCourt?: () => void
  onClearFilters?: () => void
}

export function CourtsEmptyState({
  type,
  onAddCourt,
  onClearFilters,
}: CourtsEmptyStateProps) {
  const t = useTranslations('courts')
  const tCommon = useTranslations('common')

  const isNoResults = type === 'no-results'

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'py-16 px-6',
        'bg-white rounded-2xl',
        'border border-stone-200/60',
        'text-center'
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'w-16 h-16 rounded-2xl',
          'flex items-center justify-center',
          'mb-5',
          isNoResults
            ? 'bg-amber-100 text-amber-600'
            : 'bg-blue-100 text-blue-600'
        )}
      >
        {isNoResults ? (
          <SearchX className="w-8 h-8" />
        ) : (
          <LayoutGrid className="w-8 h-8" />
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-stone-800 mb-2">
        {isNoResults ? t('noResults') : t('noCourts')}
      </h3>

      {/* Description */}
      <p className="text-stone-500 max-w-sm mb-6">
        {isNoResults ? t('noResultsDescription') : t('noCourtsDescription')}
      </p>

      {/* Action Button */}
      {isNoResults ? (
        <button
          onClick={onClearFilters}
          className={cn(
            'flex items-center gap-2',
            'px-5 py-2.5 rounded-xl',
            'text-sm font-medium',
            'text-stone-600 bg-stone-100 hover:bg-stone-200',
            'transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-stone-500/30'
          )}
        >
          {t('clearFilters')}
        </button>
      ) : (
        <button
          onClick={onAddCourt}
          className={cn(
            'flex items-center gap-2',
            'px-5 py-2.5 rounded-xl',
            'text-sm font-medium text-white',
            'bg-blue-600 hover:bg-blue-700',
            'shadow-sm hover:shadow-md',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/30'
          )}
        >
          <Plus className="w-4 h-4" />
          <span>{t('addCourt')}</span>
        </button>
      )}
    </div>
  )
}
