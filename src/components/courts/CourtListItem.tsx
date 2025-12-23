'use client'

import { Edit, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import type { Court, CourtStatus } from '@/types/database'
import { CourtStatusBadge } from './CourtStatusBadge'
import { SurfaceTypeIndicator } from './SurfaceTypeIndicator'

interface CourtListItemProps {
  court: Court
  onEdit: (court: Court) => void
  onDelete: (court: Court) => void
  onStatusChange: (court: Court, status: CourtStatus) => void
}

export function CourtListItem({
  court,
  onEdit,
  onDelete,
}: CourtListItemProps) {
  const tCommon = useTranslations('common')

  // Color indicator based on surface type
  const indicatorColor =
    court.surface_type === 'indoor'
      ? 'bg-gradient-to-b from-blue-500 to-indigo-600'
      : court.surface_type === 'outdoor'
        ? 'bg-gradient-to-b from-emerald-500 to-teal-600'
        : 'bg-gradient-to-b from-stone-400 to-stone-500'

  return (
    <div
      className={cn(
        'group bg-white rounded-xl border border-stone-200/60',
        'p-4 flex items-center gap-4',
        'hover:border-stone-300 hover:shadow-md hover:shadow-stone-100/50',
        'transition-all duration-300'
      )}
    >
      {/* Color indicator bar */}
      <div
        className={cn(
          'w-1.5 h-14 rounded-full flex-shrink-0',
          'transition-transform duration-300',
          'group-hover:scale-y-110',
          indicatorColor
        )}
      />

      {/* Court info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-stone-800 truncate">
            {court.name}
          </h3>
          <CourtStatusBadge status={court.status} />
        </div>
        <div className="flex items-center gap-4 mt-1.5">
          <SurfaceTypeIndicator type={court.surface_type} />
          {court.location && (
            <>
              <span className="text-stone-300">|</span>
              <span className="text-sm text-stone-500 truncate">
                {court.location}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => onEdit(court)}
          className={cn(
            'p-2.5 rounded-xl',
            'text-stone-400 hover:text-blue-600 hover:bg-blue-50',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/30'
          )}
          title={tCommon('edit')}
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(court)}
          className={cn(
            'p-2.5 rounded-xl',
            'text-stone-400 hover:text-rose-600 hover:bg-rose-50',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-rose-500/30'
          )}
          title={tCommon('delete')}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
