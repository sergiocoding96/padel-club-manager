'use client'

import { useState, useMemo } from 'react'
import { format, addDays, addWeeks, addMonths, isBefore, isAfter } from 'date-fns'
import { es, enUS } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Repeat, Calendar, Hash, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { RecurringPattern } from '@/types/bookings'

type RecurringFormProps = {
  enabled: boolean
  onEnabledChange: (enabled: boolean) => void
  pattern: RecurringPattern | null
  onPatternChange: (pattern: RecurringPattern | null) => void
  startDate: string
  locale?: string
  translations: {
    enable: string
    frequency: string
    daily: string
    weekly: string
    biweekly: string
    monthly: string
    daysOfWeek: string
    endDate: string
    occurrences: string
    preview: string
    mon: string
    tue: string
    wed: string
    thu: string
    fri: string
    sat: string
    sun: string
  }
}

const FREQUENCIES: { value: RecurringPattern['frequency']; labelKey: 'daily' | 'weekly' | 'biweekly' | 'monthly' }[] = [
  { value: 'daily', labelKey: 'daily' },
  { value: 'weekly', labelKey: 'weekly' },
  { value: 'biweekly', labelKey: 'biweekly' },
  { value: 'monthly', labelKey: 'monthly' },
]

const DAYS_OF_WEEK = [
  { value: 1, labelKey: 'mon' },
  { value: 2, labelKey: 'tue' },
  { value: 3, labelKey: 'wed' },
  { value: 4, labelKey: 'thu' },
  { value: 5, labelKey: 'fri' },
  { value: 6, labelKey: 'sat' },
  { value: 0, labelKey: 'sun' },
] as const

