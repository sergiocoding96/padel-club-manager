'use client'

import { useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { X, Users, Edit3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GroupFormCompact } from './GroupForm'
import type {
  FormMode,
  GroupCreateInput,
  GroupUpdateInput,
} from '@/types/groups'
import type { Coach, Court, GroupStatus } from '@/types/database'

// ==========================================
// Types
// ==========================================

interface GroupModalProps {
  isOpen: boolean
  onClose: () => void
  mode: FormMode
  initialData?: Partial<GroupCreateInput & { id: string; status: GroupStatus }>
  coaches?: Coach[]
  courts?: Court[]
  onSubmit: (data: GroupCreateInput | GroupUpdateInput) => Promise<void>
  isSubmitting?: boolean
}

// ==========================================
// GroupModal Component
// ==========================================

export function GroupModal({
  isOpen,
  onClose,
  mode,
  initialData,
  coaches,
  courts,
  onSubmit,
  isSubmitting,
}: GroupModalProps) {
  const t = useTranslations('groups')

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose, isSubmitting])

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && !isSubmitting) {
        onClose()
      }
    },
    [onClose, isSubmitting]
  )

  // Handle form submit
  const handleSubmit = useCallback(
    async (data: GroupCreateInput | GroupUpdateInput) => {
      await onSubmit(data)
    },
    [onSubmit]
  )

  if (!isOpen) return null

  const isEditMode = mode === 'edit'
  const Icon = isEditMode ? Edit3 : Users
  const iconBgColor = isEditMode ? 'bg-amber-100' : 'bg-blue-100'
  const iconColor = isEditMode ? 'text-amber-600' : 'text-blue-600'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        className={cn(
          'relative bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-xl',
          'animate-in fade-in-0 zoom-in-95 duration-200'
        )}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-stone-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center',
                  iconBgColor
                )}
              >
                <Icon className={cn('w-5 h-5', iconColor)} />
              </div>
              <div>
                <h2
                  id="modal-title"
                  className="text-lg font-semibold text-stone-900"
                >
                  {isEditMode ? t('editGroup') : t('addGroup')}
                </h2>
                <p className="text-sm text-stone-500">
                  {isEditMode ? t('form.editSubtitle') : t('subtitle')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className={cn(
                'p-2 -mr-2 rounded-lg text-stone-400 transition-colors',
                'hover:text-stone-600 hover:bg-stone-100',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              aria-label={t('form.cancel')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6">
            <GroupFormCompact
              mode={mode}
              initialData={initialData}
              coaches={coaches}
              courts={courts}
              onSubmit={handleSubmit}
              onCancel={onClose}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// Delete Confirmation Modal
// ==========================================

interface DeleteGroupModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  groupName: string
  playerCount: number
  isDeleting?: boolean
}

export function DeleteGroupModal({
  isOpen,
  onClose,
  onConfirm,
  groupName,
  playerCount,
  isDeleting,
}: DeleteGroupModalProps) {
  const t = useTranslations('groups')

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isDeleting) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose, isDeleting])

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && !isDeleting) {
        onClose()
      }
    },
    [onClose, isDeleting]
  )

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        className={cn(
          'relative bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl',
          'animate-in fade-in-0 zoom-in-95 duration-200'
        )}
      >
        <div className="p-6">
          {/* Icon */}
          <div className="w-12 h-12 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Title */}
          <h3
            id="delete-modal-title"
            className="text-lg font-semibold text-stone-900 text-center mb-2"
          >
            {t('delete.title')}
          </h3>

          {/* Description */}
          <p
            id="delete-modal-description"
            className="text-sm text-stone-600 text-center mb-2"
          >
            {t('delete.message', { name: groupName })}
          </p>

          {/* Warning if has players */}
          {playerCount > 0 && (
            <p className="text-sm text-amber-600 text-center bg-amber-50 rounded-lg p-2 mb-4">
              {t('delete.playersWarning', { count: playerCount })}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className={cn(
                'flex-1 px-4 py-2.5 rounded-xl font-medium text-sm',
                'bg-stone-100 text-stone-700',
                'hover:bg-stone-200 transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {t('form.cancel')}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className={cn(
                'flex-1 px-4 py-2.5 rounded-xl font-medium text-sm',
                'bg-red-600 text-white',
                'hover:bg-red-700 transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {isDeleting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
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
                  {t('delete.deleting')}
                </span>
              ) : (
                t('delete.confirm')
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// Add Players Modal
// ==========================================

export { PlayerSearchModal } from './GroupPlayers'
