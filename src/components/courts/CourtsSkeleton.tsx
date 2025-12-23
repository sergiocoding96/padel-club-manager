'use client'

import { cn } from '@/lib/utils'
import type { ViewMode } from './CourtsToolbar'

interface CourtsSkeletonProps {
  viewMode: ViewMode
  count?: number
}

function SkeletonCard() {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl overflow-hidden',
        'border border-stone-200/60',
        'animate-pulse'
      )}
    >
      {/* Header skeleton */}
      <div className="h-28 bg-gradient-to-br from-stone-200 to-stone-300" />

      {/* Content skeleton */}
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            {/* Title */}
            <div className="h-5 w-32 bg-stone-200 rounded-lg" />
            {/* Surface type */}
            <div className="h-4 w-24 bg-stone-100 rounded-lg" />
            {/* Location */}
            <div className="h-4 w-40 bg-stone-100 rounded-lg" />
          </div>
          {/* Menu button */}
          <div className="w-9 h-9 bg-stone-100 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

function SkeletonListItem() {
  return (
    <div
      className={cn(
        'bg-white rounded-xl',
        'border border-stone-200/60',
        'p-4 flex items-center gap-4',
        'animate-pulse'
      )}
    >
      {/* Color indicator */}
      <div className="w-1.5 h-14 rounded-full bg-stone-200 flex-shrink-0" />

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-3">
          {/* Name */}
          <div className="h-5 w-32 bg-stone-200 rounded-lg" />
          {/* Status badge */}
          <div className="h-5 w-20 bg-stone-100 rounded-full" />
        </div>
        <div className="flex items-center gap-4">
          {/* Surface type */}
          <div className="h-4 w-20 bg-stone-100 rounded-lg" />
          {/* Separator */}
          <div className="w-1 h-4 bg-stone-200 rounded-full" />
          {/* Location */}
          <div className="h-4 w-32 bg-stone-100 rounded-lg" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <div className="w-9 h-9 bg-stone-100 rounded-xl" />
        <div className="w-9 h-9 bg-stone-100 rounded-xl" />
      </div>
    </div>
  )
}

export function CourtsSkeleton({ viewMode, count = 6 }: CourtsSkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i)

  if (viewMode === 'list') {
    return (
      <div className="space-y-3">
        {items.map((i) => (
          <SkeletonListItem key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
