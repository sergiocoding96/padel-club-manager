'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Input, Textarea } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Building2, Trees } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Court } from '@/types/database'
import type { CourtFormData } from '@/lib/actions/courts'

type CourtFormProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CourtFormData) => Promise<void>
  court?: Court | null
  translations: {
    addCourt: string
    editCourt: string
    name: string
    surface: string
    indoor: string
    outdoor: string
    location: string
    status: string
    available: string
    maintenance: string
    reserved: string
    save: string
    cancel: string
    namePlaceholder?: string
    locationPlaceholder?: string
  }
}

const statusOptions: { value: Court['status']; labelKey: keyof CourtFormProps['translations'] }[] = [
  { value: 'available', labelKey: 'available' },
  { value: 'maintenance', labelKey: 'maintenance' },
  { value: 'reserved', labelKey: 'reserved' },
]

export function CourtForm({ isOpen, onClose, onSubmit, court, translations }: CourtFormProps) {
  const isEdit = !!court

  const [name, setName] = useState(court?.name ?? '')
  const [surfaceType, setSurfaceType] = useState<'indoor' | 'outdoor' | null>(court?.surface_type ?? null)
  const [location, setLocation] = useState(court?.location ?? '')
  const [status, setStatus] = useState<Court['status']>(court?.status ?? 'available')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Name is required')
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        name: name.trim(),
        surface_type: surfaceType,
        location: location.trim() || null,
        status,
      })
      handleClose()
    } catch {
      setError('Failed to save court')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setName(court?.name ?? '')
    setSurfaceType(court?.surface_type ?? null)
    setLocation(court?.location ?? '')
    setStatus(court?.status ?? 'available')
    setError('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? translations.editCourt : translations.addCourt}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <Input
          label={translations.name}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={translations.namePlaceholder ?? 'Court 1'}
          error={error && !name.trim() ? error : undefined}
          required
        />

        {/* Surface Type */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            {translations.surface}
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setSurfaceType('indoor')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all',
                surfaceType === 'indoor'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-stone-200 hover:border-stone-300 text-stone-600'
              )}
            >
              <Building2 className="w-5 h-5" />
              <span className="font-medium">{translations.indoor}</span>
            </button>
            <button
              type="button"
              onClick={() => setSurfaceType('outdoor')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all',
                surfaceType === 'outdoor'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-stone-200 hover:border-stone-300 text-stone-600'
              )}
            >
              <Trees className="w-5 h-5" />
              <span className="font-medium">{translations.outdoor}</span>
            </button>
          </div>
        </div>

        {/* Location */}
        <Input
          label={translations.location}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder={translations.locationPlaceholder ?? 'Building A, Floor 1'}
        />

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            {translations.status}
          </label>
          <div className="flex gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setStatus(option.value)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  status === option.value
                    ? option.value === 'available'
                      ? 'bg-green-100 text-green-700 border-2 border-green-500'
                      : option.value === 'maintenance'
                      ? 'bg-amber-100 text-amber-700 border-2 border-amber-500'
                      : 'bg-red-100 text-red-700 border-2 border-red-500'
                    : 'bg-stone-100 text-stone-600 border-2 border-transparent hover:bg-stone-200'
                )}
              >
                {translations[option.labelKey]}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && name.trim() && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
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
