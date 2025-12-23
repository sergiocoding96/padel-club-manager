'use client'

import { cn } from '@/lib/utils'

export default function PlayerDetailLoading() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Back button skeleton */}
      <div className="h-6 w-20 rounded bg-stone-200" />

      {/* Header skeleton */}
      <div className="relative">
        {/* Background */}
        <div className="h-48 rounded-t-2xl bg-gradient-to-br from-stone-300 to-stone-400 sm:h-56" />

        {/* Content */}
        <div className="relative rounded-b-2xl border border-t-0 border-stone-200 bg-white px-6 pb-6 pt-16 sm:px-8">
          {/* Avatar skeleton */}
          <div className="absolute -top-16 left-6 sm:left-8">
            <div className="h-28 w-28 rounded-full border-4 border-white bg-stone-300 sm:h-32 sm:w-32" />
          </div>

          {/* Info skeleton */}
          <div className="ml-32 sm:ml-40">
            <div className="h-8 w-48 rounded bg-stone-200" />
            <div className="mt-3 flex gap-3">
              <div className="h-6 w-20 rounded-full bg-stone-200" />
              <div className="h-6 w-24 rounded-full bg-stone-200" />
            </div>
            <div className="mt-4 flex gap-4">
              <div className="h-5 w-32 rounded bg-stone-200" />
              <div className="h-5 w-28 rounded bg-stone-200" />
              <div className="h-5 w-36 rounded bg-stone-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-10 rounded-lg',
              i === 0 ? 'w-24 bg-blue-100' : 'w-20 bg-stone-200'
            )}
          />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-stone-200 bg-white p-6"
          >
            <div className="mb-4 flex items-center gap-2">
              <div className="h-5 w-5 rounded bg-stone-200" />
              <div className="h-5 w-24 rounded bg-stone-200" />
            </div>
            <div className="space-y-3">
              <div className="h-4 w-full rounded bg-stone-200" />
              <div className="h-4 w-3/4 rounded bg-stone-200" />
              <div className="h-4 w-1/2 rounded bg-stone-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
