'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Users, MapPin, Calendar, ClipboardList, ClipboardCheck, TrendingUp, Clock, CheckCircle2 } from 'lucide-react'

export default function Home() {
  const t = useTranslations('nav')
  const tAttendance = useTranslations('attendance')

  const features = [
    { icon: Users, label: t('players'), href: '/players', color: 'bg-blue-500' },
    { icon: MapPin, label: t('courts'), href: '/courts', color: 'bg-green-500' },
    { icon: ClipboardList, label: t('groups'), href: '/groups', color: 'bg-purple-500' },
    { icon: Calendar, label: t('bookings'), href: '/bookings', color: 'bg-orange-500' },
    { icon: ClipboardCheck, label: t('attendance'), href: '/attendance', color: 'bg-teal-500', highlight: true },
  ]

  // Mock data for attendance widget
  const attendanceStats = {
    todaySessions: 3,
    pendingCount: 5,
    attendanceRate: 91,
    streak: 8,
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-display font-bold text-stone-800 mb-3">
            Padel Club Manager
          </h1>
          <p className="text-lg text-stone-600">
            Sistema de gestión para clubes de pádel
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
          {features.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className={`bg-white rounded-xl p-5 shadow-sm border border-stone-200 hover:shadow-md hover:scale-[1.02] transition-all text-center ${
                feature.highlight ? 'ring-2 ring-teal-500 ring-offset-2' : ''
              }`}
            >
              <div className={`${feature.color} w-11 h-11 rounded-lg flex items-center justify-center mx-auto mb-2.5`}>
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-stone-800 font-medium text-sm">{feature.label}</span>
              {feature.highlight && (
                <span className="block text-xs text-teal-600 mt-1 font-medium">NEW</span>
              )}
            </Link>
          ))}
        </div>

        {/* Attendance Quick Widget */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 shadow-lg mb-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ClipboardCheck className="w-6 h-6" />
                <h2 className="text-xl font-semibold">{tAttendance('title')}</h2>
              </div>
              <p className="text-teal-100 text-sm">
                Track and manage player attendance for all sessions
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <QuickStat
                icon={Calendar}
                value={attendanceStats.todaySessions.toString()}
                label="Today's Sessions"
              />
              <QuickStat
                icon={Clock}
                value={attendanceStats.pendingCount.toString()}
                label="Pending"
                highlight={attendanceStats.pendingCount > 0}
              />
              <QuickStat
                icon={TrendingUp}
                value={`${attendanceStats.attendanceRate}%`}
                label="Rate"
              />
              <QuickStat
                icon={CheckCircle2}
                value={attendanceStats.streak.toString()}
                label="Streak"
              />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-teal-400/30 flex flex-wrap gap-3">
            <Link
              href="/attendance"
              className="px-4 py-2 bg-white text-teal-600 rounded-lg font-medium text-sm hover:bg-teal-50 transition-colors"
            >
              {tAttendance('dashboard')}
            </Link>
            <Link
              href="/attendance/calendar"
              className="px-4 py-2 bg-teal-400/20 text-white rounded-lg font-medium text-sm hover:bg-teal-400/30 transition-colors"
            >
              {tAttendance('calendar')}
            </Link>
            <Link
              href="/attendance/checkin"
              className="px-4 py-2 bg-teal-400/20 text-white rounded-lg font-medium text-sm hover:bg-teal-400/30 transition-colors"
            >
              {tAttendance('selfCheckIn')}
            </Link>
          </div>
        </div>

        {/* Upcoming Features */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
          <h2 className="text-lg font-semibold text-stone-800 mb-4">Próximas funcionalidades</h2>
          <div className="grid md:grid-cols-2 gap-3">
            <FeatureItem done label="Perfiles de jugador con sistema de niveles (1-7)" />
            <FeatureItem done label="Gestión de pistas y calendario de reservas" />
            <FeatureItem done label="Programación de clases grupales" />
            <FeatureItem done label="Control de asistencia" />
            <FeatureItem label="Gestión de pagos" />
            <FeatureItem label="Ligas y rankings" />
            <FeatureItem label="Auto check-in de jugadores" />
            <FeatureItem label="Notificaciones automáticas" />
          </div>
        </div>
      </div>
    </main>
  )
}

function QuickStat({
  icon: Icon,
  value,
  label,
  highlight = false
}: {
  icon: typeof Calendar
  value: string
  label: string
  highlight?: boolean
}) {
  return (
    <div className={`text-center px-3 py-1 rounded-lg ${highlight ? 'bg-amber-500/20' : 'bg-white/10'}`}>
      <div className="flex items-center justify-center gap-1.5 mb-0.5">
        <Icon className="w-4 h-4" />
        <span className="text-lg font-bold">{value}</span>
      </div>
      <span className="text-xs text-teal-100">{label}</span>
    </div>
  )
}

function FeatureItem({ label, done = false }: { label: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {done ? (
        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
      ) : (
        <div className="w-4 h-4 rounded-full border-2 border-stone-300 flex-shrink-0" />
      )}
      <span className={done ? 'text-stone-600' : 'text-stone-500'}>{label}</span>
    </div>
  )
}
