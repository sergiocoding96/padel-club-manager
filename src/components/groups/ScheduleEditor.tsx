'use client'

import { useState, useCallback, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Plus, Trash2, Clock, Calendar, X, Check, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { ScheduleTemplate, ScheduleSlot } from '@/types/database'

// ==========================================
// Types
// ==========================================

interface ScheduleEditorProps {
  value: ScheduleTemplate | null
  onChange: (schedule: ScheduleTemplate | null) => void
  color?: string
  disabled?: boolean
  className?: string
}

interface SlotFormData {
  day: number
  startTime: string
  endTime: string
}

interface AddSlotModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (slot: ScheduleSlot) => void
  existingSlots: ScheduleSlot[]
  preselectedDay?: number
}

// ==========================================
// Constants
// ==========================================

const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const

const DEFAULT_START_TIME = '09:00'
const DEFAULT_END_TIME = '10:30'

// Common time slots for quick selection
const QUICK_TIMES = [
  { label: '08:00', value: '08:00' },
  { label: '09:00', value: '09:00' },
  { label: '10:00', value: '10:00' },
  { label: '11:00', value: '11:00' },
  { label: '12:00', value: '12:00' },
  { label: '16:00', value: '16:00' },
  { label: '17:00', value: '17:00' },
  { label: '18:00', value: '18:00' },
  { label: '19:00', value: '19:00' },
  { label: '20:00', value: '20:00' },
]

// ==========================================
// Helper Functions
// ==========================================

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

function isValidTimeRange(startTime: string, endTime: string): boolean {
  return timeToMinutes(endTime) > timeToMinutes(startTime)
}

function hasTimeConflict(newSlot: ScheduleSlot, existingSlots: ScheduleSlot[]): boolean {
  const sameDaySlots = existingSlots.filter(s => s.day === newSlot.day)
  const newStart = timeToMinutes(newSlot.startTime)
  const newEnd = timeToMinutes(newSlot.endTime)

  return sameDaySlots.some(slot => {
    const existingStart = timeToMinutes(slot.startTime)
    const existingEnd = timeToMinutes(slot.endTime)
    return (newStart < existingEnd && newEnd > existingStart)
  })
}

// ==========================================
// Add Slot Modal Component
// ==========================================

