'use client'

import { useState, useMemo, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { Modal, ConfirmModal } from '@/components/ui'
import {
  CourtCard,
  CourtListItem,
  CourtForm,
  CourtsToolbar,
  CourtsEmptyState,
  CourtsSkeleton,
  type ViewMode,
} from '@/components/courts'
import { createCourt, updateCourt, deleteCourt, updateCourtStatus } from './actions'
import type { Court, CourtStatus } from '@/types/database'

interface CourtsClientProps {
  initialCourts: Court[]
}

export function CourtsClient({ initialCourts }: CourtsClientProps) {
  const t = useTranslations('courts')
  const tCommon = useTranslations('common')

  // Courts state
  const [courts, setCourts] = useState<Court[]>(initialCourts)

  // Filter state
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<CourtStatus | 'all'>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCourt, setEditingCourt] = useState<Court | null>(null)
  const [deletingCourt, setDeletingCourt] = useState<Court | null>(null)

  // Form state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isPending, startTransition] = useTransition()

  // Memoized filtered courts
  const filteredCourts = useMemo(() => {
    return courts.filter((court) => {
      // Search filter
      const searchLower = search.toLowerCase()
      const matchesSearch =
        !search ||
        court.name.toLowerCase().includes(searchLower) ||
        court.location?.toLowerCase().includes(searchLower)

      // Status filter
      const matchesStatus = statusFilter === 'all' || court.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [courts, search, statusFilter])

  // Handlers
  const handleAddCourt = () => {
    setEditingCourt(null)
    setFormErrors({})
    setIsFormOpen(true)
  }

  const handleEditCourt = (court: Court) => {
    setEditingCourt(court)
    setFormErrors({})
    setIsFormOpen(true)
  }

  const handleDeleteCourt = (court: Court) => {
    setDeletingCourt(court)
  }

  const handleStatusChange = (court: Court, status: CourtStatus) => {
    startTransition(async () => {
      const result = await updateCourtStatus(court.id, status)
      if (result.success && result.data) {
        setCourts((prev) =>
          prev.map((c) => (c.id === court.id ? (result.data as Court) : c))
        )
      }
    })
  }

  const handleFormSubmit = (formData: FormData) => {
    startTransition(async () => {
      if (editingCourt) {
        // Update existing court
        const result = await updateCourt(editingCourt.id, formData)
        if (result.success && result.data) {
          setCourts((prev) =>
            prev.map((c) => (c.id === editingCourt.id ? (result.data as Court) : c))
          )
          setIsFormOpen(false)
          setEditingCourt(null)
          setFormErrors({})
        } else if (result.errors) {
          setFormErrors(result.errors)
        }
      } else {
        // Create new court
        const result = await createCourt(formData)
        if (result.success && result.data) {
          setCourts((prev) => [...prev, result.data as Court])
          setIsFormOpen(false)
          setFormErrors({})
        } else if (result.errors) {
          setFormErrors(result.errors)
        }
      }
    })
  }

  const handleDeleteConfirm = () => {
    if (!deletingCourt) return

    startTransition(async () => {
      const result = await deleteCourt(deletingCourt.id)
      if (result.success) {
        setCourts((prev) => prev.filter((c) => c.id !== deletingCourt.id))
        setDeletingCourt(null)
      }
    })
  }

  const handleClearFilters = () => {
    setSearch('')
    setStatusFilter('all')
  }

  const handleFormCancel = () => {
    setIsFormOpen(false)
    setEditingCourt(null)
    setFormErrors({})
  }

  // Determine empty state type
  const hasFilters = search || statusFilter !== 'all'
  const isEmpty = filteredCourts.length === 0

  return (
    <>
      {/* Toolbar */}
      <CourtsToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddCourt={handleAddCourt}
      />

      {/* Courts display */}
      <div className="mt-6">
        {isEmpty ? (
          <CourtsEmptyState
            type={hasFilters ? 'no-results' : 'no-courts'}
            onAddCourt={handleAddCourt}
            onClearFilters={handleClearFilters}
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourts.map((court) => (
              <CourtCard
                key={court.id}
                court={court}
                onEdit={handleEditCourt}
                onDelete={handleDeleteCourt}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCourts.map((court) => (
              <CourtListItem
                key={court.id}
                court={court}
                onEdit={handleEditCourt}
                onDelete={handleDeleteCourt}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleFormCancel}
        title={editingCourt ? t('editCourt') : t('addCourt')}
      >
        <CourtForm
          court={editingCourt}
          errors={formErrors}
          isPending={isPending}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingCourt}
        onClose={() => setDeletingCourt(null)}
        onConfirm={handleDeleteConfirm}
        title={t('deleteCourt')}
        description={t('deleteCourtConfirmation')}
        confirmLabel={tCommon('delete')}
        cancelLabel={tCommon('cancel')}
        variant="danger"
        loading={isPending}
      />
    </>
  )
}
