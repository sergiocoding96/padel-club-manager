'use client'

import { useState, useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import {
  Users,
  User,
  MapPin,
  Palette,
  FileText,
  Tag,
  Clock,
  Plus,
  Trash2,
  AlertCircle,
  Check,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input, Textarea, Select } from '@/components/ui/input'
import { LevelRangeSelector } from './LevelRangeSelector'
import type {
  GroupCreateInput,
  GroupUpdateInput,
  FormMode,
  ScheduleSlotInput,
} from '@/types/groups'
import type { Coach, Court, GroupStatus, ScheduleSlot, ScheduleTemplate } from '@/types/database'
import {
  GROUP_COLORS,
  LEVEL_RANGE,
  DEFAULT_MAX_PLAYERS,
  DAYS_OF_WEEK,
} from '@/types/groups'

interface GroupFormProps {
  mode: FormMode
  initialData?: Partial<GroupCreateInput & { id: string; status: GroupStatus }>
  coaches?: Coach[]
  courts?: Court[]
  onSubmit: (data: GroupCreateInput | GroupUpdateInput) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
  className?: string
}

interface FormErrors {
  name?: string
  level?: string
  maxPlayers?: string
  schedule?: string
}

const DEFAULT_FORM_DATA: GroupCreateInput = {
  name: '',
  description: '',
  level_min: 1,
  level_max: 4,
  max_players: DEFAULT_MAX_PLAYERS,
  coach_id: null,
  court_id: null,
  schedule_template: null,
  color: GROUP_COLORS[0],
}

export function GroupForm({
  mode,
  initialData,
  coaches = [],
  courts = [],
  onSubmit,
  onCancel,
  isSubmitting = false,
  className,
}: GroupFormProps) {
  const t = useTranslations('groups')
  const tCommon = useTranslations('common')
  const tDays = useTranslations('groups.days')

  // Form state
  const [formData, setFormData] = useState<GroupCreateInput & { status?: GroupStatus }>(() => ({
    ...DEFAULT_FORM_DATA,
    ...initialData,
    status: initialData?.status,
  }))
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())

  // Schedule slots state
  const [scheduleSlots, setScheduleSlots] = useState<ScheduleSlotInput[]>(() => {
    if (initialData?.schedule_template?.slots) {
      return initialData.schedule_template.slots.map((slot) => ({
        day: slot.day,
        startTime: slot.startTime,
        endTime: slot.endTime,
        courtId: slot.courtId,
      }))
    }
    return []
  })

  // Validation
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = t('validation.nameRequired')
    } else if (formData.name.trim().length < 3) {
      newErrors.name = t('validation.nameMinLength')
    } else if (formData.name.trim().length > 50) {
      newErrors.name = t('validation.nameMaxLength')
    }

    // Level validation
    if (formData.level_min > formData.level_max) {
      newErrors.level = t('validation.levelRangeInvalid')
    }

    // Max players validation
    if (formData.max_players < 1) {
      newErrors.maxPlayers = t('validation.maxPlayersMin')
    } else if (formData.max_players > 20) {
      newErrors.maxPlayers = t('validation.maxPlayersMax')
    }

    // Schedule validation
    for (const slot of scheduleSlots) {
      if (slot.startTime >= slot.endTime) {
        newErrors.schedule = t('validation.scheduleTimeInvalid')
        break
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, scheduleSlots, t])

  // Handle field change
  const handleChange = <K extends keyof typeof formData>(
    field: K,
    value: typeof formData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setTouched((prev) => new Set(prev).add(field))
  }

  // Handle schedule slot changes
  const addScheduleSlot = () => {
    setScheduleSlots((prev) => [
      ...prev,
      { day: 1, startTime: '09:00', endTime: '10:30' },
    ])
  }

  const removeScheduleSlot = (index: number) => {
    setScheduleSlots((prev) => prev.filter((_, i) => i !== index))
  }

  const updateScheduleSlot = (index: number, field: keyof ScheduleSlotInput, value: string | number) => {
    setScheduleSlots((prev) =>
      prev.map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot
      )
    )
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Build schedule template from slots
    const schedule_template: ScheduleTemplate | null =
      scheduleSlots.length > 0
        ? {
            slots: scheduleSlots.map((slot) => ({
              day: slot.day,
              startTime: slot.startTime,
              endTime: slot.endTime,
              courtId: slot.courtId,
            })),
          }
        : null

    const submitData: GroupCreateInput | GroupUpdateInput = {
      name: formData.name.trim(),
      description: formData.description?.trim() || undefined,
      level_min: formData.level_min,
      level_max: formData.level_max,
      max_players: formData.max_players,
      coach_id: formData.coach_id || null,
      court_id: formData.court_id || null,
      schedule_template,
      color: formData.color,
      ...(mode === 'edit' && formData.status ? { status: formData.status } : {}),
    }

    await onSubmit(submitData)
  }

  // Mark field as touched on blur
  const handleBlur = (field: string) => {
    setTouched((prev) => new Set(prev).add(field))
  }

  // Validate on touched fields change
  useEffect(() => {
    if (touched.size > 0) {
      validateForm()
    }
  }, [formData, touched, validateForm])

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-8', className)}>
      {/* Form Header */}
      <div className="border-b border-stone-200 pb-6">
        <h2 className="text-xl font-semibold text-stone-900">
          {mode === 'create' ? t('addGroup') : t('editGroup')}
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          {mode === 'create'
            ? t('noGroupsDescription')
            : t('form.descriptionPlaceholder')}
        </p>
      </div>

      {/* Basic Info Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-sm font-medium text-stone-700">
          <Tag className="w-4 h-4" />
          <span>Basic Information</span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Name */}
          <div className="md:col-span-2">
            <Input
              label={t('form.name')}
              name="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder={t('form.namePlaceholder')}
              error={touched.has('name') ? errors.name : undefined}
              icon={FileText}
              required
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <Textarea
              label={t('form.description')}
              name="description"
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder={t('form.descriptionPlaceholder')}
              rows={3}
            />
          </div>
        </div>
      </section>

      {/* Level & Capacity Section */}
      <section className="space-y-6 pt-6 border-t border-stone-100">
        <div className="flex items-center gap-2 text-sm font-medium text-stone-700">
          <Users className="w-4 h-4" />
          <span>Level & Capacity</span>
        </div>

        {/* Level Range */}
        <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100">
          <LevelRangeSelector
            minValue={formData.level_min}
            maxValue={formData.level_max}
            onMinChange={(value) => handleChange('level_min', value)}
            onMaxChange={(value) => handleChange('level_max', value)}
            min={LEVEL_RANGE.min}
            max={LEVEL_RANGE.max}
          />
          {errors.level && (
            <p className="mt-3 text-sm text-red-600 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              {errors.level}
            </p>
          )}
        </div>

        {/* Max Players */}
        <div className="max-w-xs">
          <Input
            label={t('form.maxPlayers')}
            name="maxPlayers"
            type="number"
            min={1}
            max={20}
            value={formData.max_players}
            onChange={(e) => handleChange('max_players', parseInt(e.target.value) || 1)}
            onBlur={() => handleBlur('maxPlayers')}
            error={touched.has('maxPlayers') ? errors.maxPlayers : undefined}
            icon={Users}
          />
        </div>
      </section>

      {/* Assignment Section */}
      <section className="space-y-6 pt-6 border-t border-stone-100">
        <div className="flex items-center gap-2 text-sm font-medium text-stone-700">
          <User className="w-4 h-4" />
          <span>Assignments</span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Coach Selection */}
          <Select
            label={t('form.coach')}
            name="coach"
            value={formData.coach_id || ''}
            onChange={(e) => handleChange('coach_id', e.target.value || null)}
            options={[
              { value: '', label: t('form.coachPlaceholder') },
              ...coaches.map((coach) => ({
                value: coach.id,
                label: coach.name,
              })),
            ]}
          />

          {/* Court Selection */}
          <Select
            label={t('form.court')}
            name="court"
            value={formData.court_id || ''}
            onChange={(e) => handleChange('court_id', e.target.value || null)}
            options={[
              { value: '', label: t('form.courtPlaceholder') },
              ...courts.map((court) => ({
                value: court.id,
                label: court.name,
              })),
            ]}
          />
        </div>
      </section>

      {/* Schedule Section */}
      <section className="space-y-6 pt-6 border-t border-stone-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-stone-700">
            <Clock className="w-4 h-4" />
            <span>{t('schedule.title')}</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={Plus}
            onClick={addScheduleSlot}
          >
            {t('schedule.addSlot')}
          </Button>
        </div>

        {scheduleSlots.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-200 p-8 text-center">
            <Clock className="w-8 h-8 text-stone-300 mx-auto mb-3" />
            <p className="text-sm text-stone-500">{t('schedule.noSchedule')}</p>
            <p className="text-xs text-stone-400 mt-1">
              {t('schedule.noScheduleDescription')}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {scheduleSlots.map((slot, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 rounded-xl bg-stone-50 border border-stone-100"
              >
                {/* Day Select */}
                <select
                  value={slot.day}
                  onChange={(e) => updateScheduleSlot(index, 'day', parseInt(e.target.value))}
                  className="flex-1 rounded-lg border border-stone-200 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {DAYS_OF_WEEK.map((day) => (
                    <option key={day.value} value={day.value}>
                      {tDays(day.labelKey.replace('days.', ''))}
                    </option>
                  ))}
                </select>

                {/* Start Time */}
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => updateScheduleSlot(index, 'startTime', e.target.value)}
                    className="rounded-lg border border-stone-200 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-stone-400">—</span>
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => updateScheduleSlot(index, 'endTime', e.target.value)}
                    className="rounded-lg border border-stone-200 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => removeScheduleSlot(index)}
                  className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label={t('schedule.removeSlot')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {errors.schedule && (
              <p className="text-sm text-red-600 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                {errors.schedule}
              </p>
            )}
          </div>
        )}
      </section>

      {/* Appearance Section */}
      <section className="space-y-6 pt-6 border-t border-stone-100">
        <div className="flex items-center gap-2 text-sm font-medium text-stone-700">
          <Palette className="w-4 h-4" />
          <span>{t('form.color')}</span>
        </div>

        <div className="flex flex-wrap gap-3">
          {GROUP_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleChange('color', color)}
              className={cn(
                'w-10 h-10 rounded-xl transition-all duration-200',
                'ring-offset-2 focus:outline-none focus:ring-2',
                formData.color === color
                  ? 'ring-2 ring-stone-900 scale-110 shadow-lg'
                  : 'hover:scale-105 ring-transparent'
              )}
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
            >
              {formData.color === color && (
                <Check className="w-5 h-5 text-white mx-auto" />
              )}
            </button>
          ))}
        </div>

        {/* Preview */}
        <div className="flex items-center gap-3 p-4 rounded-xl border border-stone-200 bg-white">
          <div
            className="w-1.5 h-12 rounded-full"
            style={{ backgroundColor: formData.color }}
          />
          <div className="flex-1">
            <div className="font-medium text-stone-900">
              {formData.name || t('form.namePlaceholder')}
            </div>
            <div
              className="text-xs font-medium mt-0.5"
              style={{ color: formData.color }}
            >
              Level {formData.level_min} - {formData.level_max}
            </div>
          </div>
          <div
            className="px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{
              backgroundColor: `${formData.color}15`,
              color: formData.color,
            }}
          >
            {formData.max_players} players max
          </div>
        </div>
      </section>

      {/* Status Section (Edit mode only) */}
      {mode === 'edit' && (
        <section className="space-y-6 pt-6 border-t border-stone-100">
          <div className="flex items-center gap-2 text-sm font-medium text-stone-700">
            <span>{t('form.status')}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleChange('status', 'active' as GroupStatus)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                formData.status === 'active'
                  ? 'bg-green-100 text-green-700 ring-2 ring-green-500'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              )}
            >
              {t('status.active')}
            </button>
            <button
              type="button"
              onClick={() => handleChange('status', 'inactive' as GroupStatus)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                formData.status === 'inactive'
                  ? 'bg-stone-200 text-stone-700 ring-2 ring-stone-500'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              )}
            >
              {t('status.inactive')}
            </button>
          </div>
        </section>
      )}

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-stone-200">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {tCommon('cancel')}
        </Button>
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
          icon={mode === 'create' ? Plus : Check}
        >
          {mode === 'create' ? t('actions.create') : t('actions.update')}
        </Button>
      </div>
    </form>
  )
}

