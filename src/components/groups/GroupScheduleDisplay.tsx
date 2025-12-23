'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Calendar, Clock, MapPin, CalendarX2 } from 'lucide-react'
import { cn, formatTime } from '@/lib/utils'
import type { ScheduleTemplate, ScheduleSlot } from '@/types/database'

interface GroupScheduleDisplayProps {
  schedule: ScheduleTemplate | null
  color?: string
  variant?: 'default' | 'compact' | 'expanded'
  showEmpty?: boolean
  className?: string
}

const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const

export function GroupScheduleDisplay({
  schedule,
  color = '#3B82F6',
  variant = 'default',
  showEmpty = true,
  className,
}: GroupScheduleDisplayProps) {
  const t = useTranslations('groups')

  // Group slots by day
  const slotsByDay = useMemo(() => {
    if (!schedule?.slots) return new Map<number, ScheduleSlot[]>()

    const map = new Map<number, ScheduleSlot[]>()
    schedule.slots.forEach((slot) => {
      const existing = map.get(slot.day) || []
      map.set(slot.day, [...existing, slot])
    })

    // Sort slots within each day by start time
    map.forEach((slots, day) => {
      map.set(day, slots.sort((a, b) => a.startTime.localeCompare(b.startTime)))
    })

    return map
  }, [schedule])

  const totalSessions = schedule?.slots?.length || 0
  const hasSchedule = totalSessions > 0

  // Empty state
  if (!hasSchedule && showEmpty) {
    return (
      <div className={cn('rounded-xl border border-dashed border-stone-200 p-6', className)}>
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center mb-3">
            <CalendarX2 className="w-6 h-6 text-stone-400" />
          </div>
          <p className="text-sm font-medium text-stone-600 mb-1">
            {t('schedule.noSchedule')}
          </p>
          <p className="text-xs text-stone-400">
            {t('schedule.noScheduleDescription')}
          </p>
        </div>
      </div>
    )
  }

  if (!hasSchedule) return null

  // Compact variant - just shows session count
  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-2 text-sm text-stone-600', className)}>
        <Calendar className="w-4 h-4 text-stone-400" />
        <span>{t('schedule.sessions', { count: totalSessions })}</span>
      </div>
    )
  }

  // Expanded variant - full week calendar
  if (variant === 'expanded') {
    return (
      <div className={cn('space-y-4', className)}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
            <Calendar className="w-4 h-4" style={{ color }} />
            {t('schedule.title')}
          </h4>
          <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded-full">
            {t('schedule.sessions', { count: totalSessions })}
          </span>
        </div>

        {/* Week Grid */}
        <div className="grid grid-cols-7 gap-2">
          {DAY_KEYS.map((dayKey, index) => {
            const daySlots = slotsByDay.get(index) || []
            const hasSlots = daySlots.length > 0

            return (
              <div
                key={dayKey}
                className={cn(
                  'flex flex-col rounded-xl border transition-all duration-200',
                  hasSlots
                    ? 'border-stone-200 bg-white shadow-sm'
                    : 'border-stone-100 bg-stone-50/50'
                )}
              >
                {/* Day Header */}
                <div
                  className={cn(
                    'py-2 px-1 text-center border-b',
                    hasSlots ? 'border-stone-100' : 'border-transparent'
                  )}
                  style={{
                    backgroundColor: hasSlots ? `${color}10` : undefined,
                  }}
                >
                  <span
                    className={cn(
                      'text-xs font-semibold',
                      hasSlots ? 'text-stone-800' : 'text-stone-400'
                    )}
                    style={{
                      color: hasSlots ? color : undefined,
                    }}
                  >
                    {t(`days.short.${dayKey}`)}
                  </span>
                </div>

                {/* Slots */}
                <div className="flex-1 p-2 min-h-[60px]">
                  {hasSlots ? (
                    <div className="space-y-1.5">
                      {daySlots.map((slot, i) => (
                        <div
                          key={i}
                          className="text-[10px] leading-tight"
                        >
                          <div className="font-medium text-stone-700">
                            {slot.startTime}
                          </div>
                          <div className="text-stone-400">
                            {slot.endTime}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <span className="text-stone-300 text-lg">—</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Default variant - horizontal timeline
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
          <Calendar className="w-4 h-4" style={{ color }} />
          {t('schedule.title')}
        </h4>
        <span className="text-xs text-stone-500">
          {t('schedule.sessions', { count: totalSessions })}
        </span>
      </div>

      {/* Day Pills */}
      <div className="flex flex-wrap gap-2">
        {DAY_KEYS.map((dayKey, index) => {
          const daySlots = slotsByDay.get(index) || []
          const hasSlots = daySlots.length > 0

          if (!hasSlots) {
            return (
              <div
                key={dayKey}
                className="w-10 h-10 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center"
              >
                <span className="text-xs font-medium text-stone-300">
                  {t(`days.short.${dayKey}`)}
                </span>
              </div>
            )
          }

          return (
            <div
              key={dayKey}
              className="group relative"
            >
              <div
                className="px-3 py-2 rounded-xl border-2 cursor-default transition-all duration-200 hover:shadow-md"
                style={{
                  borderColor: color,
                  backgroundColor: `${color}08`,
                }}
              >
                <div
                  className="text-xs font-semibold mb-0.5"
                  style={{ color }}
                >
                  {t(`days.short.${dayKey}`)}
                </div>
                {daySlots.map((slot, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1 text-[10px] text-stone-600"
                  >
                    <Clock className="w-2.5 h-2.5" />
                    <span>{slot.startTime} - {slot.endTime}</span>
                  </div>
                ))}
              </div>

              {/* Indicator Dot */}
              <div
                className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ring-2 ring-white"
                style={{ backgroundColor: color }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Mini version for cards
export function GroupScheduleMini({
  schedule,
  color = '#3B82F6',
  className,
}: {
  schedule: ScheduleTemplate | null
  color?: string
  className?: string
}) {
  const t = useTranslations('groups')

  const nextSlot = schedule?.slots?.[0]
  if (!nextSlot) return null

  const dayKey = DAY_KEYS[nextSlot.day]

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${color}15` }}
      >
        <Calendar className="w-3.5 h-3.5" style={{ color }} />
      </div>
      <div className="text-sm">
        <span className="font-medium text-stone-700">
          {t(`days.short.${dayKey}`)}
        </span>
        <span className="text-stone-400 mx-1">•</span>
        <span className="text-stone-500">
          {nextSlot.startTime}
        </span>
      </div>
    </div>
  )
}

// Badge showing total sessions
export function GroupScheduleBadge({
  schedule,
  color = '#3B82F6',
}: {
  schedule: ScheduleTemplate | null
  color?: string
}) {
  const t = useTranslations('groups')
  const count = schedule?.slots?.length || 0

  if (count === 0) return null

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{
        backgroundColor: `${color}15`,
        color,
      }}
    >
      <Calendar className="w-3 h-3" />
      {count}x/{t('schedule.sessions', { count }).split(' ')[0]}
    </span>
  )
}
