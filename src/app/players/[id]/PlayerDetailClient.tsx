'use client'

import { useState, useCallback, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Player } from '@/types/player'
import { deletePlayer } from '@/app/actions/players'
import {
  PlayerHeader,
  EditPlayerModal,
  OverviewTab,
  GroupsTab,
  AttendanceTab,
} from '@/components/players'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { User, Users, CalendarCheck, History } from 'lucide-react'

interface PlayerDetailClientProps {
  player: Player
}

export function PlayerDetailClient({ player }: PlayerDetailClientProps) {
  const t = useTranslations('players')
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // State
  const [currentPlayer, setCurrentPlayer] = useState<Player>(player)
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Handle edit
  const handleEdit = useCallback(() => {
    setIsEditModalOpen(true)
  }, [])

  // Handle delete
  const handleDelete = useCallback(async () => {
    if (!confirm(t('messages.deleteConfirm'))) return

    const result = await deletePlayer(currentPlayer.id)

    if (result.success) {
      startTransition(() => {
        router.push('/players')
        router.refresh()
      })
    }
  }, [t, currentPlayer.id, router])

  // Handle modal success
  const handleModalSuccess = useCallback(() => {
    startTransition(() => {
      router.refresh()
    })
  }, [router])

  const tabs = [
    { value: 'overview', label: t('tabs.overview'), icon: User },
    { value: 'groups', label: t('tabs.groups'), icon: Users },
    { value: 'attendance', label: t('tabs.attendance'), icon: CalendarCheck },
    { value: 'history', label: t('tabs.history'), icon: History },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <PlayerHeader
        player={currentPlayer}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList variant="pills" className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              variant="pills"
              className="gap-2"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab player={currentPlayer} />
        </TabsContent>

        <TabsContent value="groups">
          <GroupsTab player={currentPlayer} />
        </TabsContent>

        <TabsContent value="attendance">
          <AttendanceTab player={currentPlayer} />
        </TabsContent>

        <TabsContent value="history">
          <div className="rounded-xl border border-stone-200 bg-white p-8 text-center">
            <History className="mx-auto h-12 w-12 text-stone-300" strokeWidth={1.5} />
            <h3 className="mt-4 text-lg font-semibold text-stone-900">
              {t('tabs.history')}
            </h3>
            <p className="mt-2 text-sm text-stone-500">
              Coming soon...
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Modal */}
      <EditPlayerModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        player={currentPlayer}
        onSuccess={handleModalSuccess}
      />
    </div>
  )
}
