'use client'

import { ChevronLeft, ChevronRight, Calendar, Plus, LayoutGrid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { format, startOfWeek, endOfWeek } from 'date-fns'
import { es, enUS } from 'date-fns/locale'

type CalendarHeaderProps = {
  currentDate: Date
  onPreviousWeek: () => void
  onNextWeek: () => void
  onToday: () => void
  onNewBooking: () => void
  view: 'week' | 'day'
  onViewChange: (view: 'week' | 'day') => void
  locale?: string
  translations: {
    today: string
    newBooking: string
    weekView: string
    dayView: string
    previousWeek: string
    nextWeek: string
  }
}

export function CalendarHeader({
  currentDate,
  onPreviousWeek,
  onNextWeek,
  onToday,
  onNewBooking,
  view,
  onViewChange,
  locale = 'es',
  translations,
}: CalendarHeaderProps) {
  const dateLocale = locale === 'es' ? es : enUS

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })

  const formatWeekRange = () => {
    const startMonth = format(weekStart, 'MMM', { locale: dateLocale })
    const endMonth = format(weekEnd, 'MMM', { locale: dateLocale })
    const startDay = format(weekStart, 'd')
    const endDay = format(weekEnd, 'd')
    const year = format(weekEnd, 'yyyy')

    if (startMonth === endMonth) {
      return `${startDay} - ${endDay} ${startMonth} ${year}`
    }
    return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`
  }

  const isCurrentWeek = () => {
    const today = new Date()
    const todayWeekStart = startOfWeek(today, { weekStartsOn: 1 })
    return weekStart.getTime() === todayWeekStart.getTime()
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      {/* Left: Title and Navigation */}
      <div className="flex items-center gap-4">
        {/* Calendar Icon */}
        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
          <Calendar className="w-5 h-5 text-orange-600" />
        </div>

        {/* Week Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPreviousWeek}
            className={cn(
              'p-2 rounded-lg text-stone-600',
              'hover:bg-stone-100 transition-colors'
            )}
            title={translations.previousWeek}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="min-w-[180px] text-center">
            <h2 className="text-lg font-semibold text-stone-800 capitalize">
              {formatWeekRange()}
            </h2>
          </div>

          <button
            onClick={onNextWeek}
            className={cn(
              'p-2 rounded-lg text-stone-600',
              'hover:bg-stone-100 transition-colors'
            )}
            title={translations.nextWeek}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Today Button */}
        {!isCurrentWeek() && (
          <Button variant="outline" size="sm" onClick={onToday}>
            {translations.today}
          </Button>
        )}
      </div>

      {/* Right: View Toggle and New Booking */}
      <div className="flex items-center gap-3">
        {/* View Toggle */}
        <div className="flex bg-stone-100 rounded-lg p-1">
          <button
            onClick={() => onViewChange('week')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
              view === 'week'
                ? 'bg-white text-stone-800 shadow-sm'
                : 'text-stone-600 hover:text-stone-800'
            )}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">{translations.weekView}</span>
          </button>
          <button
            onClick={() => onViewChange('day')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
              view === 'day'
                ? 'bg-white text-stone-800 shadow-sm'
                : 'text-stone-600 hover:text-stone-800'
            )}
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">{translations.dayView}</span>
          </button>
        </div>

        {/* New Booking Button */}
        <Button icon={Plus} onClick={onNewBooking}>
          {translations.newBooking}
        </Button>
      </div>
    </div>
  )
}
