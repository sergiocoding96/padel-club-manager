'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface PlayersErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function PlayersError({ error, reset }: PlayersErrorProps) {
  const t = useTranslations('common')

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Players page error:', error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <div className="mb-6 rounded-full bg-red-100 p-4">
        <AlertTriangle className="h-10 w-10 text-red-600" />
      </div>

      <h2 className="mb-2 text-xl font-semibold text-stone-900">
        {t('error')}
      </h2>

      <p className="mb-6 max-w-md text-stone-600">
        {t('errorMessage')}
      </p>

      <button
        onClick={reset}
        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <RefreshCw className="h-4 w-4" />
        {t('retry')}
      </button>
    </div>
  )
}
