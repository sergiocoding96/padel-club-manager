'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import {
  Users,
  UserPlus,
  UserMinus,
  Search,
  X,
  Zap,
  Check,
  AlertTriangle,
  ChevronRight,
  Calendar,
  MoreHorizontal,
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { PlayerInGroup, AvailablePlayer } from '@/types/groups'

interface GroupPlayersProps {
  players: PlayerInGroup[]
  maxPlayers: number
  levelMin: number
  levelMax: number
  groupColor?: string
  onAddPlayer?: () => void
  onRemovePlayer?: (playerId: string) => void
  onPlayerClick?: (playerId: string) => void
  isLoading?: boolean
  className?: string
}

// Level color mapping
const LEVEL_COLORS: Record<number, string> = {
  1: '#22c55e',
  2: '#84cc16',
  3: '#eab308',
  4: '#f97316',
  5: '#ef4444',
  6: '#dc2626',
  7: '#991b1b',
}

export function GroupPlayers({
  players,
  maxPlayers,
  levelMin,
  levelMax,
  groupColor = '#3B82F6',
  onAddPlayer,
  onRemovePlayer,
  onPlayerClick,
  isLoading = false,
  className,
}: GroupPlayersProps) {
  const t = useTranslations('groups.players')
  const tLevels = useTranslations('levels')

  const [playerToRemove, setPlayerToRemove] = useState<PlayerInGroup | null>(null)

  const isFull = players.length >= maxPlayers
  const capacityPercentage = (players.length / maxPlayers) * 100

  // Sort players by name
  const sortedPlayers = useMemo(
    () => [...players].sort((a, b) => a.name.localeCompare(b.name)),
    [players]
  )

  const handleRemoveClick = (player: PlayerInGroup, e: React.MouseEvent) => {
    e.stopPropagation()
    setPlayerToRemove(player)
  }

  const confirmRemove = () => {
    if (playerToRemove) {
      onRemovePlayer?.(playerToRemove.id)
      setPlayerToRemove(null)
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${groupColor}15` }}
          >
            <Users className="w-5 h-5" style={{ color: groupColor }} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-stone-900">{t('title')}</h3>
            <p className="text-sm text-stone-500">
              {t('countOf', { count: players.length, max: maxPlayers })}
            </p>
          </div>
        </div>

        {onAddPlayer && (
          <Button
            onClick={onAddPlayer}
            size="sm"
            icon={UserPlus}
            disabled={isFull}
          >
            {t('add')}
          </Button>
        )}
      </div>

      {/* Capacity Bar */}
      <div className="space-y-1.5">
        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${Math.min(capacityPercentage, 100)}%`,
              backgroundColor: isFull ? '#f59e0b' : groupColor,
            }}
          />
        </div>
        {isFull && (
          <p className="text-xs text-amber-600 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            {t('groupFull') || 'Group is full'}
          </p>
        )}
      </div>

      {/* Player List */}
      {players.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-200 p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <Users className="w-7 h-7 text-stone-400" />
          </div>
          <p className="text-sm font-medium text-stone-600 mb-1">{t('empty')}</p>
          <p className="text-xs text-stone-400 mb-4">{t('emptyDescription')}</p>
          {onAddPlayer && !isFull && (
            <Button onClick={onAddPlayer} size="sm" icon={UserPlus}>
              {t('add')}
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {sortedPlayers.map((player) => {
            const playerLevel = player.level_numeric ?? 4
            const isLevelCompatible =
              playerLevel >= levelMin && playerLevel <= levelMax
            const levelColor = LEVEL_COLORS[playerLevel] || LEVEL_COLORS[4]

            return (
              <div
                key={player.id}
                onClick={() => onPlayerClick?.(player.id)}
                className={cn(
                  'group flex items-center gap-4 p-3 rounded-xl',
                  'border border-stone-100 bg-white',
                  'transition-all duration-200',
                  onPlayerClick && 'cursor-pointer hover:border-stone-200 hover:shadow-sm'
                )}
              >
                {/* Avatar */}
                <Avatar name={player.name} size="md" />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-stone-900 truncate">
                      {player.name}
                    </span>
                    <Badge
                      variant={player.membership_status === 'active' ? 'success' : 'default'}
                      size="sm"
                      className="text-[10px]"
                    >
                      {t(`memberStatus.${player.membership_status}`)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    {/* Level */}
                    <span
                      className="flex items-center gap-1 text-xs font-medium"
                      style={{ color: levelColor }}
                    >
                      <Zap className="w-3 h-3" />
                      {tLevels(String(playerLevel))}
                      {!isLevelCompatible && (
                        <AlertTriangle className="w-3 h-3 text-amber-500 ml-1" />
                      )}
                    </span>
                    {/* Join Date */}
                    <span className="text-xs text-stone-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(player.joined_at)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {onRemovePlayer && (
                  <button
                    onClick={(e) => handleRemoveClick(player, e)}
                    className={cn(
                      'p-2 rounded-lg text-stone-400 opacity-0 group-hover:opacity-100',
                      'hover:text-red-500 hover:bg-red-50',
                      'transition-all duration-200'
                    )}
                    aria-label={t('remove')}
                  >
                    <UserMinus className="w-4 h-4" />
                  </button>
                )}

                {onPlayerClick && (
                  <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-400 transition-colors" />
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Remove Confirmation Dialog */}
      {playerToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <UserMinus className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">
                {t('remove')}
              </h3>
              <p className="text-sm text-stone-600 mb-6">
                {t('removeConfirm', { name: playerToRemove.name })}
              </p>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setPlayerToRemove(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  fullWidth
                  onClick={confirmRemove}
                  icon={UserMinus}
                >
                  {t('remove')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Player Search Modal Component
interface PlayerSearchModalProps {
  isOpen: boolean
  onClose: () => void
  availablePlayers: AvailablePlayer[]
  levelMin: number
  levelMax: number
  onAddPlayers: (playerIds: string[]) => void
  isLoading?: boolean
}

export function PlayerSearchModal({
  isOpen,
  onClose,
  availablePlayers,
  levelMin,
  levelMax,
  onAddPlayers,
  isLoading = false,
}: PlayerSearchModalProps) {
  const t = useTranslations('groups.players')
  const tLevels = useTranslations('levels')

  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showOnlyCompatible, setShowOnlyCompatible] = useState(false)

  // Filter players
  const filteredPlayers = useMemo(() => {
    let result = availablePlayers

    // Filter by search
    if (search) {
      const lowerSearch = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerSearch) ||
          (p.email ?? '').toLowerCase().includes(lowerSearch)
      )
    }

    // Filter by level compatibility
    if (showOnlyCompatible) {
      result = result.filter((p) => p.level_compatible)
    }

    return result
  }, [availablePlayers, search, showOnlyCompatible])

  const toggleSelect = (playerId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(playerId)) {
        next.delete(playerId)
      } else {
        next.add(playerId)
      }
      return next
    })
  }

  const handleAddSelected = () => {
    onAddPlayers(Array.from(selectedIds))
    setSelectedIds(new Set())
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl max-w-lg w-full mx-4 max-h-[80vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-100">
          <h3 className="text-lg font-semibold text-stone-900">{t('add')}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 space-y-3 border-b border-stone-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder={t('search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-stone-50 border border-stone-200 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyCompatible}
              onChange={(e) => setShowOnlyCompatible(e.target.checked)}
              className="w-4 h-4 rounded border-stone-300 text-blue-600 focus:ring-blue-500"
            />
            Show only level compatible ({levelMin}-{levelMax})
          </label>
        </div>

        {/* Player List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredPlayers.length === 0 ? (
            <div className="text-center py-8 text-stone-500 text-sm">
              {t('noResults')}
            </div>
          ) : (
            <>
              <p className="text-xs text-stone-500 mb-3">
                {t('searchResults', { count: filteredPlayers.length })}
              </p>
              {filteredPlayers.map((player) => {
                const isSelected = selectedIds.has(player.id)
                const playerLevel = player.level_numeric ?? 4
                const levelColor = LEVEL_COLORS[playerLevel] || LEVEL_COLORS[4]

                return (
                  <button
                    key={player.id}
                    onClick={() => toggleSelect(player.id)}
                    disabled={player.current_groups.length > 0}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200',
                      player.current_groups.length > 0
                        ? 'bg-stone-50 cursor-not-allowed opacity-60'
                        : isSelected
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : 'bg-white border border-stone-100 hover:border-stone-200'
                    )}
                  >
                    {/* Selection Indicator */}
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                        isSelected
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-stone-300'
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>

                    {/* Avatar */}
                    <Avatar name={player.name} size="sm" />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-stone-900 truncate text-sm">
                          {player.name}
                        </span>
                        {player.current_groups.length > 0 && (
                          <Badge variant="default" size="sm" className="text-[10px]">
                            {t('alreadyInGroup')}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-stone-400">{player.email}</span>
                    </div>

                    {/* Level & Compatibility */}
                    <div className="flex items-center gap-2">
                      <span
                        className="flex items-center gap-1 text-xs font-medium"
                        style={{ color: levelColor }}
                      >
                        <Zap className="w-3 h-3" />
                        {player.level_numeric}
                      </span>
                      {player.level_compatible ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      )}
                    </div>
                  </button>
                )
              })}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-stone-100 bg-stone-50">
          <p className="text-sm text-stone-600">
            {selectedIds.size} player{selectedIds.size !== 1 ? 's' : ''} selected
          </p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleAddSelected}
              disabled={selectedIds.size === 0 || isLoading}
              loading={isLoading}
              icon={UserPlus}
            >
              Add Players
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Compact player list for cards
export function GroupPlayersMini({
  players,
  maxPlayers,
  groupColor = '#3B82F6',
  className,
}: {
  players: PlayerInGroup[]
  maxPlayers: number
  groupColor?: string
  className?: string
}) {
  const t = useTranslations('groups.players')
  const displayCount = Math.min(players.length, 4)
  const remainingCount = players.length - displayCount

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Avatar Stack */}
      <div className="flex -space-x-2">
        {players.slice(0, displayCount).map((player, i) => (
          <div
            key={player.id}
            className="relative"
            style={{ zIndex: displayCount - i }}
          >
            <Avatar
              name={player.name}
              size="sm"
              className="ring-2 ring-white"
            />
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center ring-2 ring-white">
            <span className="text-xs font-medium text-stone-600">+{remainingCount}</span>
          </div>
        )}
      </div>

      {/* Count */}
      <span className="text-sm text-stone-600">
        <span className="font-medium">{players.length}</span>
        <span className="text-stone-400">/{maxPlayers}</span>
      </span>
    </div>
  )
}

// Player list skeleton
export function GroupPlayersSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-stone-100 animate-pulse" />
          <div className="space-y-2">
            <div className="h-5 w-20 bg-stone-100 rounded animate-pulse" />
            <div className="h-4 w-32 bg-stone-100 rounded animate-pulse" />
          </div>
        </div>
        <div className="h-9 w-24 bg-stone-100 rounded-lg animate-pulse" />
      </div>

      <div className="h-2 bg-stone-100 rounded-full" />

      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-stone-100">
            <div className="w-10 h-10 rounded-full bg-stone-100 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-stone-100 rounded animate-pulse" />
              <div className="h-3 w-24 bg-stone-100 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
