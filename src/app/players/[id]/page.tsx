import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getPlayer } from '@/app/actions/players'
import { toUIPlayer } from '@/types/player'
import { PlayerDetailClient } from './PlayerDetailClient'
import PlayerDetailLoading from './loading'

interface PlayerDetailPageProps {
  params: {
    id: string
  }
}

export default async function PlayerDetailPage({ params }: PlayerDetailPageProps) {
  const result = await getPlayer(params.id)

  if (!result.success) {
    notFound()
  }

  const player = toUIPlayer(result.data)

  return (
    <Suspense fallback={<PlayerDetailLoading />}>
      <PlayerDetailClient player={player} />
    </Suspense>
  )
}
