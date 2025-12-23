'use client'

import { useState } from 'react'
import { Plus, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfirmModal } from '@/components/ui/modal'
import { CourtCard } from './CourtCard'
import { CourtForm } from './CourtForm'
import type { Court } from '@/types/database'
import { createCourt, updateCourt, deleteCourt, type CourtFormData } from '@/lib/actions/courts'

type CourtListProps = {
  initialCourts: Court[]
  translations: {
    title: string
    addCourt: string
    editCourt: string
    noCourts: string
    addFirstCourt: string
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
    edit: string
    delete: string
    deleteConfirm: string
    deleteWarning: string
    courtCreated: string
    courtUpdated: string
    courtDeleted: string
  }
}

export function CourtList({ initialCourts, translations }: CourtListProps) {
  const [courts, setCourts] = useState<Court[]>(initialCourts)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCourt, setEditingCourt] = useState<Court | null>(null)
  const [deletingCourt, setDeletingCourt] = useState<Court | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleCreateCourt = async (data: CourtFormData) => {
    const result = await createCourt(data)
    if (result.success && result.data) {
      setCourts((prev) => [...prev, result.data!].sort((a, b) => a.name.localeCompare(b.name)))
    } else {
      throw new Error(result.error)
    }
  }

  const handleUpdateCourt = async (data: CourtFormData) => {
    if (!editingCourt) return
    const result = await updateCourt(editingCourt.id, data)
    if (result.success && result.data) {
      setCourts((prev) =>
        prev.map((c) => (c.id === editingCourt.id ? result.data! : c))
          .sort((a, b) => a.name.localeCompare(b.name))
      )
    } else {
      throw new Error(result.error)
    }
  }

  const handleDeleteCourt = async () => {
    if (!deletingCourt) return
    setIsDeleting(true)
    const result = await deleteCourt(deletingCourt.id)
    if (result.success) {
      setCourts((prev) => prev.filter((c) => c.id !== deletingCourt.id))
      setDeletingCourt(null)
    } else {
      alert(result.error)
    }
    setIsDeleting(false)
  }

  const handleEdit = (court: Court) => {
    setEditingCourt(court)
  }

  const handleDelete = (court: Court) => {
    setDeletingCourt(court)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <LayoutGrid className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-800">{translations.title}</h1>
            <p className="text-sm text-stone-500">{courts.length} courts</p>
          </div>
        </div>
        <Button icon={Plus} onClick={() => setIsFormOpen(true)}>
          {translations.addCourt}
        </Button>
      </div>

      {/* Court Grid or Empty State */}
      {courts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courts.map((court) => (
            <CourtCard
              key={court.id}
              court={court}
              onEdit={handleEdit}
              onDelete={handleDelete}
              translations={{
                indoor: translations.indoor,
                outdoor: translations.outdoor,
                available: translations.available,
                maintenance: translations.maintenance,
                reserved: translations.reserved,
                edit: translations.edit,
                delete: translations.delete,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-stone-50 rounded-xl border-2 border-dashed border-stone-200">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4">
            <LayoutGrid className="w-8 h-8 text-stone-400" />
          </div>
          <h3 className="text-lg font-medium text-stone-600 mb-2">{translations.noCourts}</h3>
          <Button icon={Plus} onClick={() => setIsFormOpen(true)} className="mt-2">
            {translations.addFirstCourt}
          </Button>
        </div>
      )}

      {/* Create Court Modal */}
      <CourtForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateCourt}
        translations={{
          addCourt: translations.addCourt,
          editCourt: translations.editCourt,
          name: translations.name,
          surface: translations.surface,
          indoor: translations.indoor,
          outdoor: translations.outdoor,
          location: translations.location,
          status: translations.status,
          available: translations.available,
          maintenance: translations.maintenance,
          reserved: translations.reserved,
          save: translations.save,
          cancel: translations.cancel,
        }}
      />

      {/* Edit Court Modal */}
      <CourtForm
        isOpen={!!editingCourt}
        onClose={() => setEditingCourt(null)}
        onSubmit={handleUpdateCourt}
        court={editingCourt}
        translations={{
          addCourt: translations.addCourt,
          editCourt: translations.editCourt,
          name: translations.name,
          surface: translations.surface,
          indoor: translations.indoor,
          outdoor: translations.outdoor,
          location: translations.location,
          status: translations.status,
          available: translations.available,
          maintenance: translations.maintenance,
          reserved: translations.reserved,
          save: translations.save,
          cancel: translations.cancel,
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingCourt}
        onClose={() => setDeletingCourt(null)}
        onConfirm={handleDeleteCourt}
        title={translations.deleteConfirm}
        description={translations.deleteWarning}
        confirmLabel={translations.delete}
        cancelLabel={translations.cancel}
        variant="danger"
        loading={isDeleting}
      />
    </div>
  )
}
