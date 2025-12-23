'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { format, isToday, isSameDay } from 'date-fns'
import { es, enUS } from 'date-fns/locale'
import { TimeColumn } from './TimeColumn'
import { CourtColumn } from './CourtColumn'
import type { Court } from '@/types/database'
import type { BookingWithRelations } from '@/types/bookings'

type CalendarGridProps = {
  courts: Court[]
  bookings: BookingWithRelations[]
  weekDates: Date[]
  selectedDate: Date
  onSlotClick: (court: Court, date: Date, time: string) => void
  onBookingClick: (booking: BookingWithRelations) => void
  locale?: string
  translations: {
    mon: string
    tue: string
    wed: string
    thu: string
    fri: string
    sat: string
    sun: string
  }
}

const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const

export function CalendarGrid({
  courts,
  bookings,
  weekDates,
  selectedDate,
  onSlotClick,
  onBookingClick,
  locale = 'es',
  translations,
}: CalendarGridProps) {
  const dateLocale = locale === 'es' ? es : enUS

  // Group bookings by court and date for efficient lookup
  const bookingsByCourtAndDate = useMemo(() => {
    const map = new Map<string, BookingWithRelations[]>()
    bookings.forEach((booking) => {
      const key = `${booking.court_id}-${booking.date}`
      const existing = map.get(key) || []
      map.set(key, [...existing, booking])
    })
    return map
  }, [bookings])

  const getBookingsForCourtAndDate = (courtId: string, date: Date): BookingWithRelations[] => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return bookingsByCourtAndDate.get(`${courtId}-${dateStr}`) || []
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
      {/* Week Day Headers */}
      <div className="flex border-b border-stone-200">
        {/* Empty corner for time column */}
        <div className="w-16 shrink-0 border-r border-stone-200 bg-stone-50" />

        {/* Day Headers */}
        {weekDates.map((date, index) => {
          const today = isToday(date)
          const dayKey = dayKeys[index]

          return (
            <div
              key={date.toISOString()}
              className={cn(
                'flex-1 min-w-[120px] py-3 text-center border-r border-stone-200 last:border-r-0',
                today ? 'bg-blue-50' : 'bg-white'
              )}
            >
              <div
                className={cn(
                  'text-xs font-medium uppercase tracking-wide',
                  today ? 'text-blue-600' : 'text-stone-500'
                )}
              >
                {translations[dayKey]}
              </div>
              <div
                className={cn(
                  'mt-1 text-lg font-semibold',
                  today ? 'text-blue-600' : 'text-stone-800'
                )}
              >
                {format(date, 'd')}
              </div>
            </div>
          )
        })}
      </div>

      {/* Court Rows with Scrollable Content */}
      {courts.map((court) => (
        <div key={court.id} className="flex border-b border-stone-200 last:border-b-0">
          {/* Time Column (only for first court, then hidden) */}
          <TimeColumn showCurrentTime locale={locale} />

          {/* Day Columns for this Court */}
          <div className="flex flex-1 overflow-x-auto">
            {weekDates.map((date) => (
              <CourtColumn
                key={`${court.id}-${date.toISOString()}`}
                court={court}
                date={date}
                bookings={getBookingsForCourtAndDate(court.id, date)}
                onSlotClick={onSlotClick}
                onBookingClick={onBookingClick}
                isToday={isToday(date)}
                locale={locale}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Empty State */}
      {courts.length === 0 && (
        <div className="flex items-center justify-center py-20 text-stone-500">
          No courts available. Add courts first.
        </div>
      )}
    </div>
  )
}
