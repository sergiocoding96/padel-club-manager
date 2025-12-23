'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input, Textarea, Select } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { TimeSlotPicker } from './TimeSlotPicker'
import { cn } from '@/lib/utils'
import { Calendar, Users, User, GraduationCap, MapPin, FileText } from 'lucide-react'
import type { Court, Player, Coach, Group } from '@/types/database'
import type { BookingType, BookingStatus, BookingFormData, BookingWithRelations } from '@/types/bookings'
import { BOOKING_COLORS } from '@/types/bookings'

type BookingFormProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: BookingFormData) => Promise<void>
  booking?: BookingWithRelations | null
  initialData?: {
    court?: Court
    date?: Date
    time?: string
  } | null
  courts: Court[]
  players: Player[]
  coaches: Coach[]
  groups: Group[]
  locale?: string
  translations: {
    newBooking: string
    editBooking: string
    court: string
    date: string
    startTime: string
    endTime: string
    duration: string
    type: string
    rental: string
    groupClass: string
    privateLesson: string
    player: string
    coach: string
    group: string
    notes: string
    status: string
    pending: string
    confirmed: string
    save: string
    cancel: string
    selectCourt: string
    selectPlayer: string
    selectCoach: string
    selectGroup: string
    durationOptions: {
      '1h': string
      '1.5h': string
      '2h': string
    }
    validation: {
      courtRequired: string
      dateRequired: string
      timeRequired: string
      typeRequired: string
      playerRequired: string
      coachRequired: string
      groupRequired: string
      invalidTimeRange: string
    }
  }
}

const BOOKING_TYPES: { value: BookingType; labelKey: 'rental' | 'groupClass' | 'privateLesson' }[] = [
  { value: 'rental', labelKey: 'rental' },
  { value: 'group_class', labelKey: 'groupClass' },
  { value: 'private_lesson', labelKey: 'privateLesson' },
]

const STATUS_OPTIONS: { value: BookingStatus; labelKey: 'pending' | 'confirmed' }[] = [
  { value: 'pending', labelKey: 'pending' },
  { value: 'confirmed', labelKey: 'confirmed' },
]

