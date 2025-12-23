'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { cn, formatDate, formatTime } from '@/lib/utils';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  CalendarDays,
  Target,
  Flame,
} from 'lucide-react';
import { Button } from '@/components/ui';
import {
  AttendanceStatusBadge,
  AttendanceQuickStats,
} from '@/components/attendance';
import type { AttendanceStats, BookingWithRelations, AttendanceWithPlayer } from '@/types/database';

// Mock data for demonstration - will be replaced with actual data fetching
const mockTodaysSessions: (BookingWithRelations & { attendances: AttendanceWithPlayer[] })[] = [
  {
    id: '1',
    court_id: 'court-1',
    date: new Date().toISOString().split('T')[0],
    start_time: '09:00',
    end_time: '10:30',
    booking_type: 'group_class',
    group_id: 'group-1',
    player_id: null,
    coach_id: 'coach-1',
    is_recurring: true,
    recurring_pattern: null,
    notes: null,
    status: 'confirmed',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    court: { id: 'court-1', name: 'Court 1', surface_type: 'indoor', location: 'Main Building', status: 'available', created_at: '', updated_at: '' },
    group: { id: 'group-1', name: 'Beginners A', level_min: 1, level_max: 2, coach_id: 'coach-1', max_players: 4, schedule_template: null, status: 'active', created_at: '', updated_at: '' },
    player: null,
    coach: { id: 'coach-1', name: 'Carlos García', email: 'carlos@example.com', phone: null, role: 'coach', color_code: '#3B82F6', status: 'active', created_at: '', updated_at: '' },
    attendances: [
      { id: 'a1', booking_id: '1', player_id: 'p1', status: 'present', marked_by: 'coach-1', marked_at: new Date().toISOString(), notes: null, check_in_method: 'coach', check_in_time: null, created_at: '', updated_at: '', player: { id: 'p1', name: 'Ana López', email: 'ana@example.com', phone: null, level_numeric: 2, level_category: 'Beginner+', status: 'active', notes: null, objectives: null, created_at: '', updated_at: '' } },
      { id: 'a2', booking_id: '1', player_id: 'p2', status: 'present', marked_by: 'coach-1', marked_at: new Date().toISOString(), notes: null, check_in_method: 'coach', check_in_time: null, created_at: '', updated_at: '', player: { id: 'p2', name: 'Miguel Torres', email: 'miguel@example.com', phone: null, level_numeric: 1.5, level_category: 'Beginner', status: 'active', notes: null, objectives: null, created_at: '', updated_at: '' } },
      { id: 'a3', booking_id: '1', player_id: 'p3', status: 'pending', marked_by: null, marked_at: null, notes: null, check_in_method: null, check_in_time: null, created_at: '', updated_at: '', player: { id: 'p3', name: 'Laura Martín', email: 'laura@example.com', phone: null, level_numeric: 2, level_category: 'Beginner+', status: 'active', notes: null, objectives: null, created_at: '', updated_at: '' } },
      { id: 'a4', booking_id: '1', player_id: 'p4', status: 'pending', marked_by: null, marked_at: null, notes: null, check_in_method: null, check_in_time: null, created_at: '', updated_at: '', player: { id: 'p4', name: 'David Ruiz', email: 'david@example.com', phone: null, level_numeric: 1, level_category: 'Beginner', status: 'active', notes: null, objectives: null, created_at: '', updated_at: '' } },
    ],
  },
  {
    id: '2',
    court_id: 'court-2',
    date: new Date().toISOString().split('T')[0],
    start_time: '11:00',
    end_time: '12:30',
    booking_type: 'group_class',
    group_id: 'group-2',
    player_id: null,
    coach_id: 'coach-1',
    is_recurring: true,
    recurring_pattern: null,
    notes: null,
    status: 'confirmed',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    court: { id: 'court-2', name: 'Court 2', surface_type: 'outdoor', location: 'Outdoor Area', status: 'available', created_at: '', updated_at: '' },
    group: { id: 'group-2', name: 'Intermediate B', level_min: 3, level_max: 4, coach_id: 'coach-1', max_players: 4, schedule_template: null, status: 'active', created_at: '', updated_at: '' },
    player: null,
    coach: { id: 'coach-1', name: 'Carlos García', email: 'carlos@example.com', phone: null, role: 'coach', color_code: '#3B82F6', status: 'active', created_at: '', updated_at: '' },
    attendances: [
      { id: 'a5', booking_id: '2', player_id: 'p5', status: 'pending', marked_by: null, marked_at: null, notes: null, check_in_method: null, check_in_time: null, created_at: '', updated_at: '', player: { id: 'p5', name: 'Sofia Hernández', email: 'sofia@example.com', phone: null, level_numeric: 3.5, level_category: 'Intermediate', status: 'active', notes: null, objectives: null, created_at: '', updated_at: '' } },
      { id: 'a6', booking_id: '2', player_id: 'p6', status: 'pending', marked_by: null, marked_at: null, notes: null, check_in_method: null, check_in_time: null, created_at: '', updated_at: '', player: { id: 'p6', name: 'Pablo Sánchez', email: 'pablo@example.com', phone: null, level_numeric: 4, level_category: 'Intermediate', status: 'active', notes: null, objectives: null, created_at: '', updated_at: '' } },
      { id: 'a7', booking_id: '2', player_id: 'p7', status: 'pending', marked_by: null, marked_at: null, notes: null, check_in_method: null, check_in_time: null, created_at: '', updated_at: '', player: { id: 'p7', name: 'Carmen Díaz', email: 'carmen@example.com', phone: null, level_numeric: 3, level_category: 'Low Intermediate', status: 'active', notes: null, objectives: null, created_at: '', updated_at: '' } },
    ],
  },
  {
    id: '3',
    court_id: 'court-1',
    date: new Date().toISOString().split('T')[0],
    start_time: '17:00',
    end_time: '18:00',
    booking_type: 'private_lesson',
    group_id: null,
    player_id: 'p8',
    coach_id: 'coach-2',
    is_recurring: false,
    recurring_pattern: null,
    notes: 'Focus on backhand',
    status: 'confirmed',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    court: { id: 'court-1', name: 'Court 1', surface_type: 'indoor', location: 'Main Building', status: 'available', created_at: '', updated_at: '' },
    group: null,
    player: { id: 'p8', name: 'Roberto Fernández', email: 'roberto@example.com', phone: null, level_numeric: 5, level_category: 'High Intermediate', status: 'active', notes: null, objectives: null, created_at: '', updated_at: '' },
    coach: { id: 'coach-2', name: 'María Jiménez', email: 'maria@example.com', phone: null, role: 'coach', color_code: '#10B981', status: 'active', created_at: '', updated_at: '' },
    attendances: [
      { id: 'a8', booking_id: '3', player_id: 'p8', status: 'pending', marked_by: null, marked_at: null, notes: null, check_in_method: null, check_in_time: null, created_at: '', updated_at: '', player: { id: 'p8', name: 'Roberto Fernández', email: 'roberto@example.com', phone: null, level_numeric: 5, level_category: 'High Intermediate', status: 'active', notes: null, objectives: null, created_at: '', updated_at: '' } },
    ],
  },
];

