'use client'

import { X, Edit2, Copy, Ban, Trash2, Calendar, Clock, MapPin, User, Users, GraduationCap, Repeat, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { es, enUS } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BOOKING_COLORS } from '@/types/bookings'
import type { BookingWithRelations } from '@/types/bookings'

type BookingDetailsProps = {
  booking: BookingWithRelations
  isOpen: boolean
  onClose: () => void
  onEdit: (booking: BookingWithRelations) => void
  onDuplicate: (booking: BookingWithRelations) => void
  onCancel: (booking: BookingWithRelations) => void
  onDelete: (booking: BookingWithRelations) => void
  locale?: string
  translations: {
    viewBooking: string
    rental: string
    groupClass: string
    privateLesson: string
    court: string
    date: string
    time: string
    player: string
    coach: string
    group: string
    participants: string
    notes: string
    status: string
    pending: string
    confirmed: string
    cancelled: string
    recurring: string
    edit: string
    duplicate: string
    cancel: string
    delete: string
    close: string
  }
}

export function BookingDetails({
  booking,
  isOpen,
  onClose,
  onEdit,
  onDuplicate,
  onCancel,
  onDelete,
  locale = 'es',
  translations,
}: BookingDetailsProps) {
  if (!isOpen) return null

  const dateLocale = locale === 'es' ? es : enUS
  const colors = BOOKING_COLORS[booking.booking_type]

  const getTypeLabel = (): string => {
    const labels = {
      rental: translations.rental,
      group_class: translations.groupClass,
      private_lesson: translations.privateLesson,
    }
    return labels[booking.booking_type]
  }

  const getStatusBadge = () => {
    const config = {
      pending: { variant: 'warning' as const, label: translations.pending },
      confirmed: { variant: 'success' as const, label: translations.confirmed },
      cancelled: { variant: 'error' as const, label: translations.cancelled },
    }
    const { variant, label } = config[booking.status]
    return <Badge variant={variant}>{label}</Badge>
  }

  const formatBookingDate = () => {
    const dateObj = new Date(booking.date + 'T00:00:00')
    return format(dateObj, 'EEEE, d MMMM yyyy', { locale: dateLocale })
  }

  const formatTimeRange = () => {
    const start = booking.start_time.substring(0, 5)
    const end = booking.end_time.substring(0, 5)
    return `${start} - ${end}`
  }

  const calculateDuration = (): string => {
    const [startH, startM] = booking.start_time.split(':').map(Number)
    const [endH, endM] = booking.end_time.split(':').map(Number)
    const minutes = (endH * 60 + endM) - (startH * 60 + startM)
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins}min`
    if (mins === 0) return `${hours}h`
    return `${hours}h ${mins}min`
  }

  const isCancelled = booking.status === 'cancelled'

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl border-l border-stone-200 z-50',
          'transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className={cn('flex items-center justify-between p-4 border-b', colors.bg)}>
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', colors.accent, 'text-white')}>
              {booking.booking_type === 'rental' && <User className="w-5 h-5" />}
              {booking.booking_type === 'group_class' && <Users className="w-5 h-5" />}
              {booking.booking_type === 'private_lesson' && <GraduationCap className="w-5 h-5" />}
            </div>
            <div>
              <h2 className={cn('font-semibold', colors.text)}>{getTypeLabel()}</h2>
              {getStatusBadge()}
            </div>
          </div>
          <button
            onClick={onClose}
            className={cn('p-2 rounded-lg transition-colors', colors.text, 'hover:bg-white/50')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-5 overflow-y-auto h-[calc(100vh-160px)]">
          {/* Court */}
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-stone-400 mt-0.5" />
            <div>
              <p className="text-xs text-stone-500 uppercase tracking-wide">{translations.court}</p>
              <p className="text-stone-800 font-medium">{booking.court.name}</p>
              <p className="text-sm text-stone-500">
                {booking.court.surface_type === 'indoor' ? 'Interior' : 'Exterior'}
                {booking.court.location && ` • ${booking.court.location}`}
              </p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-stone-400 mt-0.5" />
            <div>
              <p className="text-xs text-stone-500 uppercase tracking-wide">{translations.date}</p>
              <p className="text-stone-800 font-medium capitalize">{formatBookingDate()}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-stone-400 mt-0.5" />
            <div>
              <p className="text-xs text-stone-500 uppercase tracking-wide">{translations.time}</p>
              <p className="text-stone-800 font-medium">
                {formatTimeRange()} <span className="text-stone-500">({calculateDuration()})</span>
              </p>
            </div>
          </div>

          {/* Player (for rental and private lesson) */}
          {booking.player && (
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-stone-400 mt-0.5" />
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wide">{translations.player}</p>
                <p className="text-stone-800 font-medium">{booking.player.name}</p>
                {booking.player.email && (
                  <p className="text-sm text-stone-500">{booking.player.email}</p>
                )}
              </div>
            </div>
          )}

          {/* Group (for group class) */}
          {booking.group && (
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-stone-400 mt-0.5" />
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wide">{translations.group}</p>
                <p className="text-stone-800 font-medium">{booking.group.name}</p>
                <p className="text-sm text-stone-500">
                  Max {booking.group.max_players} {translations.participants}
                </p>
              </div>
            </div>
          )}

          {/* Coach (for group class and private lesson) */}
          {booking.coach && (
            <div className="flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-stone-400 mt-0.5" />
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wide">{translations.coach}</p>
                <p className="text-stone-800 font-medium">{booking.coach.name}</p>
                {booking.coach.email && (
                  <p className="text-sm text-stone-500">{booking.coach.email}</p>
                )}
              </div>
            </div>
          )}

          {/* Recurring indicator */}
          {booking.is_recurring && (
            <div className="flex items-start gap-3">
              <Repeat className="w-5 h-5 text-stone-400 mt-0.5" />
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wide">{translations.recurring}</p>
                <p className="text-stone-800 font-medium">Yes</p>
              </div>
            </div>
          )}

          {/* Notes */}
          {booking.notes && (
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-stone-400 mt-0.5" />
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wide">{translations.notes}</p>
                <p className="text-stone-700">{booking.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-stone-200">
          {isCancelled ? (
            <Button
              variant="danger"
              fullWidth
              icon={Trash2}
              onClick={() => onDelete(booking)}
            >
              {translations.delete}
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                icon={Edit2}
                onClick={() => onEdit(booking)}
              >
                {translations.edit}
              </Button>
              <Button
                variant="outline"
                icon={Copy}
                onClick={() => onDuplicate(booking)}
              >
                {translations.duplicate}
              </Button>
              <Button
                variant="danger"
                icon={Ban}
                onClick={() => onCancel(booking)}
                className="col-span-2"
              >
                {translations.cancel}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
