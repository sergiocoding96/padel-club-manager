'use client'

import { useState } from 'react'
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BOOKING_COLORS } from '@/types/bookings'
import type { BookingType, BookingStatus, BookingFilters as Filters } from '@/types/bookings'
import type { Court, Coach } from '@/types/database'

type BookingFiltersProps = {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  courts: Court[]
  coaches: Coach[]
  translations: {
    title: string
    byType: string
    byCourt: string
    byCoach: string
    byStatus: string
    showCancelled: string
    clearFilters: string
    rental: string
    groupClass: string
    privateLesson: string
    pending: string
    confirmed: string
    cancelled: string
    allCourts: string
    allCoaches: string
  }
}

const BOOKING_TYPE_OPTIONS: { value: BookingType; labelKey: 'rental' | 'groupClass' | 'privateLesson' }[] = [
  { value: 'rental', labelKey: 'rental' },
  { value: 'group_class', labelKey: 'groupClass' },
  { value: 'private_lesson', labelKey: 'privateLesson' },
]

const STATUS_OPTIONS: { value: BookingStatus; labelKey: 'pending' | 'confirmed' | 'cancelled' }[] = [
  { value: 'pending', labelKey: 'pending' },
  { value: 'confirmed', labelKey: 'confirmed' },
  { value: 'cancelled', labelKey: 'cancelled' },
]

export function BookingFilters({
  filters,
  onFiltersChange,
  courts,
  coaches,
  translations,
}: BookingFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const activeFilterCount = [
    filters.bookingTypes.length < 3 ? filters.bookingTypes.length : 0,
    filters.courtIds.length > 0 ? 1 : 0,
    filters.coachId ? 1 : 0,
    filters.status.length < 3 ? 1 : 0,
    filters.showCancelled ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  const toggleType = (type: BookingType) => {
    const current = filters.bookingTypes
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type]
    onFiltersChange({ ...filters, bookingTypes: updated })
  }

  const toggleCourt = (courtId: string) => {
    const current = filters.courtIds
    const updated = current.includes(courtId)
      ? current.filter((id) => id !== courtId)
      : [...current, courtId]
    onFiltersChange({ ...filters, courtIds: updated })
  }

  const toggleStatus = (status: BookingStatus) => {
    const current = filters.status
    const updated = current.includes(status)
      ? current.filter((s) => s !== status)
      : [...current, status]
    onFiltersChange({ ...filters, status: updated })
  }

  const clearFilters = () => {
    onFiltersChange({
      bookingTypes: ['rental', 'group_class', 'private_lesson'],
      courtIds: [],
      coachId: null,
      status: ['pending', 'confirmed'],
      showCancelled: false,
    })
  }

  return (
    <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-stone-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-stone-500" />
          <span className="text-sm font-medium text-stone-700">{translations.title}</span>
          {activeFilterCount > 0 && (
            <Badge variant="info" size="sm">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-stone-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-stone-400" />
        )}
      </button>

      {/* Filters Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-stone-100 space-y-4">
          {/* Booking Types */}
          <div className="pt-4">
            <label className="block text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
              {translations.byType}
            </label>
            <div className="flex flex-wrap gap-2">
              {BOOKING_TYPE_OPTIONS.map(({ value, labelKey }) => {
                const isActive = filters.bookingTypes.includes(value)
                const colors = BOOKING_COLORS[value]

                return (
                  <button
                    key={value}
                    onClick={() => toggleType(value)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                      isActive
                        ? `${colors.bg} ${colors.text} border-current`
                        : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300'
                    )}
                  >
                    {translations[labelKey]}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Courts */}
          <div>
            <label className="block text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
              {translations.byCourt}
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onFiltersChange({ ...filters, courtIds: [] })}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                  filters.courtIds.length === 0
                    ? 'bg-blue-50 text-blue-700 border-blue-300'
                    : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300'
                )}
              >
                {translations.allCourts}
              </button>
              {courts.map((court) => {
                const isActive = filters.courtIds.includes(court.id)
                return (
                  <button
                    key={court.id}
                    onClick={() => toggleCourt(court.id)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-blue-300'
                        : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300'
                    )}
                  >
                    {court.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Coaches */}
          {coaches.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
                {translations.byCoach}
              </label>
              <select
                value={filters.coachId || ''}
                onChange={(e) => onFiltersChange({ ...filters, coachId: e.target.value || null })}
                className={cn(
                  'w-full rounded-lg border border-stone-300 px-3 py-2',
                  'text-stone-900 bg-white text-sm',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                )}
              >
                <option value="">{translations.allCoaches}</option>
                {coaches.map((coach) => (
                  <option key={coach.id} value={coach.id}>
                    {coach.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
              {translations.byStatus}
            </label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map(({ value, labelKey }) => {
                const isActive = filters.status.includes(value)
                const statusColors = {
                  pending: 'bg-amber-50 text-amber-700 border-amber-300',
                  confirmed: 'bg-green-50 text-green-700 border-green-300',
                  cancelled: 'bg-red-50 text-red-700 border-red-300',
                }

                return (
                  <button
                    key={value}
                    onClick={() => toggleStatus(value)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                      isActive
                        ? statusColors[value]
                        : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300'
                    )}
                  >
                    {translations[labelKey]}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Show Cancelled Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.showCancelled}
              onChange={(e) => onFiltersChange({ ...filters, showCancelled: e.target.checked })}
              className="rounded border-stone-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-stone-700">{translations.showCancelled}</span>
          </label>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              icon={X}
              onClick={clearFilters}
              className="w-full"
            >
              {translations.clearFilters}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
