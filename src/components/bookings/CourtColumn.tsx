'use client'

import { cn } from '@/lib/utils'
import { generateTimeSlots } from '@/lib/utils'
import { Building2, Trees } from 'lucide-react'
import { CALENDAR_CONFIG } from '@/types/bookings'
import type { Court } from '@/types/database'
import type { BookingWithRelations } from '@/types/bookings'

type CourtColumnProps = {
  court: Court
  date: Date
  bookings: BookingWithRelations[]
  onSlotClick: (court: Court, date: Date, time: string) => void
  onBookingClick: (booking: BookingWithRelations) => void
  isToday: boolean
  locale?: string
}

export function CourtColumn({
  court,
  date,
  bookings,
  onSlotClick,
  onBookingClick,
  isToday,
  locale = 'es',
}: CourtColumnProps) {
  const timeSlots = generateTimeSlots(CALENDAR_CONFIG.startHour, CALENDAR_CONFIG.endHour)
  const isIndoor = court.surface_type === 'indoor'

  // Check if a time slot has a booking
  const getBookingAtTime = (time: string): BookingWithRelations | undefined => {
    return bookings.find((booking) => {
      const bookingStart = booking.start_time.substring(0, 5)
      const bookingEnd = booking.end_time.substring(0, 5)
      return time >= bookingStart && time < bookingEnd
    })
  }

  // Check if time is in the past
  const isPastTime = (time: string): boolean => {
    if (!isToday) return false
    const now = new Date()
    const [hours, minutes] = time.split(':').map(Number)
    const slotTime = new Date(date)
    slotTime.setHours(hours, minutes, 0, 0)
    return slotTime < now
  }

  // Get booking start info for rendering
  const isBookingStart = (time: string, booking: BookingWithRelations): boolean => {
    return booking.start_time.substring(0, 5) === time
  }

  // Calculate booking height in slots
  const getBookingHeight = (booking: BookingWithRelations): number => {
    const [startHour, startMin] = booking.start_time.split(':').map(Number)
    const [endHour, endMin] = booking.end_time.split(':').map(Number)
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    const durationMinutes = endMinutes - startMinutes
    return durationMinutes / CALENDAR_CONFIG.slotDuration // Number of 30-min slots
  }

  return (
    <div className="flex-1 min-w-[120px] border-r border-stone-200 last:border-r-0">
      {/* Court Header */}
      <div
        className={cn(
          'sticky top-0 z-10 h-12 flex items-center justify-center gap-2 border-b border-stone-200',
          isToday ? 'bg-blue-50' : 'bg-white'
        )}
      >
        <div
          className={cn(
            'w-6 h-6 rounded flex items-center justify-center',
            isIndoor ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
          )}
        >
          {isIndoor ? <Building2 className="w-3.5 h-3.5" /> : <Trees className="w-3.5 h-3.5" />}
        </div>
        <span className="text-sm font-medium text-stone-700 truncate">{court.name}</span>
      </div>

      {/* Time Slots */}
      <div className="relative">
        {timeSlots.map((time) => {
          const booking = getBookingAtTime(time)
          const isPast = isPastTime(time)
          const isSlotBookingStart = booking && isBookingStart(time, booking)

          return (
            <div
              key={time}
              className={cn(
                'h-10 border-b border-stone-100 relative',
                time.endsWith(':00') && 'border-b-stone-200',
                isPast && 'bg-stone-50'
              )}
            >
              {/* Empty slot - clickable */}
              {!booking && !isPast && (
                <button
                  onClick={() => onSlotClick(court, date, time)}
                  className={cn(
                    'absolute inset-0 w-full',
                    'hover:bg-blue-50 transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500'
                  )}
                  aria-label={`Book ${court.name} at ${time}`}
                />
              )}

              {/* Booking (only render at start time) */}
              {isSlotBookingStart && (
                <BookingBlock
                  booking={booking}
                  height={getBookingHeight(booking)}
                  onClick={() => onBookingClick(booking)}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Booking block component
type BookingBlockProps = {
  booking: BookingWithRelations
  height: number
  onClick: () => void
}

import { BOOKING_COLORS, STATUS_STYLES } from '@/types/bookings'

function BookingBlock({ booking, height, onClick }: BookingBlockProps) {
  const colors = BOOKING_COLORS[booking.booking_type]
  const statusStyle = STATUS_STYLES[booking.status]

  // Get display title based on booking type
  const getTitle = (): string => {
    if (booking.booking_type === 'group_class' && booking.group) {
      return booking.group.name
    }
    if (booking.booking_type === 'private_lesson' && booking.player) {
      return booking.player.name
    }
    if (booking.booking_type === 'rental' && booking.player) {
      return booking.player.name
    }
    return booking.booking_type === 'rental' ? 'Court Rental' : 'Booking'
  }

  // Format time range
  const timeRange = `${booking.start_time.substring(0, 5)} - ${booking.end_time.substring(0, 5)}`

  return (
    <button
      onClick={onClick}
      className={cn(
        'absolute inset-x-1 top-0 z-10 rounded-md border-l-4 p-1.5 text-left',
        'hover:shadow-md transition-shadow cursor-pointer',
        'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500',
        colors.bg,
        colors.border,
        statusStyle
      )}
      style={{ height: `calc(${height * 2.5}rem - 4px)` }}
    >
      <div className="flex flex-col h-full overflow-hidden">
        <span className={cn('text-xs font-semibold truncate', colors.text)}>
          {getTitle()}
        </span>
        <span className={cn('text-[10px] truncate', colors.text, 'opacity-75')}>
          {timeRange}
        </span>
        {booking.coach && height > 1.5 && (
          <span className={cn('text-[10px] truncate mt-auto', colors.text, 'opacity-60')}>
            {booking.coach.name}
          </span>
        )}
      </div>
    </button>
  )
}
