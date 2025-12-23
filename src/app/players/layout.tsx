import { ReactNode } from 'react'

interface PlayersLayoutProps {
  children: ReactNode
}

export default function PlayersLayout({ children }: PlayersLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-blue-50/30">
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  )
}
