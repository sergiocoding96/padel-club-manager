'use client'

import { useTranslations } from 'next-intl'
import { Users, MapPin, Calendar, ClipboardList } from 'lucide-react'

export default function Home() {
  const t = useTranslations('nav')

  const features = [
    { icon: Users, label: t('players'), href: '/players', color: 'bg-blue-500' },
    { icon: MapPin, label: t('courts'), href: '/courts', color: 'bg-green-500' },
    { icon: ClipboardList, label: t('groups'), href: '/groups', color: 'bg-purple-500' },
    { icon: Calendar, label: t('bookings'), href: '/bookings', color: 'bg-orange-500' },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-stone-800 mb-4">
            Padel Club Manager
          </h1>
          <p className="text-lg text-stone-600">
            Sistema de gestion para clubes de padel
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {features.map((feature) => (
            <a
              key={feature.href}
              href={feature.href}
              className="bg-white rounded-xl p-6 shadow-sm border border-stone-200 hover:shadow-md transition-shadow text-center"
            >
              <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-stone-800 font-medium">{feature.label}</span>
            </a>
          ))}
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm border border-stone-200">
          <h2 className="text-xl font-semibold text-stone-800 mb-4">Proximas funcionalidades</h2>
          <ul className="space-y-2 text-stone-600">
            <li>• Perfiles de jugador con sistema de niveles (1-7)</li>
            <li>• Gestion de pistas y calendario de reservas</li>
            <li>• Programacion de clases grupales</li>
            <li>• Control de asistencia</li>
            <li>• Gestion de pagos</li>
            <li>• Ligas y rankings</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
