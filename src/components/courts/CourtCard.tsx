'use client'

import { cn } from '@/lib/utils'
import { Building2, Trees, Edit2, Trash2, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Court } from '@/types/database'

type CourtCardProps = {
  court: Court
  onEdit: (court: Court) => void
  onDelete: (court: Court) => void
  translations: {
    indoor: string
    outdoor: string
    available: string
    maintenance: string
    reserved: string
    edit: string
    delete: string
  }
}

const statusConfig: Record<Court['status'], { variant: 'success' | 'warning' | 'error', label: keyof CourtCardProps['translations'] }> = {
  available: { variant: 'success', label: 'available' },
  maintenance: { variant: 'warning', label: 'maintenance' },
  reserved: { variant: 'error', label: 'reserved' },
}

export function CourtCard({ court, onEdit, onDelete, translations }: CourtCardProps) {
  const { variant, label } = statusConfig[court.status]
  const isIndoor = court.surface_type === 'indoor'

  return (
    <div
      className={cn(
        'group relative bg-white rounded-xl border border-stone-200 p-5',
        'hover:shadow-md hover:border-stone-300 transition-all duration-200'
      )}
    >
      {/* Icon and Title */}
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center shrink-0',
            isIndoor ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
          )}
        >
          {isIndoor ? <Building2 className="w-6 h-6" /> : <Trees className="w-6 h-6" />}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-stone-800 truncate">{court.name}</h3>
          <p className="text-sm text-stone-500">
            {court.surface_type ? translations[court.surface_type] : '-'}
          </p>
        </div>

        {/* Status Badge */}
        <Badge variant={variant} size="sm">
          {translations[label]}
        </Badge>
      </div>

      {/* Location */}
      {court.location && (
        <div className="mt-3 flex items-center gap-2 text-sm text-stone-500">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="truncate">{court.location}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div
        className={cn(
          'absolute top-4 right-4 flex gap-1',
          'opacity-0 group-hover:opacity-100 transition-opacity'
        )}
      >
        <button
          onClick={() => onEdit(court)}
          className={cn(
            'p-2 rounded-lg text-stone-500',
            'hover:bg-stone-100 hover:text-stone-700 transition-colors'
          )}
          title={translations.edit}
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(court)}
          className={cn(
            'p-2 rounded-lg text-stone-500',
            'hover:bg-red-50 hover:text-red-600 transition-colors'
          )}
          title={translations.delete}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
