'use client'

import { useState, useMemo } from 'react'
import { addWeeks, subWeeks, startOfWeek, addDays } from 'date-fns'
import { CalendarHeader } from './CalendarHeader'
import { CalendarGrid } from './CalendarGrid'
import type { Court } from '@/types/database'
import type { BookingWithRelations } from '@/types/bookings'

type BookingCalendarProps = {
  courts: Court[]
  initialBookings: BookingWithRelations[]
  locale?: string
  translations: {
    today: string
    newBooking: string
    weekView: string
    dayView: string
    previousWeek: string
    nextWeek: string
    noBookings: string
    createFirst: string
    mon: string
    tue: string
    wed: string
    thu: string
    fri: string
    sat: string
    sun: string
  }
}

export function BookingCalendar({
  courts,
  initialBookings,
  locale = 'es',
  translations,
}: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'week' | 'day'>('week')
  const [bookings, setBookings] = useState<BookingWithRelations[]>(initialBookings)
  const [selectedBooking, setSelectedBooking] = useState<BookingWithRelations | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formInitialData, setFormInitialData] = useState<{
    court?: Court
    date?: Date
    time?: string
  } | null>(null)

  // Calculate week dates (Monday to Sunday)
  const weekDates = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  }, [currentDate])

  // Navigation handlers
  const handlePreviousWeek = () => {
    setCurrentDate((prev) => subWeeks(prev, 1))
  }

  const handleNextWeek = () => {
    setCurrentDate((prev) => addWeeks(prev, 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  // Booking handlers
  const handleNewBooking = () => {
    setFormInitialData(null)
    setIsFormOpen(true)
  }

  const handleSlotClick = (court: Court, date: Date, time: string) => {
    setFormInitialData({ court, date, time })
    setIsFormOpen(true)
  }

  const handleBookingClick = (booking: BookingWithRelations) => {
    setSelectedBooking(booking)
  }

  const handleViewChange = (newView: 'week' | 'day') => {
    setView(newView)
  }

  return (
    <div>
      {/* Header with Navigation and Controls */}
      <CalendarHeader
        currentDate={currentDate}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
        onToday={handleToday}
        onNewBooking={handleNewBooking}
        view={view}
        onViewChange={handleViewChange}
        locale={locale}
        translations={{
          today: translations.today,
          newBooking: translations.newBooking,
          weekView: translations.weekView,
          dayView: translations.dayView,
          previousWeek: translations.previousWeek,
          nextWeek: translations.nextWeek,
        }}
      />

      {/* Calendar Grid */}
      {view === 'week' ? (
        <CalendarGrid
          courts={courts}
          bookings={bookings}
          weekDates={weekDates}
          selectedDate={currentDate}
          onSlotClick={handleSlotClick}
          onBookingClick={handleBookingClick}
          locale={locale}
          translations={{
            mon: translations.mon,
            tue: translations.tue,
            wed: translations.wed,
            thu: translations.thu,
            fri: translations.fri,
            sat: translations.sat,
            sun: translations.sun,
          }}
        />
      ) : (
        // Day view - simplified single day view
        <div className="bg-white rounded-xl border border-stone-200 p-6 text-center text-stone-500">
          Day view coming soon...
        </div>
      )}

      {/* Booking Details Panel (placeholder) */}
      {selectedBooking && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l border-stone-200 z-50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-stone-800">Booking Details</h3>
            <button
              onClick={() => setSelectedBooking(null)}
              className="text-stone-500 hover:text-stone-700"
            >
              Close
            </button>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-stone-500">Type:</span>{' '}
              <span className="text-stone-800">{selectedBooking.booking_type}</span>
            </div>
            <div>
              <span className="text-stone-500">Court:</span>{' '}
              <span className="text-stone-800">{selectedBooking.court.name}</span>
            </div>
            <div>
              <span className="text-stone-500">Date:</span>{' '}
              <span className="text-stone-800">{selectedBooking.date}</span>
            </div>
            <div>
              <span className="text-stone-500">Time:</span>{' '}
              <span className="text-stone-800">
                {selectedBooking.start_time} - {selectedBooking.end_time}
              </span>
            </div>
            <div>
              <span className="text-stone-500">Status:</span>{' '}
              <span className="text-stone-800">{selectedBooking.status}</span>
            </div>
          </div>
        </div>
      )}

      {/* Booking Form Modal (placeholder) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsFormOpen(false)} />
          <div className="relative bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-stone-800 mb-4">
              {formInitialData ? 'New Booking' : 'Create Booking'}
            </h3>
            {formInitialData && (
              <div className="text-sm text-stone-500 mb-4">
                <p>Court: {formInitialData.court?.name}</p>
                <p>Date: {formInitialData.date?.toLocaleDateString()}</p>
                <p>Time: {formInitialData.time}</p>
              </div>
            )}
            <p className="text-stone-500 text-center py-8">
              Booking form coming in the next step...
            </p>
            <button
              onClick={() => setIsFormOpen(false)}
              className="w-full py-2 bg-stone-100 text-stone-600 rounded-lg hover:bg-stone-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
