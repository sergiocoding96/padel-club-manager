import { getTranslations } from 'next-intl/server'
import { format, startOfWeek, endOfWeek } from 'date-fns'
import { BookingCalendar } from '@/components/bookings/BookingCalendar'
import { getCourts } from '@/lib/actions/courts'
import { getBookingsByDateRange } from '@/lib/actions/bookings'

export default async function BookingsPage() {
  const t = await getTranslations('bookings')
  const tCalendar = await getTranslations('calendar')
  const tCommon = await getTranslations('common')

  // Get courts
  const courtsResult = await getCourts()
  const courts = courtsResult.success && courtsResult.data ? courtsResult.data : []

  // Get bookings for current week
  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 })
  const startDate = format(weekStart, 'yyyy-MM-dd')
  const endDate = format(weekEnd, 'yyyy-MM-dd')

  const bookingsResult = await getBookingsByDateRange(startDate, endDate)
  const bookings = bookingsResult.success && bookingsResult.data ? bookingsResult.data : []

  return (
    <main className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
      <div className="max-w-full mx-auto px-4 py-8">
        <BookingCalendar
          courts={courts}
          initialBookings={bookings}
          locale="es"
          translations={{
            today: tCommon('today'),
            newBooking: t('newBooking'),
            weekView: t('weekView'),
            dayView: t('dayView'),
            previousWeek: tCalendar('previousWeek'),
            nextWeek: tCalendar('nextWeek'),
            noBookings: t('noBookings'),
            createFirst: t('createFirst'),
            mon: tCalendar('mon'),
            tue: tCalendar('tue'),
            wed: tCalendar('wed'),
            thu: tCalendar('thu'),
            fri: tCalendar('fri'),
            sat: tCalendar('sat'),
            sun: tCalendar('sun'),
          }}
        />
      </div>
    </main>
  )
}
