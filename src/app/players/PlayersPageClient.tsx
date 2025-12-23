'use client'

import { useState, useCallback, useTransition, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import {
  Player,
  PlayerFilters as PlayerFiltersType,
  PaginatedResponse,
  ViewMode,
  SortField,
  SortOrder,
  toUIPlayer,
} from '@/types/player'
import { getPlayers, deletePlayer } from '@/app/actions/players'
import {
  PlayerList,
  PlayerFilters,
  CreatePlayerModal,
  EditPlayerModal,
} from '@/components/players'
import { Plus, Users, UserCheck, UserX, UserMinus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/contexts/ToastContext'

interface PlayersPageClientProps {
  initialPlayers: PaginatedResponse<Player>
  stats: {
    total: number
    active: number
    inactive: number
    suspended: number
    byLevel: Record<number, number>
  }
}

// Convert UI sort field to DB sort field
const sortFieldToDb = (field: SortField): 'name' | 'level_numeric' | 'created_at' | 'updated_at' => {
  const mapping: Record<SortField, 'name' | 'level_numeric' | 'created_at' | 'updated_at'> = {
    name: 'name',
    level: 'level_numeric',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
  return mapping[field]
}

export function PlayersPageClient({ initialPlayers, stats }: PlayersPageClientProps) {
  const t = useTranslations('players')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const toast = useToast()

  // State
  const [players, setPlayers] = useState<PaginatedResponse<Player>>(initialPlayers)
  const [filters, setFilters] = useState<PlayerFiltersType>({})
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [isLoading, setIsLoading] = useState(false)

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      // 'n' key to open new player modal (when no modal is open)
      if (e.key === 'n' && !isCreateModalOpen && !isEditModalOpen) {
        e.preventDefault()
        setIsCreateModalOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isCreateModalOpen, isEditModalOpen])

  // Fetch players with current filters
  const fetchPlayers = useCallback(async (
    newFilters?: PlayerFiltersType,
    newSortField?: SortField,
    newSortOrder?: SortOrder,
    page = 1
  ) => {
    setIsLoading(true)
    try {
      const result = await getPlayers(
        newFilters ?? filters,
        {
          field: sortFieldToDb(newSortField ?? sortField),
          direction: newSortOrder ?? sortOrder
        },
        { page, pageSize: 12 }
      )

      if (result.success) {
        setPlayers({
          ...result.data,
          data: result.data.data.map(toUIPlayer),
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [filters, sortField, sortOrder])

  // Handler for filter changes
  const handleFiltersChange = useCallback((newFilters: PlayerFiltersType) => {
    setFilters(newFilters)
    startTransition(() => {
      fetchPlayers(newFilters, sortField, sortOrder, 1)
    })
  }, [fetchPlayers, sortField, sortOrder])

  // Handler for sort changes
  const handleSortChange = useCallback((field: SortField, order: SortOrder) => {
    setSortField(field)
    setSortOrder(order)
    startTransition(() => {
      fetchPlayers(filters, field, order, 1)
    })
  }, [fetchPlayers, filters])

  // Handler for page changes
  const handlePageChange = useCallback((page: number) => {
    startTransition(() => {
      fetchPlayers(filters, sortField, sortOrder, page)
    })
  }, [fetchPlayers, filters, sortField, sortOrder])

  // Handler for edit
  const handleEdit = useCallback((player: Player) => {
    setSelectedPlayer(player)
    setIsEditModalOpen(true)
  }, [])

  // Handler for view
  const handleView = useCallback((player: Player) => {
    router.push(`/players/${player.id}`)
  }, [router])

  // Handler for delete
  const handleDelete = useCallback(async (player: Player) => {
    if (!confirm(t('messages.deleteConfirm'))) return

    const result = await deletePlayer(player.id)

    if (result.success) {
      toast.success(t('messages.deleteSuccess'), player.name)
      startTransition(() => {
        fetchPlayers(filters, sortField, sortOrder, players.page)
      })
    } else {
      toast.error(t('messages.deleteError'))
    }
  }, [t, filters, sortField, sortOrder, players.page, fetchPlayers, toast])

  // Handler for modal success
  const handleModalSuccess = useCallback(() => {
    startTransition(() => {
      fetchPlayers(filters, sortField, sortOrder, players.page)
    })
  }, [fetchPlayers, filters, sortField, sortOrder, players.page])

  // Handler for clearing filters
  const handleClearFilters = useCallback(() => {
    const emptyFilters: PlayerFiltersType = {}
    setFilters(emptyFilters)
    startTransition(() => {
      fetchPlayers(emptyFilters, sortField, sortOrder, 1)
    })
  }, [fetchPlayers, sortField, sortOrder])

  // Check if filters are active
  const hasActiveFilters = Boolean(
    filters.search ||
    (filters.status && filters.status !== 'all') ||
    filters.levelMin ||
    filters.levelMax
  )

  // Stats cards data
  const statsCards = [
    {
      label: t('stats.total'),
      value: stats.total,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgLight: 'bg-blue-50',
    },
    {
      label: t('stats.active'),
      value: stats.active,
      icon: UserCheck,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgLight: 'bg-emerald-50',
    },
    {
      label: t('stats.inactive'),
      value: stats.inactive,
      icon: UserMinus,
      color: 'bg-stone-400',
      textColor: 'text-stone-600',
      bgLight: 'bg-stone-50',
    },
    {
      label: t('stats.suspended'),
      value: stats.suspended,
      icon: UserX,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgLight: 'bg-red-50',
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            {t('title')}
          </h1>
          <p className="mt-2 text-stone-600">
            {t('subtitle')}
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          title={`${t('newPlayer')} (N)`}
          className={cn(
            'inline-flex items-center justify-center gap-2',
            'rounded-xl bg-blue-600 px-5 py-3',
            'text-sm font-semibold text-white',
            'shadow-lg shadow-blue-600/25',
            'transition-all duration-200',
            'hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30',
            'hover:-translate-y-0.5',
            'active:translate-y-0 active:shadow-lg',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          )}
        >
          <Plus className="h-5 w-5" />
          {t('newPlayer')}
          <kbd className="ml-1 hidden sm:inline-flex items-center justify-center rounded bg-blue-700/50 px-1.5 py-0.5 text-xs font-medium">
            N
          </kbd>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <div
            key={stat.label}
            className={cn(
              'relative overflow-hidden rounded-2xl bg-white p-5',
              'border border-stone-100 shadow-sm',
              'transition-all duration-200 hover:shadow-md',
              'opacity-0 animate-fade-in-up'
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Gradient background accent */}
            <div
              className={cn(
                'absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-10',
                stat.color
              )}
            />

            <div className="flex items-center gap-4">
              <div className={cn('rounded-xl p-3', stat.bgLight)}>
                <stat.icon className={cn('h-5 w-5', stat.textColor)} />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-500">{stat.label}</p>
                <p className={cn('text-2xl font-bold', stat.textColor)}>
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <PlayerFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Player List */}
      <PlayerList
        players={players.data}
        viewMode={viewMode}
        isLoading={isLoading || isPending}
        hasFilters={hasActiveFilters}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onClearFilters={handleClearFilters}
      />

      {/* Pagination */}
      {players.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(players.page - 1)}
            disabled={players.page === 1 || isLoading || isPending}
            className={cn(
              'rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700',
              'transition-colors hover:bg-stone-50',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
          >
            {tCommon('previous')}
          </button>

          <div className="flex gap-1">
            {Array.from({ length: players.totalPages }, (_, i) => i + 1)
              .filter(page => {
                // Show first, last, current, and adjacent pages
                return (
                  page === 1 ||
                  page === players.totalPages ||
                  Math.abs(page - players.page) <= 1
                )
              })
              .map((page, index, array) => {
                // Add ellipsis indicator
                const showEllipsis = index > 0 && page - array[index - 1] > 1

                return (
                  <div key={page} className="flex items-center gap-1">
                    {showEllipsis && (
                      <span className="px-2 text-stone-400">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(page)}
                      disabled={isLoading || isPending}
                      className={cn(
                        'h-10 min-w-[2.5rem] rounded-lg px-3 text-sm font-medium transition-colors',
                        page === players.page
                          ? 'bg-blue-600 text-white'
                          : 'border border-stone-200 bg-white text-stone-700 hover:bg-stone-50',
                        'disabled:cursor-not-allowed disabled:opacity-50'
                      )}
                    >
                      {page}
                    </button>
                  </div>
                )
              })}
          </div>

          <button
            onClick={() => handlePageChange(players.page + 1)}
            disabled={players.page === players.totalPages || isLoading || isPending}
            className={cn(
              'rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700',
              'transition-colors hover:bg-stone-50',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
          >
            {tCommon('next')}
          </button>
        </div>
      )}

      {/* Results count */}
      <p className="text-center text-sm text-stone-500">
        {t('pagination.showing', {
          start: (players.page - 1) * players.pageSize + 1,
          end: Math.min(players.page * players.pageSize, players.total),
          total: players.total,
        })}
      </p>

      {/* Modals */}
      <CreatePlayerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleModalSuccess}
      />

      <EditPlayerModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedPlayer(null)
        }}
        player={selectedPlayer}
        onSuccess={handleModalSuccess}
      />
    </div>
  )
}
