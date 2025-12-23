'use client'

import { cn } from '@/lib/utils'
import { generateTimeSlots, formatTime } from '@/lib/utils'
import { CALENDAR_CONFIG } from '@/types/bookings'

type TimeColumnProps = {
  showCurrentTime?: boolean
  locale?: string
}

export function TimeColumn({ showCurrentTime = true, locale = 'es' }: TimeColumnProps) {
  const timeSlots = generateTimeSlots(CALENDAR_CONFIG.startHour, CALENDAR_CONFIG.endHour)

  // Get current time position
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const isWithinRange = currentHour >= CALENDAR_CONFIG.startHour && currentHour < CALENDAR_CONFIG.endHour

  // Calculate position as percentage of the calendar height
  const totalMinutes = (CALENDAR_CONFIG.endHour - CALENDAR_CONFIG.startHour) * 60
  const minutesSinceStart = (currentHour - CALENDAR_CONFIG.startHour) * 60 + currentMinute
  const currentTimePosition = (minutesSinceStart / totalMinutes) * 100

  return (
    <div className="relative w-16 shrink-0 border-r border-stone-200 bg-stone-50">
      {/* Time Labels */}
      <div className="relative">
        {timeSlots.map((time, index) => {
          const isFullHour = time.endsWith(':00')

          return (
            <div
              key={time}
              className={cn(
                'h-10 flex items-start justify-end pr-2 text-xs',
                isFullHour ? 'text-stone-600 font-medium' : 'text-stone-400'
              )}
              style={{ marginTop: index === 0 ? 0 : undefined }}
            >
              {isFullHour && (
                <span className="-mt-2">
                  {locale === 'es' ? time : formatTime(time)}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Current Time Indicator */}
      {showCurrentTime && isWithinRange && (
        <div
          className="absolute left-0 right-0 flex items-center z-20 pointer-events-none"
          style={{ top: `${currentTimePosition}%` }}
        >
          <div className="w-2 h-2 rounded-full bg-red-500 -ml-1" />
          <div className="flex-1 h-0.5 bg-red-500" />
        </div>
      )}
    </div>
  )
}
