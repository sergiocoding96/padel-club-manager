'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { Player, PlayerStatus } from '@/types/player'

// Form submission data type - what the form actually produces
export interface PlayerFormSubmitData {
  name: string
  email?: string
  phone?: string
  level_numeric: number
  status: PlayerStatus
  notes?: string
  objectives?: string
}
import { LevelIndicator } from './LevelIndicator'
import { User, Mail, Phone, FileText, Target, Loader2 } from 'lucide-react'

interface PlayerFormProps {
  player?: Player
  onSubmit: (data: PlayerFormSubmitData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
  className?: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  level?: string
}

const statusOptions: PlayerStatus[] = ['active', 'inactive', 'suspended']
const levelOptions = [1, 2, 3, 4, 5, 6, 7]

export function PlayerForm({
  player,
  onSubmit,
  onCancel,
  isSubmitting = false,
  className,
}: PlayerFormProps) {
  const t = useTranslations('players')
  const tLevels = useTranslations('levels')
  const tCommon = useTranslations('common')

  const [formData, setFormData] = useState({
    name: player?.name || '',
    email: player?.email || '',
    phone: player?.phone || '',
    level: player?.level || 1,
    status: player?.status || 'active' as PlayerStatus,
    notes: player?.notes || '',
    objectives: player?.objectives || '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateField = (name: string, value: string | number): string | undefined => {
    switch (name) {
      case 'name':
        if (!value || (typeof value === 'string' && value.trim().length === 0)) {
          return t('validation.nameRequired')
        }
        if (typeof value === 'string' && value.length < 2) {
          return t('validation.nameMinLength')
        }
        if (typeof value === 'string' && value.length > 100) {
          return t('validation.nameMaxLength')
        }
        break
      case 'email':
        if (value && typeof value === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(value)) {
            return t('validation.emailInvalid')
          }
        }
        break
      case 'phone':
        if (value && typeof value === 'string') {
          const phoneRegex = /^[+]?[\d\s()-]{7,20}$/
          if (!phoneRegex.test(value)) {
            return t('validation.phoneInvalid')
          }
        }
        break
      case 'level':
        if (typeof value === 'number' && (value < 1 || value > 7)) {
          return t('validation.levelRange')
        }
        break
    }
    return undefined
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    const processedValue = name === 'level' ? Number(value) : value

    setFormData((prev) => ({ ...prev, [name]: processedValue }))

    if (touched[name]) {
      const error = validateField(name, processedValue)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
    const value = formData[name as keyof typeof formData]
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const newErrors: FormErrors = {}
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData])
      if (error) {
        newErrors[key as keyof FormErrors] = error
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setTouched({
        name: true,
        email: true,
        phone: true,
        level: true,
      })
      return
    }

    // Transform form data to validation schema format (level -> level_numeric)
    const submitData = {
      name: formData.name,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      level_numeric: formData.level,
      status: formData.status,
      notes: formData.notes || undefined,
      objectives: formData.objectives || undefined,
    }

    await onSubmit(submitData)
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      {/* Name field */}
      <div>
        <label htmlFor="name" className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-700">
          <User className="h-4 w-4 text-stone-400" />
          {t('name')} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={() => handleBlur('name')}
          placeholder={t('form.namePlaceholder')}
          className={cn(
            'w-full rounded-xl border bg-white px-4 py-3 text-stone-900',
            'placeholder:text-stone-400',
            'focus:outline-none focus:ring-2 transition-all',
            errors.name && touched.name
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
              : 'border-stone-200 focus:border-blue-500 focus:ring-blue-500/20'
          )}
        />
        {errors.name && touched.name && (
          <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Email and Phone fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-700">
            <Mail className="h-4 w-4 text-stone-400" />
            {t('email')}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur('email')}
            placeholder={t('form.emailPlaceholder')}
            className={cn(
              'w-full rounded-xl border bg-white px-4 py-3 text-stone-900',
              'placeholder:text-stone-400',
              'focus:outline-none focus:ring-2 transition-all',
              errors.email && touched.email
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                : 'border-stone-200 focus:border-blue-500 focus:ring-blue-500/20'
            )}
          />
          {errors.email && touched.email && (
            <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-700">
            <Phone className="h-4 w-4 text-stone-400" />
            {t('phone')}
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={() => handleBlur('phone')}
            placeholder={t('form.phonePlaceholder')}
            className={cn(
              'w-full rounded-xl border bg-white px-4 py-3 text-stone-900',
              'placeholder:text-stone-400',
              'focus:outline-none focus:ring-2 transition-all',
              errors.phone && touched.phone
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                : 'border-stone-200 focus:border-blue-500 focus:ring-blue-500/20'
            )}
          />
          {errors.phone && touched.phone && (
            <p className="mt-1.5 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Level and Status fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="level" className="mb-2 block text-sm font-medium text-stone-700">
            {t('level')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              className={cn(
                'w-full appearance-none rounded-xl border border-stone-200 bg-white px-4 py-3 pr-12 text-stone-900',
                'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
                'transition-all'
              )}
            >
              {levelOptions.map((level) => (
                <option key={level} value={level}>
                  {level} - {tLevels(String(level))}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <LevelIndicator level={formData.level} size="sm" />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="status" className="mb-2 block text-sm font-medium text-stone-700">
            {t('status')}
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={cn(
              'w-full appearance-none rounded-xl border border-stone-200 bg-white px-4 py-3 text-stone-900',
              'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
              'transition-all'
            )}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {t(`status.${status}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes field */}
      <div>
        <label htmlFor="notes" className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-700">
          <FileText className="h-4 w-4 text-stone-400" />
          {t('notes')}
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder={t('form.notesPlaceholder')}
          rows={3}
          className={cn(
            'w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-stone-900',
            'placeholder:text-stone-400 resize-none',
            'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
            'transition-all'
          )}
        />
      </div>

      {/* Objectives field */}
      <div>
        <label htmlFor="objectives" className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-700">
          <Target className="h-4 w-4 text-stone-400" />
          {t('objectives')}
        </label>
        <textarea
          id="objectives"
          name="objectives"
          value={formData.objectives}
          onChange={handleChange}
          placeholder={t('form.objectivesPlaceholder')}
          rows={3}
          className={cn(
            'w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-stone-900',
            'placeholder:text-stone-400 resize-none',
            'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
            'transition-all'
          )}
        />
      </div>

      {/* Form actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className={cn(
            'rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-sm font-medium text-stone-700',
            'hover:bg-stone-50 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {tCommon('cancel')}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white',
            'hover:bg-blue-700 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {player ? tCommon('save') : tCommon('create')}
        </button>
      </div>
    </form>
  )
}

export default PlayerForm
