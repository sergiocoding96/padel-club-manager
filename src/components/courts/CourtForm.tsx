'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { Input, Select, Textarea } from '@/components/ui'
import type { Court, CourtSurfaceType, CourtStatus } from '@/types/database'

interface CourtFormProps {
  court?: Court | null
  errors?: Record<string, string>
  isPending?: boolean
  onSubmit: (formData: FormData) => void
  onCancel: () => void
}

export function CourtForm({
  court,
  errors,
  isPending = false,
  onSubmit,
  onCancel,
}: CourtFormProps) {
  const t = useTranslations('courts')
  const tCommon = useTranslations('common')
  const formRef = useRef<HTMLFormElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  // Focus name input on mount
  useEffect(() => {
    nameInputRef.current?.focus()
  }, [])

  const surfaceTypeOptions: { value: CourtSurfaceType | ''; label: string }[] = [
    { value: '', label: t('selectSurfaceType') },
    { value: 'indoor', label: t('indoor') },
    { value: 'outdoor', label: t('outdoor') },
  ]

  const statusOptions: { value: CourtStatus; label: string }[] = [
    { value: 'available', label: t('available') },
    { value: 'maintenance', label: t('maintenance') },
    { value: 'reserved', label: t('reserved') },
  ]

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    onSubmit(formData)
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Court Name */}
      <div className="space-y-1.5">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-stone-700"
        >
          {t('name')} <span className="text-rose-500">*</span>
        </label>
        <Input
          ref={nameInputRef}
          id="name"
          name="name"
          type="text"
          defaultValue={court?.name ?? ''}
          placeholder={t('namePlaceholder')}
          disabled={isPending}
          className={cn(errors?.name && 'border-rose-300 focus:ring-rose-500')}
        />
        {errors?.name && (
          <p className="text-sm text-rose-600">{errors.name}</p>
        )}
      </div>

      {/* Surface Type */}
      <div className="space-y-1.5">
        <label
          htmlFor="surface_type"
          className="block text-sm font-medium text-stone-700"
        >
          {t('surfaceType')}
        </label>
        <Select
          id="surface_type"
          name="surface_type"
          defaultValue={court?.surface_type ?? ''}
          disabled={isPending}
          options={surfaceTypeOptions}
          className={cn(errors?.surface_type && 'border-rose-300 focus:ring-rose-500')}
        />
        {errors?.surface_type && (
          <p className="text-sm text-rose-600">{errors.surface_type}</p>
        )}
      </div>

      {/* Location */}
      <div className="space-y-1.5">
        <label
          htmlFor="location"
          className="block text-sm font-medium text-stone-700"
        >
          {t('location')}
        </label>
        <Input
          id="location"
          name="location"
          type="text"
          defaultValue={court?.location ?? ''}
          placeholder={t('locationPlaceholder')}
          disabled={isPending}
          className={cn(errors?.location && 'border-rose-300 focus:ring-rose-500')}
        />
        {errors?.location && (
          <p className="text-sm text-rose-600">{errors.location}</p>
        )}
      </div>

      {/* Status */}
      <div className="space-y-1.5">
        <label
          htmlFor="status"
          className="block text-sm font-medium text-stone-700"
        >
          {t('status')}
        </label>
        <Select
          id="status"
          name="status"
          defaultValue={court?.status ?? 'available'}
          disabled={isPending}
          options={statusOptions}
          className={cn(errors?.status && 'border-rose-300 focus:ring-rose-500')}
        />
        {errors?.status && (
          <p className="text-sm text-rose-600">{errors.status}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className={cn(
            'px-4 py-2.5 rounded-xl text-sm font-medium',
            'text-stone-600 hover:text-stone-800',
            'bg-stone-100 hover:bg-stone-200',
            'transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-stone-500/30',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {tCommon('cancel')}
        </button>
        <button
          type="submit"
          disabled={isPending}
          className={cn(
            'px-5 py-2.5 rounded-xl text-sm font-medium',
            'text-white bg-blue-600 hover:bg-blue-700',
            'shadow-sm hover:shadow-md',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/30',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'flex items-center gap-2'
          )}
        >
          {isPending && (
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {court ? tCommon('save') : tCommon('create')}
        </button>
      </div>
    </form>
  )
}