export function RecurringForm({
  enabled,
  onEnabledChange,
  pattern,
  onPatternChange,
  startDate,
  locale = 'es',
  translations,
}: RecurringFormProps) {
  const dateLocale = locale === 'es' ? es : enUS

  const [frequency, setFrequency] = useState<RecurringPattern['frequency']>(pattern?.frequency ?? 'weekly')
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(pattern?.daysOfWeek ?? [new Date(startDate).getDay()])
  const [endType, setEndType] = useState<'date' | 'occurrences'>(pattern?.endDate ? 'date' : 'occurrences')
  const [endDate, setEndDate] = useState(pattern?.endDate ?? '')
  const [occurrences, setOccurrences] = useState(pattern?.occurrences ?? 10)

  // Update pattern when values change
  const updatePattern = (updates: Partial<{
    frequency: RecurringPattern['frequency']
    daysOfWeek: number[]
    endDate: string
    occurrences: number
  }>) => {
    const newFrequency = updates.frequency ?? frequency
    const newDaysOfWeek = updates.daysOfWeek ?? daysOfWeek
    const newEndDate = updates.endDate ?? endDate
    const newOccurrences = updates.occurrences ?? occurrences

    if (updates.frequency !== undefined) setFrequency(updates.frequency)
    if (updates.daysOfWeek !== undefined) setDaysOfWeek(updates.daysOfWeek)
    if (updates.endDate !== undefined) setEndDate(updates.endDate)
    if (updates.occurrences !== undefined) setOccurrences(updates.occurrences)

    const newPattern: RecurringPattern = {
      frequency: newFrequency,
      ...(newFrequency === 'weekly' || newFrequency === 'biweekly' ? { daysOfWeek: newDaysOfWeek } : {}),
      ...(endType === 'date' && newEndDate ? { endDate: newEndDate } : {}),
      ...(endType === 'occurrences' ? { occurrences: newOccurrences } : {}),
    }

    onPatternChange(newPattern)
  }

  // Toggle day selection
  const toggleDay = (day: number) => {
    const newDays = daysOfWeek.includes(day)
      ? daysOfWeek.filter((d) => d !== day)
      : [...daysOfWeek, day].sort()

    // Ensure at least one day is selected
    if (newDays.length === 0) return

    updatePattern({ daysOfWeek: newDays })
  }

  // Calculate preview dates
  const previewDates = useMemo(() => {
    if (!enabled || !startDate) return []

    const dates: Date[] = []
    const start = new Date(startDate)
    const maxDates = 5

    let current = start
    let count = 0
    const maxIterations = 100 // Safety limit
    let iterations = 0

    while (dates.length < maxDates && iterations < maxIterations) {
      iterations++

      // Check if we should include this date
      const dayOfWeek = current.getDay()
      const shouldInclude = frequency === 'daily' ||
        ((frequency === 'weekly' || frequency === 'biweekly') && daysOfWeek.includes(dayOfWeek)) ||
        frequency === 'monthly'

      if (shouldInclude) {
        // Check end conditions
        if (endType === 'date' && endDate && isAfter(current, new Date(endDate))) break
        if (endType === 'occurrences' && count >= occurrences) break

        dates.push(new Date(current))
        count++
      }

      // Move to next potential date
      if (frequency === 'daily') {
        current = addDays(current, 1)
      } else if (frequency === 'weekly') {
        current = addDays(current, 1)
      } else if (frequency === 'biweekly') {
        // For biweekly, if we've gone through a week, skip a week
        const daysSinceStart = Math.floor((current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
        if (daysSinceStart % 14 === 6) {
          current = addDays(current, 8) // Skip to next biweekly cycle
        } else {
          current = addDays(current, 1)
        }
      } else if (frequency === 'monthly') {
        current = addMonths(current, 1)
      }
    }

    return dates
  }, [enabled, startDate, frequency, daysOfWeek, endType, endDate, occurrences])

  return (
    <div className="space-y-4">
      {/* Enable Toggle */}
      <label className="flex items-center gap-3 cursor-pointer group">
        <div
          className={cn(
            'relative w-11 h-6 rounded-full transition-colors',
            enabled ? 'bg-blue-600' : 'bg-stone-300 group-hover:bg-stone-400'
          )}
          onClick={() => {
            const newEnabled = !enabled
            onEnabledChange(newEnabled)
            if (newEnabled && !pattern) {
              onPatternChange({
                frequency: 'weekly',
                daysOfWeek: [new Date(startDate).getDay()],
                occurrences: 10,
              })
            }
          }}
        >
          <div
            className={cn(
              'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
              enabled ? 'translate-x-5' : 'translate-x-0.5'
            )}
          />
        </div>
        <div className="flex items-center gap-2">
          <Repeat className="w-4 h-4 text-stone-500" />
          <span className="text-sm font-medium text-stone-700">{translations.enable}</span>
        </div>
      </label>

      {enabled && (
        <div className="pl-4 border-l-2 border-blue-200 space-y-4">
          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              {translations.frequency}
            </label>
            <div className="flex flex-wrap gap-2">
              {FREQUENCIES.map(({ value, labelKey }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updatePattern({ frequency: value })}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all border-2',
                    frequency === value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-stone-200 text-stone-600 hover:border-stone-300'
                  )}
                >
                  {translations[labelKey]}
                </button>
              ))}
            </div>
          </div>

          {/* Days of Week (for weekly/biweekly) */}
          {(frequency === 'weekly' || frequency === 'biweekly') && (
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                {translations.daysOfWeek}
              </label>
              <div className="flex gap-1">
                {DAYS_OF_WEEK.map(({ value, labelKey }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleDay(value)}
                    className={cn(
                      'w-10 h-10 rounded-lg text-xs font-medium transition-all border-2',
                      daysOfWeek.includes(value)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-stone-200 text-stone-500 hover:border-stone-300'
                    )}
                  >
                    {translations[labelKey]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* End Condition */}
          <div className="grid grid-cols-2 gap-4">
            {/* End Date Option */}
            <div>
              <label className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  checked={endType === 'date'}
                  onChange={() => setEndType('date')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-stone-700">
                  <Calendar className="w-4 h-4 inline mr-1 text-stone-400" />
                  {translations.endDate}
                </span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => updatePattern({ endDate: e.target.value })}
                min={startDate}
                disabled={endType !== 'date'}
                className={cn(
                  'w-full rounded-lg border border-stone-300 px-3 py-2',
                  'text-stone-900 bg-white text-sm',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                  'disabled:bg-stone-100 disabled:cursor-not-allowed'
                )}
              />
            </div>

            {/* Occurrences Option */}
            <div>
              <label className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  checked={endType === 'occurrences'}
                  onChange={() => setEndType('occurrences')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-stone-700">
                  <Hash className="w-4 h-4 inline mr-1 text-stone-400" />
                  {translations.occurrences}
                </span>
              </label>
              <input
                type="number"
                value={occurrences}
                onChange={(e) => updatePattern({ occurrences: Math.max(1, parseInt(e.target.value) || 1) })}
                min={1}
                max={52}
                disabled={endType !== 'occurrences'}
                className={cn(
                  'w-full rounded-lg border border-stone-300 px-3 py-2',
                  'text-stone-900 bg-white text-sm',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                  'disabled:bg-stone-100 disabled:cursor-not-allowed'
                )}
              />
            </div>
          </div>

          {/* Preview */}
          {previewDates.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                {translations.preview}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {previewDates.map((date, idx) => (
                  <Badge key={idx} variant="info" size="sm">
                    {format(date, 'EEE d MMM', { locale: dateLocale })}
                  </Badge>
                ))}
                {(endType === 'occurrences' && occurrences > 5) && (
                  <Badge variant="default" size="sm">
                    +{occurrences - 5} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
