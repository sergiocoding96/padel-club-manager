'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Modal } from '@/components/ui/modal'
import { PlayerForm, PlayerFormSubmitData } from './PlayerForm'
import { Player } from '@/types/player'
import { updatePlayer } from '@/app/actions/players'
import { useToast } from '@/contexts/ToastContext'

interface EditPlayerModalProps {
  isOpen: boolean
  onClose: () => void
  player: Player | null
  onSuccess?: () => void
}

export function EditPlayerModal({
  isOpen,
  onClose,
  player,
  onSuccess,
}: EditPlayerModalProps) {
  const t = useTranslations('players')
  const toast = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: PlayerFormSubmitData) => {
    if (!player) return

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await updatePlayer(player.id, data)

      if (!result.success) {
        setError(result.error || t('messages.updateError'))
        toast.error(t('messages.updateError'))
        return
      }

      toast.success(t('messages.updateSuccess'), data.name)
      onSuccess?.()
      onClose()
    } catch (err) {
      setError(t('messages.updateError'))
      toast.error(t('messages.updateError'))
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

  if (!player) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('editPlayer')}
      description={player.name}
      size="lg"
    >
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <PlayerForm
        player={player}
        onSubmit={handleSubmit}
        onCancel={handleClose}
        isSubmitting={isSubmitting}
      />
    </Modal>
  )
}

export default EditPlayerModal
