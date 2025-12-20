'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GroupsError({ error, reset }: ErrorProps) {
  const t = useTranslations('groups')

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Groups page error:', error)
  }, [error])

  return (
    <div className="min-h-[50vh] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>

        <h2 className="text-xl font-semibold text-stone-800 mb-2">
          {t('messages.errorLoading')}
        </h2>

        <p className="text-stone-500 mb-6">
          {error.message || 'An unexpected error occurred while loading the groups.'}
        </p>

        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
          >
            Go Home
          </Button>

          <Button onClick={reset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>

        {error.digest && (
          <p className="mt-6 text-xs text-stone-400">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
