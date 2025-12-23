'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Modal } from '@/components/ui/modal'
import { PlayerForm, PlayerFormSubmitData } from './PlayerForm'
import { createPlayer } from '@/app/actions/players'
import { useToast } from '@/contexts/ToastContext'

interface CreatePlayerModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function CreatePlayerModal({
  isOpen,
  onClose,
  onSuccess,
}: CreatePlayerModalProps) {
  const t = useTranslations('players')
  const toast = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: PlayerFormSubmitData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await createPlayer(data)

      if (!result.success) {
        setError(result.error || t('messages.createError'))
        toast.error(t('messages.createError'))
        return
      }

      toast.success(t('messages.createSuccess'), data.name)
      onSuccess?.()
      onClose()
    } catch (err) {
      setError(t('messages.createError'))
      toast.error(t('messages.createError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setError(null)
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('newPlayer')}
      description={t('form.namePlaceholder')}
      size="lg"
    >
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <PlayerForm
        onSubmit={handleSubmit}
        onCancel={handleClose}
        isSubmitting={isSubmitting}
      />
    </Modal>
  )
}

export default CreatePlayerModal
