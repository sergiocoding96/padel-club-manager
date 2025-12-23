'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GroupDetailError({ error, reset }: ErrorProps) {
  const t = useTranslations('groups')

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Group detail page error:', error)
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
          {error.message || 'An unexpected error occurred while loading this group.'}
        </p>

        <div className="flex gap-3 justify-center">
          <Link
            href="/groups"
            className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 border border-stone-300 text-stone-700 hover:bg-stone-50 focus:ring-stone-500 px-4 py-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('title')}
          </Link>

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
