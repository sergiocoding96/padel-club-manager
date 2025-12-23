'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import {
  Users,
  Plus,
  ChevronLeft,
  TrendingUp,
  Activity,
  UserCheck,
  Percent,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { GroupList } from '@/components/groups/GroupList'
import { GroupForm, GroupFormCompact } from '@/components/groups/GroupForm'
import { useGroups, useGroupMutations, useGroupFilters, useGroupSort } from '@/hooks/useGroups'
import type { GroupFilters, GroupSortOptions, ViewMode, GroupCreateInput, GroupUpdateInput, GroupSummary } from '@/types/groups'

// Stats Card Component
function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  color,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  trend?: string
  color: string
}) {
  return (
    <div className="bg-white rounded-xl p-4 border border-stone-200/60 shadow-sm">
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {trend && (
          <span className="flex items-center gap-0.5 text-xs font-medium text-green-600">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold text-stone-900">{value}</div>
        <div className="text-sm text-stone-500">{label}</div>
      </div>
    </div>
  )
}

export default function GroupsPage() {
  const t = useTranslations('groups')
  const tNav = useTranslations('nav')

  // Hooks
  const { filters, setFilters } = useGroupFilters()
  const { sort, setSort } = useGroupSort()
  const { data: groups, isLoading, error, count } = useGroups({
    filters,
    sort,
    enableRealtime: true,
  })
  const { create, createState } = useGroupMutations()
  const isCreating = createState.isLoading

  // Local state
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Handlers
  const handleFilterChange = useCallback((newFilters: GroupFilters) => {
    setFilters(newFilters)
  }, [setFilters])

  const handleSortChange = useCallback((newSort: GroupSortOptions) => {
    setSort(newSort)
  }, [setSort])

  const handleCreateGroup = useCallback(async (data: GroupCreateInput | GroupUpdateInput) => {
    await create(data as GroupCreateInput)
    setShowCreateModal(false)
  }, [create])

  // Calculate stats
  const activeGroups = groups.filter((g: GroupSummary) => g.status === 'active').length
  const totalPlayers = groups.reduce((sum: number, g: GroupSummary) => sum + g.player_count, 0)
  const fullGroups = groups.filter((g: GroupSummary) => g.player_count >= g.max_players).length
  const avgCapacity =
    groups.length > 0
      ? Math.round(
          (groups.reduce((sum: number, g: GroupSummary) => sum + (g.player_count / g.max_players) * 100, 0) /
            groups.length)
        )
      : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back + Title */}
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 -ml-2 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-stone-900">
                  {t('title')}
                </h1>
                <p className="text-sm text-stone-500 hidden sm:block">
                  {t('subtitle')}
                </p>
              </div>
            </div>

            {/* Actions */}
            <Button
              onClick={() => setShowCreateModal(true)}
              icon={Plus}
              size="md"
            >
              <span className="hidden sm:inline">{t('addGroup')}</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Users}
            label={t('stats.totalGroups')}
            value={count}
            color="#3B82F6"
          />
          <StatCard
            icon={Activity}
            label={t('stats.activeGroups')}
            value={activeGroups}
            trend={count > 0 ? `${Math.round((activeGroups / count) * 100)}%` : undefined}
            color="#10B981"
          />
          <StatCard
            icon={UserCheck}
            label={t('stats.totalPlayers')}
            value={totalPlayers}
            color="#8B5CF6"
          />
          <StatCard
            icon={Percent}
            label={t('stats.averageSize')}
            value={`${avgCapacity}%`}
            color="#F59E0B"
          />
        </div>

        {/* Groups List */}
        <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-6">
          <GroupList
            groups={groups}
            isLoading={isLoading}
            error={error}
            filters={filters}
            sort={sort}
            viewMode={viewMode}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            onViewModeChange={setViewMode}
            onCreateGroup={() => setShowCreateModal(true)}
          />
        </div>
      </main>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-stone-900">
                    {t('addGroup')}
                  </h2>
                  <p className="text-sm text-stone-500">
                    {t('subtitle')}
                  </p>
                </div>
              </div>

              <GroupFormCompact
                mode="create"
                onSubmit={handleCreateGroup}
                onCancel={() => setShowCreateModal(false)}
                isSubmitting={isCreating}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
