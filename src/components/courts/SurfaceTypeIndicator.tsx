'use client'

import { Sun, Home } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import type { CourtSurfaceType } from '@/types/database'

interface SurfaceTypeIndicatorProps {
  type: CourtSurfaceType | null
  showLabel?: boolean
  className?: string
}

export function SurfaceTypeIndicator({
  type,
  showLabel = true,
  className,
}: SurfaceTypeIndicatorProps) {
  const t = useTranslations('courts')

  if (!type) return null

  const Icon = type === 'indoor' ? Home : Sun
  const label = t(type)

  return (
    <div className={cn('flex items-center gap-1.5 text-stone-600', className)}>
      <Icon className="w-4 h-4" />
      {showLabel && <span className="text-sm">{label}</span>}
    </div>
  )
}