// Compact form variant for modal use
export function GroupFormCompact({
  mode,
  initialData,
  coaches = [],
  courts = [],
  onSubmit,
  onCancel,
  isSubmitting = false,
}: Omit<GroupFormProps, 'className'>) {
  const t = useTranslations('groups')
  const tCommon = useTranslations('common')

  const [formData, setFormData] = useState<GroupCreateInput>(() => ({
    ...DEFAULT_FORM_DATA,
    ...initialData,
  }))
  const [error, setError] = useState<string | null>(null)

  const handleChange = <K extends keyof typeof formData>(
    field: K,
    value: typeof formData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      setError(t('validation.nameRequired'))
      return
    }

    if (formData.level_min > formData.level_max) {
      setError(t('validation.levelRangeInvalid'))
      return
    }

    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <Input
        label={t('form.name')}
        name="name"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder={t('form.namePlaceholder')}
        required
      />

      <div className="space-y-3">
        <label className="block text-sm font-medium text-stone-700">
          {t('form.levelRange')}
        </label>
        <LevelRangeSelector
          minValue={formData.level_min}
          maxValue={formData.level_max}
          onMinChange={(value) => handleChange('level_min', value)}
          onMaxChange={(value) => handleChange('level_max', value)}
          compact
        />
      </div>

      <Input
        label={t('form.maxPlayers')}
        name="maxPlayers"
        type="number"
        min={1}
        max={20}
        value={formData.max_players}
        onChange={(e) => handleChange('max_players', parseInt(e.target.value) || 1)}
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label={t('form.coach')}
          name="coach"
          value={formData.coach_id || ''}
          onChange={(e) => handleChange('coach_id', e.target.value || null)}
          options={[
            { value: '', label: t('form.coachPlaceholder') },
            ...coaches.map((c) => ({ value: c.id, label: c.name })),
          ]}
        />
        <Select
          label={t('form.court')}
          name="court"
          value={formData.court_id || ''}
          onChange={(e) => handleChange('court_id', e.target.value || null)}
          options={[
            { value: '', label: t('form.courtPlaceholder') },
            ...courts.map((c) => ({ value: c.id, label: c.name })),
          ]}
        />
      </div>

      {/* Color Picker */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-stone-700">
          {t('form.color')}
        </label>
        <div className="flex flex-wrap gap-2">
          {GROUP_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleChange('color', color)}
              className={cn(
                'w-8 h-8 rounded-lg transition-all',
                formData.color === color && 'ring-2 ring-offset-2 ring-stone-900'
              )}
              style={{ backgroundColor: color }}
            >
              {formData.color === color && (
                <Check className="w-4 h-4 text-white mx-auto" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          {tCommon('cancel')}
        </Button>
        <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
          {mode === 'create' ? t('actions.create') : t('actions.update')}
        </Button>
      </div>
    </form>
  )
}