const mockStats: AttendanceStats = {
  total_sessions: 48,
  attended: 42,
  absent: 4,
  late: 2,
  excused: 0,
  pending: 0,
  attendance_rate: 91.7,
  streak: 8,
};

export default function AttendanceDashboard() {
  const t = useTranslations('attendance');
  const tCommon = useTranslations('common');

  const todaysSessions = mockTodaysSessions;
  const stats = mockStats;

  // Calculate pending sessions
  const pendingSessions = useMemo(() => {
    return todaysSessions.filter((session) =>
      session.attendances.some((a) => a.status === 'pending')
    );
  }, [todaysSessions]);

  const totalPending = useMemo(() => {
    return todaysSessions.reduce((acc, session) => {
      return acc + session.attendances.filter((a) => a.status === 'pending').length;
    }, 0);
  }, [todaysSessions]);

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <section>
        <h2 className="text-lg font-semibold text-stone-900 mb-4">
          Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickStatCard
            label={t('stats.attendanceRate')}
            value={`${Math.round(stats.attendance_rate)}%`}
            icon={Target}
            color={stats.attendance_rate >= 80 ? 'green' : stats.attendance_rate >= 60 ? 'amber' : 'red'}
          />
          <QuickStatCard
            label={t('session.todaysSessions')}
            value={todaysSessions.length.toString()}
            subValue="sessions"
            icon={CalendarDays}
            color="blue"
          />
          <QuickStatCard
            label={t('stats.currentStreak')}
            value={stats.streak.toString()}
            subValue="sessions"
            icon={Flame}
            color={stats.streak >= 5 ? 'orange' : 'stone'}
          />
          <QuickStatCard
            label={t('session.pendingAttendance')}
            value={totalPending.toString()}
            subValue="players"
            icon={AlertCircle}
            color={totalPending > 0 ? 'amber' : 'green'}
            highlight={totalPending > 0}
          />
        </div>
      </section>

      {/* Pending Attention Alert */}
      {pendingSessions.length > 0 && (
        <section className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900">
                {t('session.requiresAttention')}
              </h3>
              <p className="text-sm text-amber-700 mt-1">
                {pendingSessions.length} session{pendingSessions.length !== 1 ? 's' : ''} with {totalPending} pending attendance record{totalPending !== 1 ? 's' : ''}.
              </p>
            </div>
            <Link href={`/attendance/booking/${pendingSessions[0].id}`}>
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                {t('markAttendance')}
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Today's Sessions */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-stone-900">
            {t('session.todaysSessions')}
          </h2>
          <Link
            href="/attendance/calendar"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            {tCommon('viewAll')}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {todaysSessions.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title={t('empty.noSessionsToday')}
            description={t('empty.startTracking')}
          />
        ) : (
          <div className="grid gap-4">
            {todaysSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// Session Card Component
function SessionCard({
  session,
}: {
  session: BookingWithRelations & { attendances: AttendanceWithPlayer[] };
}) {
  const t = useTranslations('attendance');

  const stats = useMemo(() => {
    const total = session.attendances.length;
    const present = session.attendances.filter((a) => a.status === 'present').length;
    const late = session.attendances.filter((a) => a.status === 'late').length;
    const pending = session.attendances.filter((a) => a.status === 'pending').length;
    const marked = total - pending;

    return { total, present, late, pending, marked, progress: total > 0 ? (marked / total) * 100 : 0 };
  }, [session.attendances]);

  const isComplete = stats.pending === 0;
  const timeDisplay = `${formatTime(session.start_time)} - ${formatTime(session.end_time)}`;

  return (
    <Link
      href={`/attendance/booking/${session.id}`}
      className={cn(
        'block bg-white rounded-xl border border-stone-200 p-4 transition-all duration-200',
        'hover:border-blue-300 hover:shadow-md hover:scale-[1.01]',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        isComplete && 'border-l-4 border-l-green-500',
        !isComplete && stats.pending > 0 && 'border-l-4 border-l-amber-500'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Session Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-stone-900 truncate">
              {session.group?.name || session.player?.name || 'Session'}
            </h3>
            {session.booking_type === 'group_class' && (
              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                Group
              </span>
            )}
            {session.booking_type === 'private_lesson' && (
              <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                Private
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-stone-500">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {timeDisplay}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {session.court?.name}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {stats.total} players
            </span>
          </div>

          {session.coach && (
            <p className="mt-1.5 text-sm text-stone-600">
              Coach: <span className="font-medium">{session.coach.name}</span>
            </p>
          )}
        </div>

        {/* Status */}
        <div className="flex flex-col items-end gap-2">
          {isComplete ? (
            <div className="flex items-center gap-1.5 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">Complete</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-amber-600">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{stats.pending} pending</span>
            </div>
          )}

          {/* Progress bar */}
          <div className="w-24">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span>{stats.marked}/{stats.total}</span>
            </div>
            <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-500 rounded-full',
                  stats.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                )}
                style={{ width: `${stats.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Status Pills */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-stone-100">
        {session.attendances.slice(0, 4).map((attendance) => (
          <div
            key={attendance.id}
            className="flex items-center gap-1.5"
            title={attendance.player.name}
          >
            <AttendanceStatusBadge
              status={attendance.status}
              size="sm"
              showLabel={false}
            />
            <span className="text-xs text-stone-600 truncate max-w-[80px]">
              {attendance.player.name.split(' ')[0]}
            </span>
          </div>
        ))}
        {session.attendances.length > 4 && (
          <span className="text-xs text-stone-400">
            +{session.attendances.length - 4} more
          </span>
        )}
      </div>
    </Link>
  );
}

// Quick Stat Card Component
function QuickStatCard({
  label,
  value,
  subValue,
  icon: Icon,
  color,
  highlight = false,
}: {
  label: string;
  value: string;
  subValue?: string;
  icon: typeof Target;
  color: 'green' | 'amber' | 'red' | 'blue' | 'orange' | 'stone';
  highlight?: boolean;
}) {
  const colorClasses = {
    green: 'bg-green-50 text-green-700 border-green-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    stone: 'bg-stone-50 text-stone-700 border-stone-200',
  };

  return (
    <div
      className={cn(
        'p-4 rounded-xl border transition-all duration-200',
        colorClasses[color],
        highlight && 'ring-2 ring-offset-2 ring-amber-300'
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium opacity-80">{label}</p>
        <Icon className="w-4 h-4 opacity-60" />
      </div>
      <p className="text-2xl font-bold">
        {value}
        {subValue && (
          <span className="text-sm font-normal ml-1 opacity-70">{subValue}</span>
        )}
      </p>
    </div>
  );
}

// Empty State Component
function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Calendar;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-8 text-center">
      <div className="mx-auto w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-stone-400" />
      </div>
      <h3 className="text-lg font-medium text-stone-900 mb-1">{title}</h3>
      <p className="text-sm text-stone-500">{description}</p>
    </div>
  );
}
