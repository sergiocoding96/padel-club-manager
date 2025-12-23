import { getTranslations } from 'next-intl/server'
import { CourtList } from '@/components/courts/CourtList'
import { getCourts } from '@/lib/actions/courts'

export default async function CourtsPage() {
  const t = await getTranslations('courts')
  const tCommon = await getTranslations('common')

  const result = await getCourts()
  const courts = result.success && result.data ? result.data : []

  return (
    <main className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <CourtList
          initialCourts={courts}
          translations={{
            title: t('title'),
            addCourt: t('addCourt'),
            editCourt: t('editCourt'),
            noCourts: t('noCourts'),
            addFirstCourt: t('addFirstCourt'),
            name: t('name'),
            surface: t('surface'),
            indoor: t('indoor'),
            outdoor: t('outdoor'),
            location: t('location'),
            status: t('status'),
            available: t('available'),
            maintenance: t('maintenance'),
            reserved: t('reserved'),
            save: tCommon('save'),
            cancel: tCommon('cancel'),
            edit: tCommon('edit'),
            delete: tCommon('delete'),
            deleteConfirm: t('deleteConfirm'),
            deleteWarning: t('deleteWarning'),
            courtCreated: t('courtCreated'),
            courtUpdated: t('courtUpdated'),
            courtDeleted: t('courtDeleted'),
          }}
        />
      </div>
    </main>
  )
}