function AddSlotModal({
  isOpen,
  onClose,
  onAdd,
  existingSlots,
  preselectedDay,
}: AddSlotModalProps) {
  const t = useTranslations('groups')
  const [formData, setFormData] = useState<SlotFormData>({
    day: preselectedDay ?? 1, // Default to Monday
    startTime: DEFAULT_START_TIME,
    endTime: DEFAULT_END_TIME,
  })
  const [error, setError] = useState<string | null>(null)

  const handleDayChange = useCallback((day: number) => {
    setFormData(prev => ({ ...prev, day }))
    setError(null)
  }, [])

  const handleStartTimeChange = useCallback((startTime: string) => {
    setFormData(prev => ({ ...prev, startTime }))
    setError(null)
  }, [])

  const handleEndTimeChange = useCallback((endTime: string) => {
    setFormData(prev => ({ ...prev, endTime }))
    setError(null)
  }, [])

  const handleSubmit = useCallback(() => {
    // Validate time range
    if (!isValidTimeRange(formData.startTime, formData.endTime)) {
      setError(t('validation.scheduleTimeInvalid'))
      return
    }

    const newSlot: ScheduleSlot = {
      day: formData.day,
      startTime: formData.startTime,
      endTime: formData.endTime,
    }

    // Check for conflicts
    if (hasTimeConflict(newSlot, existingSlots)) {
      setError('Time slot conflicts with existing session')
      return
    }

    onAdd(newSlot)
    onClose()
    // Reset form
    setFormData({
      day: preselectedDay ?? 1,
      startTime: DEFAULT_START_TIME,
      endTime: DEFAULT_END_TIME,
    })
    setError(null)
  }, [formData, existingSlots, onAdd, onClose, preselectedDay, t])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-sm shadow-xl animate-in fade-in-0 zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-stone-900">
                {t('schedule.addSlot')}
              </h3>
              <p className="text-sm text-stone-500">
                {t('schedule.title')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Day Selection */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              {t('schedule.day')}
            </label>
            <div className="grid grid-cols-7 gap-1">
              {DAY_KEYS.map((dayKey, index) => (
                <button
                  key={dayKey}
                  type="button"
                  onClick={() => handleDayChange(index)}
                  className={cn(
                    'p-2 text-xs font-medium rounded-lg transition-all',
                    formData.day === index
                      ? 'bg-blue-600 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  )}
                >
                  {t(`days.short.${dayKey}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                {t('schedule.startTime')}
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => handleStartTimeChange(e.target.value)}
                className={cn(
                  'w-full px-3 py-2 rounded-xl border text-sm',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  'border-stone-200'
                )}
              />
              {/* Quick time buttons */}
              <div className="flex flex-wrap gap-1 mt-2">
                {QUICK_TIMES.slice(0, 5).map(({ label, value }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleStartTimeChange(value)}
                    className={cn(
                      'px-2 py-1 text-xs rounded-md transition-colors',
                      formData.startTime === value
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                {t('schedule.endTime')}
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => handleEndTimeChange(e.target.value)}
                className={cn(
                  'w-full px-3 py-2 rounded-xl border text-sm',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  'border-stone-200'
                )}
              />
              {/* Quick time buttons */}
              <div className="flex flex-wrap gap-1 mt-2">
                {QUICK_TIMES.slice(5).map(({ label, value }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleEndTimeChange(value)}
                    className={cn(
                      'px-2 py-1 text-xs rounded-md transition-colors',
                      formData.endTime === value
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-stone-100">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            {t('form.cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            icon={Check}
            className="flex-1"
          >
            {t('schedule.addSlot')}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// Schedule Editor Component
// ==========================================

export function ScheduleEditor({
  value,
  onChange,
  color = '#3B82F6',
  disabled = false,
  className,
}: ScheduleEditorProps) {
  const t = useTranslations('groups')
  const [showAddModal, setShowAddModal] = useState(false)
  const [preselectedDay, setPreselectedDay] = useState<number | undefined>()

  // Group slots by day
  const slotsByDay = useMemo(() => {
    const map = new Map<number, ScheduleSlot[]>()
    if (value?.slots) {
      value.slots.forEach((slot) => {
        const existing = map.get(slot.day) || []
        map.set(slot.day, [...existing, slot].sort((a, b) => a.startTime.localeCompare(b.startTime)))
      })
    }
    return map
  }, [value])

  const totalSlots = value?.slots?.length || 0

  // Handlers
  const handleAddSlot = useCallback((slot: ScheduleSlot) => {
    const newSlots = [...(value?.slots || []), slot]
    onChange({ slots: newSlots })
  }, [value, onChange])

  const handleRemoveSlot = useCallback((dayIndex: number, slotIndex: number) => {
    if (!value?.slots) return

    const daySlots = slotsByDay.get(dayIndex) || []
    const slotToRemove = daySlots[slotIndex]

    const newSlots = value.slots.filter(
      s => !(s.day === slotToRemove.day && s.startTime === slotToRemove.startTime && s.endTime === slotToRemove.endTime)
    )

    onChange(newSlots.length > 0 ? { slots: newSlots } : null)
  }, [value, slotsByDay, onChange])

  const handleDayClick = useCallback((dayIndex: number) => {
    if (disabled) return
    setPreselectedDay(dayIndex)
    setShowAddModal(true)
  }, [disabled])

  const openAddModal = useCallback(() => {
    setPreselectedDay(undefined)
    setShowAddModal(true)
  }, [])

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" style={{ color }} />
          <span className="text-sm font-medium text-stone-900">
            {t('schedule.title')}
          </span>
          {totalSlots > 0 && (
            <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
              {t('schedule.sessions', { count: totalSlots })}
            </span>
          )}
        </div>
        {!disabled && (
          <Button
            variant="secondary"
            size="sm"
            icon={Plus}
            onClick={openAddModal}
          >
            {t('schedule.addSlot')}
          </Button>
        )}
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
                'rounded-xl border transition-all duration-200 min-h-[100px]',
                hasSlots
                  ? 'border-stone-200 bg-white shadow-sm'
                  : 'border-dashed border-stone-200 bg-stone-50/50',
                !disabled && 'cursor-pointer hover:border-stone-300 hover:shadow-sm'
              )}
              onClick={() => handleDayClick(index)}
            >
              {/* Day Header */}
              <div
                className={cn(
                  'py-2 px-2 text-center border-b',
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
              <div className="p-2 space-y-1.5">
                {hasSlots ? (
                  daySlots.map((slot, slotIndex) => (
                    <div
                      key={`${slot.startTime}-${slot.endTime}`}
                      className="group relative bg-stone-50 rounded-lg p-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-1 text-[10px] text-stone-600">
                        <Clock className="w-2.5 h-2.5" />
                        <span className="font-medium">{slot.startTime}</span>
                      </div>
                      <div className="text-[10px] text-stone-400 ml-3.5">
                        {slot.endTime}
                      </div>

                      {/* Remove button */}
                      {!disabled && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveSlot(index, slotIndex)
                          }}
                          className={cn(
                            'absolute -top-1 -right-1 w-5 h-5 rounded-full',
                            'bg-red-500 text-white opacity-0 group-hover:opacity-100',
                            'flex items-center justify-center transition-opacity',
                            'hover:bg-red-600'
                          )}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center py-4">
                    {!disabled ? (
                      <Plus className="w-4 h-4 text-stone-300" />
                    ) : (
                      <span className="text-stone-300 text-lg">—</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {totalSlots === 0 && (
        <div className="text-center text-sm text-stone-500 py-2">
          {t('schedule.noScheduleDescription')}
        </div>
      )}

      {/* Add Slot Modal */}
      <AddSlotModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddSlot}
        existingSlots={value?.slots || []}
        preselectedDay={preselectedDay}
      />
    </div>
  )
}

// ==========================================
// Compact Schedule Editor (for forms)
// ==========================================

export function ScheduleEditorCompact({
  value,
  onChange,
  color = '#3B82F6',
  disabled = false,
  className,
}: ScheduleEditorProps) {
  const t = useTranslations('groups')
  const [showEditor, setShowEditor] = useState(false)

  const totalSlots = value?.slots?.length || 0

  if (showEditor) {
    return (
      <div className={cn('space-y-3', className)}>
        <ScheduleEditor
          value={value}
          onChange={onChange}
          color={color}
          disabled={disabled}
        />
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowEditor(false)}
          className="w-full"
        >
          {t('form.cancel')}
        </Button>
      </div>
    )
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setShowEditor(true)}
        disabled={disabled}
        className={cn(
          'w-full p-4 rounded-xl border-2 border-dashed transition-all text-left',
          'hover:border-stone-300 hover:bg-stone-50',
          disabled && 'opacity-50 cursor-not-allowed',
          totalSlots > 0
            ? 'border-stone-200 bg-stone-50/50'
            : 'border-stone-200'
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${color}15` }}
          >
            <Calendar className="w-5 h-5" style={{ color }} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-stone-900">
              {t('schedule.title')}
            </div>
            <div className="text-xs text-stone-500">
              {totalSlots > 0
                ? t('schedule.sessions', { count: totalSlots })
                : t('schedule.noScheduleDescription')}
            </div>
          </div>
          <Plus className="w-5 h-5 text-stone-400" />
        </div>

        {/* Show existing slots preview */}
        {totalSlots > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {value?.slots?.slice(0, 5).map((slot, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                style={{
                  backgroundColor: `${color}15`,
                  color,
                }}
              >
                {t(`days.short.${DAY_KEYS[slot.day]}`)} {slot.startTime}
              </span>
            ))}
            {totalSlots > 5 && (
              <span className="text-xs text-stone-500 px-2 py-1">
                +{totalSlots - 5} more
              </span>
            )}
          </div>
        )}
      </button>
    </div>
  )
}
