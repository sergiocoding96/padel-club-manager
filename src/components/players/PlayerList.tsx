'use client'

import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { Player } from '@/types/player'
import { PlayerCard } from './PlayerCard'
import { PlayerRow } from './PlayerRow'
import { SearchEmptyState } from '@/components/ui/empty-state'
import { SkeletonCard, SkeletonRow } from '@/components/ui/skeleton'
import { Users } from 'lucide-react'

interface PlayerListProps {
  players: Player[]
  viewMode: 'grid' | 'list'
  isLoading?: boolean
  hasFilters?: boolean
  onView?: (player: Player) => void
  onEdit?: (player: Player) => void
  onDelete?: (player: Player) => void
  onClearFilters?: () => void
  className?: string
}

export function PlayerList({
  players,
  viewMode,
  isLoading = false,
  hasFilters = false,
  onView,
  onEdit,
  onDelete,
  onClearFilters,
  className,
}: PlayerListProps) {
  const t = useTranslations('players')

  // Loading state
  if (isLoading) {
    if (viewMode === 'grid') {
      return (
        <div className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4', className)}>
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )
    }

    return (
      <div className={cn('divide-y divide-stone-100 rounded-xl border border-stone-200 bg-white', className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    )
  }

  // Empty state
  if (players.length === 0) {
    if (hasFilters) {
      return (
        <SearchEmptyState
          title={t('empty.noResultsTitle')}
          description={t('empty.noResultsDescription')}
          onClear={onClearFilters}
          clearLabel={t('filters.clearFilters')}
        />
      )
    }

    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 rounded-full bg-stone-100 p-4">
          <Users className="h-8 w-8 text-stone-400" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-semibold text-stone-900">{t('empty.title')}</h3>
        <p className="mt-2 max-w-sm text-sm text-stone-500">{t('empty.description')}</p>
      </div>
    )
  }

  // Grid view
  if (viewMode === 'grid') {
    return (
      <div className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4', className)}>
        {players.map((player, index) => (
          <div
            key={player.id}
            className="opacity-0 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <PlayerCard
              player={player}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        ))}
      </div>
    )
  }

  // List view
  return (
    <div className={cn('space-y-1', className)}>
      {players.map((player, index) => (
        <div
          key={player.id}
          className="opacity-0 animate-fade-in"
          style={{ animationDelay: `${index * 30}ms` }}
        >
          <PlayerRow
            player={player}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  )
}

export default PlayerList
