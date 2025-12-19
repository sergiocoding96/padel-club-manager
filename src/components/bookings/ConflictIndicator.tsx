'use client'

import { AlertTriangle, AlertCircle, Info, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BookingWithRelations, ConflictWarning } from '@/types/bookings'

type ConflictIndicatorProps = {
  conflicts: ConflictWarning[]
  suggestions?: string[]
  className?: string
}

export function ConflictIndicator({ conflicts, suggestions, className }: ConflictIndicatorProps) {
  if (conflicts.length === 0 && (!suggestions || suggestions.length === 0)) {
    return null
  }

  const errors = conflicts.filter((c) => c.type === 'error')
  const warnings = conflicts.filter((c) => c.type === 'warning')

  return (
    <div className={cn('space-y-2', className)}>
      {/* Errors - blocking */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-800 text-sm">Cannot create booking</p>
              <ul className="mt-1 space-y-1">
                {errors.map((error, idx) => (
                  <li key={idx} className="text-sm text-red-700 flex items-start gap-1.5">
                    <span className="text-red-400">•</span>
                    {error.message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Warnings - non-blocking */}
      {warnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800 text-sm">Warning</p>
              <ul className="mt-1 space-y-1">
                {warnings.map((warning, idx) => (
                  <li key={idx} className="text-sm text-amber-700 flex items-start gap-1.5">
                    <span className="text-amber-400">•</span>
                    {warning.message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800 text-sm">Suggestions</p>
              <ul className="mt-1 space-y-1">
                {suggestions.map((suggestion, idx) => (
                  <li key={idx} className="text-sm text-blue-700 flex items-start gap-1.5">
                    <span className="text-blue-400">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Inline conflict badge for calendar slots
type ConflictBadgeProps = {
  type: 'error' | 'warning'
  tooltip?: string
}

export function ConflictBadge({ type, tooltip }: ConflictBadgeProps) {
  return (
    <div
      className={cn(
        'absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center',
        type === 'error' ? 'bg-red-500' : 'bg-amber-500'
      )}
      title={tooltip}
    >
      <AlertTriangle className="w-2.5 h-2.5 text-white" />
    </div>
  )
}

// Conflict check results display
type ConflictResultsProps = {
  checking: boolean
  hasConflicts: boolean
  conflicts: ConflictWarning[]
  onRetry?: () => void
}

export function ConflictResults({ checking, hasConflicts, conflicts, onRetry }: ConflictResultsProps) {
  if (checking) {
    return (
      <div className="flex items-center gap-2 text-sm text-stone-500">
        <div className="w-4 h-4 border-2 border-stone-300 border-t-blue-500 rounded-full animate-spin" />
        <span>Checking availability...</span>
      </div>
    )
  }

  if (!hasConflicts) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600">
        <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 12 12">
            <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
          </svg>
        </div>
        <span>Time slot available</span>
      </div>
    )
  }

  return <ConflictIndicator conflicts={conflicts} />
}