export function BookingForm({
  isOpen,
  onClose,
  onSubmit,
  booking,
  initialData,
  courts,
  players,
  coaches,
  groups,
  locale = 'es',
  translations,
}: BookingFormProps) {
  const isEdit = !!booking

  // Form state
  const [courtId, setCourtId] = useState(booking?.court_id ?? initialData?.court?.id ?? '')
  const [date, setDate] = useState(
    booking?.date ?? (initialData?.date ? format(initialData.date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'))
  )
  const [startTime, setStartTime] = useState(
    booking?.start_time?.substring(0, 5) ?? initialData?.time ?? ''
  )
  const [endTime, setEndTime] = useState(
    booking?.end_time?.substring(0, 5) ?? ''
  )
  const [bookingType, setBookingType] = useState<BookingType>(booking?.booking_type ?? 'rental')
  const [playerId, setPlayerId] = useState(booking?.player_id ?? '')
  const [coachId, setCoachId] = useState(booking?.coach_id ?? '')
  const [groupId, setGroupId] = useState(booking?.group_id ?? '')
  const [notes, setNotes] = useState(booking?.notes ?? '')
  const [status, setStatus] = useState<BookingStatus>(booking?.status ?? 'confirmed')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when opened with new initial data
  useEffect(() => {
    if (isOpen) {
      if (booking) {
        setCourtId(booking.court_id)
        setDate(booking.date)
        setStartTime(booking.start_time.substring(0, 5))
        setEndTime(booking.end_time.substring(0, 5))
        setBookingType(booking.booking_type)
        setPlayerId(booking.player_id ?? '')
        setCoachId(booking.coach_id ?? '')
        setGroupId(booking.group_id ?? '')
        setNotes(booking.notes ?? '')
        setStatus(booking.status)
      } else if (initialData) {
        setCourtId(initialData.court?.id ?? '')
        setDate(initialData.date ? format(initialData.date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'))
        setStartTime(initialData.time ?? '')
        // Set default end time to 1.5 hours after start
        if (initialData.time) {
          const [h, m] = initialData.time.split(':').map(Number)
          const endMinutes = h * 60 + m + 90
          const endH = Math.floor(endMinutes / 60)
          const endM = endMinutes % 60
          if (endH <= 22) {
            setEndTime(`${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`)
          }
        }
        setBookingType('rental')
        setPlayerId('')
        setCoachId('')
        setGroupId('')
        setNotes('')
        setStatus('confirmed')
      }
      setErrors({})
    }
  }, [isOpen, booking, initialData])

  // Validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!courtId) newErrors.courtId = translations.validation.courtRequired
    if (!date) newErrors.date = translations.validation.dateRequired
    if (!startTime) newErrors.startTime = translations.validation.timeRequired
    if (!endTime) newErrors.endTime = translations.validation.timeRequired
    if (startTime && endTime && startTime >= endTime) {
      newErrors.endTime = translations.validation.invalidTimeRange
    }

    if (bookingType === 'rental' && !playerId) {
      newErrors.playerId = translations.validation.playerRequired
    }
    if (bookingType === 'group_class' && !groupId) {
      newErrors.groupId = translations.validation.groupRequired
    }
    if ((bookingType === 'group_class' || bookingType === 'private_lesson') && !coachId) {
      newErrors.coachId = translations.validation.coachRequired
    }
    if (bookingType === 'private_lesson' && !playerId) {
      newErrors.playerId = translations.validation.playerRequired
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await onSubmit({
        courtId,
        date,
        startTime: startTime + ':00',
        endTime: endTime + ':00',
        bookingType,
        playerId: playerId || null,
        coachId: coachId || null,
        groupId: groupId || null,
        isRecurring: false,
        recurringPattern: null,
        notes: notes || undefined,
        status,
      })
      handleClose()
    } catch (error) {
      console.error('Error submitting booking:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? translations.editBooking : translations.newBooking}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Booking Type Selection */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            {translations.type}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {BOOKING_TYPES.map(({ value, labelKey }) => {
              const colors = BOOKING_COLORS[value]
              const isSelected = bookingType === value

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setBookingType(value)
                    // Clear related fields when changing type
                    if (value === 'rental') {
                      setCoachId('')
                      setGroupId('')
                    } else if (value === 'group_class') {
                      setPlayerId('')
                    } else if (value === 'private_lesson') {
                      setGroupId('')
                    }
                  }}
                  className={cn(
                    'py-3 px-4 rounded-lg text-sm font-medium transition-all border-2',
                    isSelected
                      ? `${colors.bg} ${colors.text} border-current`
                      : 'border-stone-200 text-stone-600 hover:border-stone-300'
                  )}
                >
                  {translations[labelKey]}
                </button>
              )
            })}
          </div>
        </div>

        {/* Court and Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              <MapPin className="w-4 h-4 inline mr-1.5 text-stone-400" />
              {translations.court}
            </label>
            <select
              value={courtId}
              onChange={(e) => setCourtId(e.target.value)}
              className={cn(
                'w-full rounded-lg border px-3 py-2.5',
                'text-stone-900 bg-white',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                errors.courtId ? 'border-red-500' : 'border-stone-300'
              )}
            >
              <option value="">{translations.selectCourt}</option>
              {courts.filter(c => c.status === 'available').map((court) => (
                <option key={court.id} value={court.id}>
                  {court.name} ({court.surface_type === 'indoor' ? 'Interior' : 'Exterior'})
                </option>
              ))}
            </select>
            {errors.courtId && <p className="mt-1 text-sm text-red-600">{errors.courtId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              <Calendar className="w-4 h-4 inline mr-1.5 text-stone-400" />
              {translations.date}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
              className={cn(
                'w-full rounded-lg border px-3 py-2.5',
                'text-stone-900 bg-white',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                errors.date ? 'border-red-500' : 'border-stone-300'
              )}
            />
            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
          </div>
        </div>

        {/* Time Selection */}
        <TimeSlotPicker
          startTime={startTime}
          endTime={endTime}
          onStartTimeChange={setStartTime}
          onEndTimeChange={setEndTime}
          locale={locale}
          translations={{
            startTime: translations.startTime,
            endTime: translations.endTime,
            duration: translations.duration,
            durationOptions: translations.durationOptions,
          }}
        />
        {(errors.startTime || errors.endTime) && (
          <p className="text-sm text-red-600">{errors.startTime || errors.endTime}</p>
        )}

        {/* Type-specific Fields */}
        {(bookingType === 'rental' || bookingType === 'private_lesson') && (
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              <User className="w-4 h-4 inline mr-1.5 text-stone-400" />
              {translations.player}
            </label>
            <select
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              className={cn(
                'w-full rounded-lg border px-3 py-2.5',
                'text-stone-900 bg-white',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                errors.playerId ? 'border-red-500' : 'border-stone-300'
              )}
            >
              <option value="">{translations.selectPlayer}</option>
              {players.filter(p => p.status === 'active').map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
            {errors.playerId && <p className="mt-1 text-sm text-red-600">{errors.playerId}</p>}
          </div>
        )}

        {bookingType === 'group_class' && (
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              <Users className="w-4 h-4 inline mr-1.5 text-stone-400" />
              {translations.group}
            </label>
            <select
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className={cn(
                'w-full rounded-lg border px-3 py-2.5',
                'text-stone-900 bg-white',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                errors.groupId ? 'border-red-500' : 'border-stone-300'
              )}
            >
              <option value="">{translations.selectGroup}</option>
              {groups.filter(g => g.status === 'active').map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
            {errors.groupId && <p className="mt-1 text-sm text-red-600">{errors.groupId}</p>}
          </div>
        )}

        {(bookingType === 'group_class' || bookingType === 'private_lesson') && (
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              <GraduationCap className="w-4 h-4 inline mr-1.5 text-stone-400" />
              {translations.coach}
            </label>
            <select
              value={coachId}
              onChange={(e) => setCoachId(e.target.value)}
              className={cn(
                'w-full rounded-lg border px-3 py-2.5',
                'text-stone-900 bg-white',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                errors.coachId ? 'border-red-500' : 'border-stone-300'
              )}
            >
              <option value="">{translations.selectCoach}</option>
              {coaches.filter(c => c.status === 'active').map((coach) => (
                <option key={coach.id} value={coach.id}>
                  {coach.name}
                </option>
              ))}
            </select>
            {errors.coachId && <p className="mt-1 text-sm text-red-600">{errors.coachId}</p>}
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            <FileText className="w-4 h-4 inline mr-1.5 text-stone-400" />
            {translations.notes}
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className={cn(
              'w-full rounded-lg border border-stone-300 px-3 py-2.5',
              'text-stone-900 placeholder:text-stone-400',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            )}
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            {translations.status}
          </label>
          <div className="flex gap-2">
            {STATUS_OPTIONS.map(({ value, labelKey }) => (
              <button
                key={value}
                type="button"
                onClick={() => setStatus(value)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all border-2',
                  status === value
                    ? value === 'confirmed'
                      ? 'bg-green-100 text-green-700 border-green-500'
                      : 'bg-amber-100 text-amber-700 border-amber-500'
                    : 'border-stone-200 text-stone-600 hover:border-stone-300'
                )}
              >
                {translations[labelKey]}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-3 border-t border-stone-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="flex-1"
          >
            {translations.cancel}
          </Button>
          <Button
            type="submit"
            loading={loading}
            className="flex-1"
          >
            {translations.save}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
