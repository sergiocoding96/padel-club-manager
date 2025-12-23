'use client'

import { Calendar, Plus, LayoutGrid, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  type: 'no-courts' | 'no-bookings' | 'no-results' | 'error'
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

const icons = {
  'no-courts': LayoutGrid,
  'no-bookings': Calendar,
  'no-results': Calendar,
  'error': AlertCircle,
}

const colors = {
  'no-courts': 'bg-green-100 text-green-600',
  'no-bookings': 'bg-orange-100 text-orange-600',
  'no-results': 'bg-stone-100 text-stone-500',
  'error': 'bg-red-100 text-red-500',
}

export function EmptyState({
  type,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  const Icon = icons[type]

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4',
        'bg-stone-50 rounded-xl border-2 border-dashed border-stone-200',
        className
      )}
    >
      <div
        className={cn(
          'w-16 h-16 rounded-full flex items-center justify-center mb-4',
          colors[type]
        )}
      >
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-medium text-stone-700 mb-2 text-center">
        {title}
      </h3>
      <p className="text-stone-500 text-center max-w-sm mb-4">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button icon={Plus} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

// Calendar-specific empty states
type CalendarEmptyProps = {
  onAddCourt?: () => void
  onNewBooking?: () => void
  translations: {
    noCourts: string
    addFirstCourt: string
    noBookings: string
    createFirst: string
    noResults: string
    clearFilters: string
  }
}

export function CalendarNoCourts({ onAddCourt, translations }: CalendarEmptyProps) {
  return (
    <EmptyState
      type="no-courts"
      title={translations.noCourts}
      description="Add courts to start managing bookings"
      actionLabel={translations.addFirstCourt}
      onAction={onAddCourt}
    />
  )
}

export function CalendarNoBookings({ onNewBooking, translations }: CalendarEmptyProps) {
  return (
    <EmptyState
      type="no-bookings"
      title={translations.noBookings}
      description="Click on a time slot to create your first booking"
      actionLabel={translations.createFirst}
      onAction={onNewBooking}
    />
  )
}

export function CalendarNoResults({ translations }: CalendarEmptyProps) {
  return (
    <EmptyState
      type="no-results"
      title={translations.noResults}
      description="Try adjusting your filters to see more bookings"
    />
  )
}
