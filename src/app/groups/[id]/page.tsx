'use client'

import { useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import {
  ChevronLeft,
  Edit,
  Trash2,
  Users,
  User,
  MapPin,
  Zap,
  MoreHorizontal,
  Copy,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GroupScheduleDisplay } from '@/components/groups/GroupScheduleDisplay'
import { GroupPlayers, PlayerSearchModal, GroupPlayersSkeleton } from '@/components/groups/GroupPlayers'
import { GroupForm } from '@/components/groups/GroupForm'
import {
  useGroup,
  useGroupMutations,
  useAvailablePlayers,
} from '@/hooks/useGroups'
import type { GroupUpdateInput, GroupCreateInput } from '@/types/groups'

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

export default function GroupDetailPage() {
  const router = useRouter()
  const params = useParams()
  const groupId = params.id as string

  const t = useTranslations('groups')
  const tLevels = useTranslations('levels')

  // Hooks
  const { data: group, isLoading, error } = useGroup(groupId, { enableRealtime: true })
  const { update, remove, addPlayer, removePlayer, updateState, deleteState } = useGroupMutations()
  const isUpdating = updateState.isLoading
  const isDeleting = deleteState.isLoading
  const { data: availablePlayers, isLoading: isLoadingPlayers } = useAvailablePlayers({
    groupId,
    levelMin: group?.level_min ?? 1,
    levelMax: group?.level_max ?? 7,
  })

  // Local state
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showAddPlayer, setShowAddPlayer] = useState(false)
  const [showActions, setShowActions] = useState(false)

  // Handlers
  const handleUpdate = useCallback(async (data: GroupCreateInput | GroupUpdateInput) => {
    await update(groupId, data as GroupUpdateInput)
    setShowEditModal(false)
  }, [groupId, update])

  const handleDelete = useCallback(async () => {
    await remove(groupId)
    router.push('/groups')
  }, [groupId, remove, router])

  const handleAddPlayers = useCallback(async (playerIds: string[]) => {
    for (const playerId of playerIds) {
      await addPlayer(groupId, playerId)
    }
    setShowAddPlayer(false)
  }, [groupId, addPlayer])

  const handleRemovePlayer = useCallback(async (playerId: string) => {
    await removePlayer(groupId, playerId)
  }, [groupId, removePlayer])

  // Loading state
  if (isLoading) {
    return <GroupDetailSkeleton />
  }

  // Error state
  if (error || !group) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 mb-2">
            {t('groupNotFound')}
          </h1>
          <p className="text-stone-500 mb-6">
            {t('groupDeleted')}
          </p>
          <Link href="/groups">
            <Button icon={ChevronLeft}>
              {t('title')}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const groupColor = group.color || '#3B82F6'
  const isFull = group.player_count >= group.max_players
  const capacityPercentage = (group.player_count / group.max_players) * 100
  const isActive = group.status === 'active'

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/groups"
                className="p-2 -ml-2 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-10 rounded-full"
                  style={{ backgroundColor: groupColor }}
                />
                <div>
                  <h1 className="text-lg font-semibold text-stone-900">
                    {group.name}
                  </h1>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={isActive ? 'success' : 'default'}
                      size="sm"
                    >
                      {t(`status.${group.status}`)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={Edit}
                onClick={() => setShowEditModal(true)}
              >
                <span className="hidden sm:inline">{t('editGroup')}</span>
              </Button>

              {/* More Actions Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="p-2 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>

                {showActions && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowActions(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-stone-200 bg-white shadow-lg z-20 py-1 overflow-hidden">
                      <button
                        onClick={() => {
                          // Duplicate logic here
                          setShowActions(false)
                        }}
                        className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-stone-50 transition-colors text-stone-700"
                      >
                        <Copy className="w-4 h-4" />
                        {t('duplicateGroup')}
                      </button>
                      <hr className="my-1 border-stone-100" />
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(true)
                          setShowActions(false)
                        }}
                        className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-red-50 transition-colors text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                        {t('deleteGroup')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Info Card */}
            <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm overflow-hidden">
              {/* Color Banner */}
              <div
                className="h-2"
                style={{ backgroundColor: groupColor }}
              />

              <div className="p-6">
                {/* Description */}
                {group.description && (
                  <p className="text-stone-600 mb-6">{group.description}</p>
                )}

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Level Range */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${groupColor}15` }}
                    >
                      <Zap className="w-5 h-5" style={{ color: groupColor }} />
                    </div>
                    <div>
                      <div className="text-xs text-stone-500">
                        {t('form.levelRange')}
                      </div>
                      <div className="font-medium text-stone-900">
                        {group.level_min === group.level_max
                          ? tLevels(String(group.level_min))
                          : `${tLevels(String(group.level_min))} - ${tLevels(String(group.level_max))}`}
                      </div>
                    </div>
                  </div>

                  {/* Max Players */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-stone-500" />
                    </div>
                    <div>
                      <div className="text-xs text-stone-500">
                        {t('form.maxPlayers')}
                      </div>
                      <div className="font-medium text-stone-900">
                        {group.max_players} players
                      </div>
                    </div>
                  </div>

                  {/* Coach */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-stone-500" />
                    </div>
                    <div>
                      <div className="text-xs text-stone-500">
                        {t('form.coach')}
                      </div>
                      <div className="font-medium text-stone-900">
                        {group.coach?.name || t('form.noCoach')}
                      </div>
                    </div>
                  </div>

                  {/* Court */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-stone-500" />
                    </div>
                    <div>
                      <div className="text-xs text-stone-500">
                        {t('form.court')}
                      </div>
                      <div className="font-medium text-stone-900">
                        {group.court?.name || t('form.noCourt')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Capacity Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-600">
                      {t('players.countOf', {
                        count: group.player_count,
                        max: group.max_players,
                      })}
                    </span>
                    {isFull && (
                      <Badge variant="warning" size="sm">
                        {t('card.full')}
                      </Badge>
                    )}
                  </div>
                  <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(capacityPercentage, 100)}%`,
                        backgroundColor: isFull ? '#f59e0b' : groupColor,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-6">
              <GroupScheduleDisplay
                schedule={group.schedule_template}
                color={groupColor}
                variant="expanded"
                showEmpty
              />
            </div>
          </div>

          {/* Sidebar - Players */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-6 sticky top-24">
              <GroupPlayers
                players={group.players}
                maxPlayers={group.max_players}
                levelMin={group.level_min ?? 1}
                levelMax={group.level_max ?? 7}
                groupColor={groupColor}
                onAddPlayer={() => setShowAddPlayer(true)}
                onRemovePlayer={handleRemovePlayer}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto py-8">
          <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 shadow-xl">
            <div className="p-6 max-h-[85vh] overflow-y-auto">
              <GroupForm
                mode="edit"
                initialData={{
                  id: group.id,
                  name: group.name,
                  description: group.description ?? undefined,
                  level_min: group.level_min ?? 1,
                  level_max: group.level_max ?? 7,
                  max_players: group.max_players,
                  coach_id: group.coach_id,
                  court_id: group.court_id,
                  schedule_template: group.schedule_template,
                  color: group.color ?? undefined,
                  status: group.status,
                }}
                onSubmit={handleUpdate}
                onCancel={() => setShowEditModal(false)}
                isSubmitting={isUpdating}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl max-w-sm w-full mx-4 p-6 shadow-xl">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">
                {t('deleteGroup')}
              </h3>
              <p className="text-sm text-stone-600 mb-6">
                {t('confirm.delete')}
              </p>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  fullWidth
                  onClick={handleDelete}
                  loading={isDeleting}
                  icon={Trash2}
                >
                  {t('deleteGroup')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Player Modal */}
      <PlayerSearchModal
        isOpen={showAddPlayer}
        onClose={() => setShowAddPlayer(false)}
        availablePlayers={availablePlayers}
        levelMin={group.level_min ?? 1}
        levelMax={group.level_max ?? 7}
        onAddPlayers={handleAddPlayers}
        isLoading={isLoadingPlayers}
      />
    </div>
  )
}

// Skeleton loader for detail page
function GroupDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100">
      {/* Header Skeleton */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg bg-stone-100 animate-pulse" />
              <div className="flex items-center gap-3">
                <div className="w-3 h-10 rounded-full bg-stone-200 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-5 w-32 bg-stone-100 rounded animate-pulse" />
                  <div className="h-5 w-16 bg-stone-100 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
            <div className="h-9 w-24 bg-stone-100 rounded-lg animate-pulse" />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm overflow-hidden">
              <div className="h-2 bg-stone-200 animate-pulse" />
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-stone-100 animate-pulse" />
                      <div className="space-y-1.5">
                        <div className="h-3 w-16 bg-stone-100 rounded animate-pulse" />
                        <div className="h-4 w-24 bg-stone-100 rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="h-2 bg-stone-100 rounded-full animate-pulse" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-6">
              <div className="h-6 w-32 bg-stone-100 rounded animate-pulse mb-4" />
              <div className="grid grid-cols-7 gap-2">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className="h-24 bg-stone-50 rounded-xl border border-stone-100 animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-6">
              <GroupPlayersSkeleton />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
