'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  Users,
  Calendar,
  User,
  ChevronRight,
  Clock,
  Zap,
} from 'lucide-react'
import { cn, getLevelCategory } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { GroupSummary } from '@/types/groups'

interface GroupCardProps {
  group: GroupSummary
  locale?: string
  onClick?: () => void
  className?: string
}

// Day names for schedule display
const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const

export function GroupCard({ group, locale = 'es', onClick, className }: GroupCardProps) {
  const router = useRouter()
  const t = useTranslations('groups')
  const tLevels = useTranslations('levels')
  const tDays = useTranslations('groups.days.short')

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      router.push(`/groups/${group.id}`)
    }
  }

  const isFull = group.player_count >= group.max_players
  const capacityPercentage = (group.player_count / group.max_players) * 100
  const isActive = group.status === 'active'

  // Get group color or default
  const groupColor = group.color || '#3B82F6'

  // Get next session info
  const nextSession = group.next_session
  const nextSessionDay = nextSession ? tDays(DAY_KEYS[nextSession.day]) : null

  return (
    <article
      onClick={handleClick}
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-white',
        'border border-stone-200/60 shadow-sm',
        'cursor-pointer transition-all duration-300 ease-out',
        'hover:shadow-xl hover:shadow-stone-200/50 hover:-translate-y-1',
        'hover:border-stone-300/80',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        className
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={`${group.name} - ${t('card.level', { min: group.level_min ?? 1, max: group.level_max ?? 7 })}`}
    >
      {/* Color Accent Bar - Left Side */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 group-hover:w-2"
        style={{ backgroundColor: groupColor }}
      />

      {/* Diagonal Background Accent */}
      <div
        className="absolute -right-20 -top-20 w-40 h-40 opacity-[0.03] rotate-12 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110"
        style={{ backgroundColor: groupColor }}
      />

      {/* Card Content */}
      <div className="relative p-5 pl-6">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            {/* Group Name */}
            <h3 className="font-semibold text-stone-900 text-lg leading-tight truncate mb-1.5 group-hover:text-stone-950 transition-colors">
              {group.name}
            </h3>

            {/* Level Badge */}
            <div className="flex items-center gap-2">
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
                style={{
                  backgroundColor: `${groupColor}15`,
                  color: groupColor,
                }}
              >
                <Zap className="w-3 h-3" />
                <span>
                  {group.level_min === group.level_max
                    ? tLevels(String(group.level_min ?? 1))
                    : `${group.level_min ?? 1} - ${group.level_max ?? 7}`}
                </span>
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex-shrink-0">
            {isActive ? (
              <span className="relative flex h-3 w-3">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: `${groupColor}80` }}
                />
                <span
                  className="relative inline-flex rounded-full h-3 w-3"
                  style={{ backgroundColor: groupColor }}
                />
              </span>
            ) : (
              <span className="inline-flex rounded-full h-3 w-3 bg-stone-300" />
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Coach */}
          <div className="flex items-center gap-2 text-sm text-stone-600">
            <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-stone-500" />
            </div>
            <span className="truncate">
              {group.coach_name || t('card.noCoach')}
            </span>
          </div>

          {/* Next Session */}
          <div className="flex items-center gap-2 text-sm text-stone-600">
            <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5 text-stone-500" />
            </div>
            {nextSession ? (
              <span className="truncate">
                {nextSessionDay} {nextSession.startTime}
              </span>
            ) : (
              <span className="text-stone-400 truncate">-</span>
            )}
          </div>
        </div>

        {/* Capacity Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-sm">
              <Users className="w-4 h-4 text-stone-400" />
              <span className="font-medium text-stone-700">
                {group.player_count}
                <span className="text-stone-400 font-normal">/{group.max_players}</span>
              </span>
            </div>
            {isFull && (
              <Badge variant="warning" size="sm" className="text-[10px] px-1.5 py-0.5">
                {t('card.full')}
              </Badge>
            )}
          </div>
          <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${Math.min(capacityPercentage, 100)}%`,
                backgroundColor: isFull ? '#f59e0b' : groupColor,
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <Badge
            variant={isActive ? 'success' : 'default'}
            size="sm"
            className="text-[10px]"
          >
            {t(`status.${group.status}`)}
          </Badge>

          <div
            className="flex items-center gap-1 text-xs font-medium transition-colors duration-200 group-hover:translate-x-0.5"
            style={{ color: groupColor }}
          >
            <span>{t('viewDetails')}</span>
            <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </article>
  )
}

// Skeleton loader for GroupCard
export function GroupCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-stone-200/60 shadow-sm">
      {/* Skeleton accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-stone-200 animate-pulse" />

      <div className="p-5 pl-6">
        {/* Header skeleton */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1">
            <div className="h-6 w-3/4 bg-stone-200 rounded-lg animate-pulse mb-2" />
            <div className="h-6 w-24 bg-stone-100 rounded-lg animate-pulse" />
          </div>
          <div className="h-3 w-3 bg-stone-200 rounded-full animate-pulse" />
        </div>

        {/* Info grid skeleton */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-stone-100 animate-pulse" />
            <div className="h-4 w-20 bg-stone-100 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-stone-100 animate-pulse" />
            <div className="h-4 w-16 bg-stone-100 rounded animate-pulse" />
          </div>
        </div>

        {/* Capacity skeleton */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <div className="h-4 w-12 bg-stone-100 rounded animate-pulse" />
          </div>
          <div className="h-1.5 bg-stone-100 rounded-full" />
        </div>

        {/* Footer skeleton */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <div className="h-5 w-14 bg-stone-100 rounded-full animate-pulse" />
          <div className="h-4 w-20 bg-stone-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}
