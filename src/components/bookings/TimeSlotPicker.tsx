'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { generateTimeSlots, formatTime } from '@/lib/utils'
import { Clock } from 'lucide-react'
import { CALENDAR_CONFIG } from '@/types/bookings'

type TimeSlotPickerProps = {
  startTime: string
  endTime: string
  onStartTimeChange: (time: string) => void
  onEndTimeChange: (time: string) => void
  locale?: string
  translations: {
    startTime: string
    endTime: string
    duration: string
    durationOptions: {
      '1h': string
      '1.5h': string
      '2h': string
    }
  }
}

const DURATION_PRESETS = [
  { value: 60, label: '1h' },
  { value: 90, label: '1.5h' },
  { value: 120, label: '2h' },
] as const

export function TimeSlotPicker({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  locale = 'es',
  translations,
}: TimeSlotPickerProps) {
  const timeSlots = useMemo(() =>
    generateTimeSlots(CALENDAR_CONFIG.startHour, CALENDAR_CONFIG.endHour),
    []
  )

  // Calculate end time options based on start time
  const endTimeSlots = useMemo(() => {
    if (!startTime) return []
    const startIndex = timeSlots.findIndex(t => t === startTime)
    if (startIndex === -1) return []
    // End time must be after start time, up to end of day
    return timeSlots.slice(startIndex + 1)
  }, [startTime, timeSlots])

  // Calculate current duration in minutes
  const currentDuration = useMemo(() => {
    if (!startTime || !endTime) return 0
    const [startHour, startMin] = startTime.split(':').map(Number)
    const [endHour, endMin] = endTime.split(':').map(Number)
    return (endHour * 60 + endMin) - (startHour * 60 + startMin)
  }, [startTime, endTime])

  // Format duration for display
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins}min`
    if (mins === 0) return `${hours}h`
    return `${hours}h ${mins}min`
  }

  // Set duration preset
  const setDuration = (minutes: number) => {
    if (!startTime) return
    const [startHour, startMin] = startTime.split(':').map(Number)
    const totalMinutes = startHour * 60 + startMin + minutes
    const endHour = Math.floor(totalMinutes / 60)
    const endMin = totalMinutes % 60

    // Don't exceed operating hours
    if (endHour > CALENDAR_CONFIG.endHour) return

    const newEndTime = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`
    onEndTimeChange(newEndTime)
  }

  const formatTimeOption = (time: string) => {
    return locale === 'es' ? time : formatTime(time)
  }

  return (
    <div className="space-y-4">
      {/* Time Selection Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Start Time */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            <Clock className="w-4 h-4 inline mr-1.5 text-stone-400" />
            {translations.startTime}
          </label>
          <select
            value={startTime}
            onChange={(e) => {
              onStartTimeChange(e.target.value)
              // Auto-adjust end time if it becomes invalid
              if (e.target.value >= endTime) {
                const startIndex = timeSlots.findIndex(t => t === e.target.value)
                if (startIndex < timeSlots.length - 3) {
                  // Default to 1.5 hours later
                  onEndTimeChange(timeSlots[startIndex + 3])
                }
              }
            }}
            className={cn(
              'w-full rounded-lg border border-stone-300 px-3 py-2.5',
              'text-stone-900 bg-white',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            )}
          >
            <option value="">--:--</option>
            {timeSlots.slice(0, -1).map((time) => (
              <option key={time} value={time}>
                {formatTimeOption(time)}
              </option>
            ))}
          </select>
        </div>

        {/* End Time */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            <Clock className="w-4 h-4 inline mr-1.5 text-stone-400" />
            {translations.endTime}
          </label>
          <select
            value={endTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
            disabled={!startTime}
            className={cn(
              'w-full rounded-lg border border-stone-300 px-3 py-2.5',
              'text-stone-900 bg-white',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              'disabled:bg-stone-100 disabled:cursor-not-allowed'
            )}
          >
            <option value="">--:--</option>
            {endTimeSlots.map((time) => (
              <option key={time} value={time}>
                {formatTimeOption(time)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Duration Presets */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5">
          {translations.duration}
          {currentDuration > 0 && (
            <span className="ml-2 text-stone-500 font-normal">
              ({formatDuration(currentDuration)})
            </span>
          )}
        </label>
        <div className="flex gap-2">
          {DURATION_PRESETS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setDuration(value)}
              disabled={!startTime}
              className={cn(
                'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all',
                'border-2',
                currentDuration === value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {translations.durationOptions[label]}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Time Range */}
      {startTime && endTime && (
        <div className="bg-stone-50 rounded-lg p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-stone-600">
              {formatTimeOption(startTime)} → {formatTimeOption(endTime)}
            </span>
            <span className="font-medium text-stone-800">
              {formatDuration(currentDuration)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
