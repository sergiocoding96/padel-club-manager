import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { getPlayers, getPlayerStats } from '@/app/actions/players'
import { toUIPlayer } from '@/types/player'
import { PlayersPageClient } from './PlayersPageClient'
import PlayersLoading from './loading'

export default async function PlayersPage() {
  const t = await getTranslations('players')

  // Fetch initial data in parallel
  const [playersResult, statsResult] = await Promise.all([
    getPlayers(
      { status: 'all' },
      { field: 'name', direction: 'asc' },
      { page: 1, pageSize: 12 }
    ),
    getPlayerStats(),
  ])

  // Transform database players to UI format
  const initialPlayers = playersResult.success
    ? {
        ...playersResult.data,
        data: playersResult.data.data.map(toUIPlayer),
      }
    : {
        data: [],
        total: 0,
        page: 1,
        pageSize: 12,
        totalPages: 0,
      }

  const stats = statsResult.success
    ? statsResult.data
    : {
        total: 0,
        active: 0,
        inactive: 0,
        suspended: 0,
        byLevel: {},
      }

  return (
    <Suspense fallback={<PlayersLoading />}>
      <PlayersPageClient
        initialPlayers={initialPlayers}
        stats={stats}
      />
    </Suspense>
  )
}
