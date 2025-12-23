import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { getCourts } from './actions'
import { CourtsClient } from './CourtsClient'
import { CourtsSkeleton } from '@/components/courts'

export async function generateMetadata() {
  const t = await getTranslations('courts')
  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

async function CourtsContent() {
  const courts = await getCourts()

  return <CourtsClient initialCourts={courts} />
}

export default async function CourtsPage() {
  const t = await getTranslations('courts')

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-stone-800 tracking-tight">
            {t('title')}
          </h1>
          <p className="mt-2 text-stone-500">
            {t('subtitle')}
          </p>
        </header>

        {/* Courts Content with Suspense */}
        <Suspense fallback={<CourtsSkeleton viewMode="grid" count={6} />}>
          <CourtsContent />
        </Suspense>
      </div>
    </div>
  )
}
