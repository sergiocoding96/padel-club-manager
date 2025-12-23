'use client'

import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { PlayerStatus } from '@/types/player'

interface StatusBadgeProps {
  status: PlayerStatus
  size?: 'sm' | 'md'
  showDot?: boolean
  className?: string
}

const statusStyles: Record<PlayerStatus, {
  bg: string
  text: string
  dot: string
  ring: string
}> = {
  active: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    ring: 'ring-emerald-200',
  },
  inactive: {
    bg: 'bg-stone-100',
    text: 'text-stone-500',
    dot: 'bg-stone-400',
    ring: 'ring-stone-200',
  },
  suspended: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    ring: 'ring-amber-200',
  },
}

export function StatusBadge({
  status,
  size = 'md',
  showDot = true,
  className,
}: StatusBadgeProps) {
  const t = useTranslations('players.status')
  const styles = statusStyles[status]

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium ring-1 transition-colors',
        styles.bg,
        styles.text,
        styles.ring,
        sizeClasses[size],
        className
      )}
    >
      {showDot && (
        <span className="relative flex h-2 w-2">
          {status === 'active' && (
            <span
              className={cn(
                'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
                styles.dot
              )}
            />
          )}
          <span className={cn('relative inline-flex h-2 w-2 rounded-full', styles.dot)} />
        </span>
      )}
      {t(status)}
    </span>
  )
}

// Compact version for tables/lists
export function StatusDot({ status, className }: { status: PlayerStatus; className?: string }) {
  const styles = statusStyles[status]

  return (
    <span className={cn('relative flex h-2.5 w-2.5', className)} title={status}>
      {status === 'active' && (
        <span
          className={cn(
            'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
            styles.dot
          )}
        />
      )}
      <span className={cn('relative inline-flex h-2.5 w-2.5 rounded-full', styles.dot)} />
    </span>
  )
}

export default StatusBadge
