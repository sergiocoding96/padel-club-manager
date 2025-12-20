'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import {
  CheckSquare,
  Square,
  Power,
  PowerOff,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ConfirmModal } from '@/components/ui/modal'

// ==========================================
// Types
// ==========================================

interface BulkActionsToolbarProps {
  selectedCount: number
  totalCount: number
  isAllSelected: boolean
  isPartiallySelected: boolean
  onSelectAll: () => void
  onDeselectAll: () => void
  onActivate: () => Promise<{ success: number; failed: number } | null>
  onDeactivate: () => Promise<{ success: number; failed: number } | null>
  onDelete: () => Promise<{ success: number; failed: number } | null>
  onAssignCoach?: (coachId: string | null) => Promise<{ success: number; failed: number } | null>
  isLoading?: boolean
  className?: string
}

type ConfirmAction = 'activate' | 'deactivate' | 'delete' | null

// ==========================================
// BulkActionsToolbar Component
// ==========================================

export function BulkActionsToolbar({
  selectedCount,
  totalCount,
  isAllSelected,
  isPartiallySelected,
  onSelectAll,
  onDeselectAll,
  onActivate,
  onDeactivate,
  onDelete,
  isLoading = false,
  className,
}: BulkActionsToolbarProps) {
  const t = useTranslations('groups.bulk')

  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)
  const [actionResult, setActionResult] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const handleConfirmAction = useCallback(async () => {
    if (!confirmAction) return

    let result: { success: number; failed: number } | null = null

    switch (confirmAction) {
      case 'activate':
        result = await onActivate()
        break
      case 'deactivate':
        result = await onDeactivate()
        break
      case 'delete':
        result = await onDelete()
        break
    }

    if (result) {
      if (result.failed === 0) {
        setActionResult({
          type: 'success',
          message: t('success', { success: result.success, total: selectedCount }),
        })
      } else {
        setActionResult({
          type: 'error',
          message: t('error', { failed: result.failed }),
        })
      }

      // Clear result after 3 seconds
      setTimeout(() => setActionResult(null), 3000)
    }

    setConfirmAction(null)
    onDeselectAll()
  }, [confirmAction, onActivate, onDeactivate, onDelete, onDeselectAll, selectedCount, t])

  // Don't show toolbar if nothing is selected
  if (selectedCount === 0) {
    return null
  }

  return (
    <>
      {/* Toolbar */}
      <div
        className={cn(
          'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
          'bg-stone-900 text-white rounded-lg shadow-xl',
          'flex items-center gap-2 px-4 py-3',
          'animate-in slide-in-from-bottom-4 duration-200',
          className
        )}
      >
        {/* Selection Info */}
        <div className="flex items-center gap-2 pr-4 border-r border-stone-700">
          <button
            onClick={isAllSelected ? onDeselectAll : onSelectAll}
            className="p-1 hover:bg-stone-800 rounded transition-colors"
            title={isAllSelected ? t('deselectAll') : t('selectAll')}
          >
            {isAllSelected ? (
              <CheckSquare className="h-5 w-5" />
            ) : isPartiallySelected ? (
              <Square className="h-5 w-5 opacity-50" />
            ) : (
              <Square className="h-5 w-5" />
            )}
          </button>
          <span className="text-sm font-medium whitespace-nowrap">
            {t('selected', { count: selectedCount })}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirmAction('activate')}
            disabled={isLoading}
            className="text-white hover:bg-stone-800 hover:text-green-400"
          >
            <Power className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">{t('activate')}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirmAction('deactivate')}
            disabled={isLoading}
            className="text-white hover:bg-stone-800 hover:text-yellow-400"
          >
            <PowerOff className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">{t('deactivate')}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirmAction('delete')}
            disabled={isLoading}
            className="text-white hover:bg-stone-800 hover:text-red-400"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">{t('delete')}</span>
          </Button>
        </div>

        {/* Close Button */}
        <div className="pl-2 border-l border-stone-700">
          <button
            onClick={onDeselectAll}
            className="p-1 hover:bg-stone-800 rounded transition-colors"
            title={t('cancel')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 bg-stone-900/80 flex items-center justify-center rounded-lg">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}
      </div>

      {/* Result Toast */}
      {actionResult && (
        <div
          className={cn(
            'fixed bottom-24 left-1/2 -translate-x-1/2 z-50',
            'px-4 py-2 rounded-lg shadow-lg flex items-center gap-2',
            'animate-in slide-in-from-bottom-2 duration-200',
            actionResult.type === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
          )}
        >
          {actionResult.type === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <span className="text-sm">{actionResult.message}</span>
        </div>
      )}

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={confirmAction === 'activate'}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
        title={t('confirmActivate', { count: selectedCount })}
        confirmLabel={t('activate')}
        cancelLabel={t('cancel')}
        variant="default"
      />

      <ConfirmModal
        isOpen={confirmAction === 'deactivate'}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
        title={t('confirmDeactivate', { count: selectedCount })}
        confirmLabel={t('deactivate')}
        cancelLabel={t('cancel')}
        variant="warning"
      />

      <ConfirmModal
        isOpen={confirmAction === 'delete'}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
        title={t('confirmDelete', { count: selectedCount })}
        description={t('confirmDeleteDescription')}
        confirmLabel={t('delete')}
        cancelLabel={t('cancel')}
        variant="danger"
      />
    </>
  )
}

// ==========================================
// Compact Selection Checkbox for GroupCard
// ==========================================

interface GroupSelectionCheckboxProps {
  isSelected: boolean
  onToggle: () => void
  className?: string
}

export function GroupSelectionCheckbox({
  isSelected,
  onToggle,
  className,
}: GroupSelectionCheckboxProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        onToggle()
      }}
      className={cn(
        'absolute top-3 left-3 z-10',
        'w-6 h-6 rounded border-2 flex items-center justify-center',
        'transition-all duration-150',
        isSelected
          ? 'bg-blue-600 border-blue-600 text-white'
          : 'bg-white/80 border-stone-300 hover:border-blue-400',
        className
      )}
    >
      {isSelected && <CheckSquare className="h-4 w-4" />}
    </button>
  )
}
