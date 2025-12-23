'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { format, subDays, subMonths } from 'date-fns';
import {
  Download,
  FileText,
  Users,
  UserCheck,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Printer,
} from 'lucide-react';
import { Button } from '@/components/ui';
import {
  AttendanceStatsWidget,
  AttendanceStatusBadge,
} from '@/components/attendance';
import type { AttendanceStats } from '@/types/database';

// Mock report data
const mockOverallStats: AttendanceStats = {
  total_sessions: 486,
  attended: 421,
  absent: 45,
  late: 20,
  excused: 0,
  pending: 0,
  attendance_rate: 86.6,
  streak: 0,
};

const mockTopAttendees = [
  { name: 'Ana López', rate: 98, sessions: 48, trend: 'up' },
  { name: 'Miguel Torres', rate: 96, sessions: 45, trend: 'up' },
  { name: 'Laura Martín', rate: 94, sessions: 47, trend: 'stable' },
  { name: 'David Ruiz', rate: 92, sessions: 46, trend: 'up' },
  { name: 'Sofia Hernández', rate: 90, sessions: 44, trend: 'down' },
];

const mockLowAttendees = [
  { name: 'Roberto Fernández', rate: 62, sessions: 40, absences: 15 },
  { name: 'Carmen Díaz', rate: 68, sessions: 38, absences: 12 },
  { name: 'Pablo Sánchez', rate: 72, sessions: 42, absences: 12 },
];

const mockGroupStats = [
  { name: 'Beginners A', rate: 91, players: 4, trend: 'up' },
  { name: 'Intermediate B', rate: 88, players: 4, trend: 'stable' },
  { name: 'Advanced C', rate: 85, players: 3, trend: 'down' },
  { name: 'Competition', rate: 94, players: 4, trend: 'up' },
];

type DateRangeOption = 'week' | 'month' | '3months' | 'year' | 'custom';

export default function AttendanceReportsPage() {
  const t = useTranslations('attendance');
  const tCommon = useTranslations('common');

  const [dateRange, setDateRange] = useState<DateRangeOption>('month');
  const [reportType, setReportType] = useState<'overview' | 'players' | 'groups'>('overview');

  const dateRangeLabel = useMemo(() => {
    const end = new Date();
    let start: Date;
    switch (dateRange) {
      case 'week':
        start = subDays(end, 7);
        break;
      case 'month':
        start = subMonths(end, 1);
        break;
      case '3months':
        start = subMonths(end, 3);
        break;
      case 'year':
        start = subMonths(end, 12);
        break;
      default:
        start = subMonths(end, 1);
    }
    return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`;
  }, [dateRange]);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">{t('reports')}</h2>
          <p className="text-sm text-stone-500 mt-0.5">{dateRangeLabel}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Date Range Selector */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as DateRangeOption)}
            className="px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="week">{t('filters.thisWeek')}</option>
            <option value="month">{t('filters.thisMonth')}</option>
            <option value="3months">Last 3 Months</option>
            <option value="year">This Year</option>
          </select>

          {/* Export Buttons */}
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1.5" />
            {t('actions.exportCSV')}
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-1.5" />
            {t('actions.exportPDF')}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => window.print()}>
            <Printer className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="flex gap-1 p-1 bg-stone-100 rounded-lg w-fit">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'players', label: 'Players', icon: Users },
          { id: 'groups', label: 'Groups', icon: UserCheck },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id as typeof reportType)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all',
              reportType === tab.id
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Report */}
      {reportType === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              label="Total Sessions"
              value={mockOverallStats.total_sessions.toString()}
              icon={Calendar}
              color="blue"
            />
            <MetricCard
              label="Attendance Rate"
              value={`${mockOverallStats.attendance_rate}%`}
              icon={TrendingUp}
              color="green"
              trend="+2.3%"
            />
            <MetricCard
              label="Total Absences"
              value={mockOverallStats.absent.toString()}
              icon={Users}
              color="red"
            />
            <MetricCard
              label="Late Arrivals"
              value={mockOverallStats.late.toString()}
              icon={Users}
              color="amber"
            />
          </div>

          {/* Charts Section */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Attendance Breakdown */}
            <div className="bg-white rounded-xl border border-stone-200 p-6">
              <h3 className="font-semibold text-stone-900 mb-4">Attendance Breakdown</h3>
              <div className="space-y-4">
                <BreakdownBar label="Present" value={421} total={486} color="green" />
                <BreakdownBar label="Late" value={20} total={486} color="amber" />
                <BreakdownBar label="Absent" value={45} total={486} color="red" />
              </div>
            </div>

            {/* Trend Chart Placeholder */}
            <div className="bg-white rounded-xl border border-stone-200 p-6">
              <h3 className="font-semibold text-stone-900 mb-4">Weekly Trend</h3>
              <div className="h-48 flex items-end justify-between gap-2">
                {[85, 88, 82, 90, 87, 92, 89].map((value, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={cn(
                        'w-full rounded-t transition-all duration-300',
                        value >= 90 ? 'bg-green-500' : value >= 80 ? 'bg-blue-500' : 'bg-amber-500'
                      )}
                      style={{ height: `${value}%` }}
                    />
                    <span className="text-xs text-stone-500">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][idx]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top & Low Performers */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-stone-200 p-6">
              <h3 className="font-semibold text-stone-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Top Attendees
              </h3>
              <div className="space-y-3">
                {mockTopAttendees.map((player, idx) => (
                  <div key={player.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-600 text-xs font-medium flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-stone-900">{player.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-semibold">{player.rate}%</span>
                      {player.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                      {player.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-6">
              <h3 className="font-semibold text-stone-900 mb-4 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-500" />
                Needs Attention
              </h3>
              <div className="space-y-3">
                {mockLowAttendees.map((player) => (
                  <div key={player.name} className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-stone-900">{player.name}</span>
                      <p className="text-sm text-stone-500">{player.absences} absences</p>
                    </div>
                    <span className="text-red-600 font-semibold">{player.rate}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Players Report */}
      {reportType === 'players' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">
                    Player
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">
                    Sessions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">
                    Present
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">
                    Late
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">
                    Absent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">
                    Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {[...mockTopAttendees, ...mockLowAttendees.map(p => ({ ...p, trend: 'down' as const }))].map((player) => (
                  <tr key={player.name} className="hover:bg-stone-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-stone-900">
                      {player.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-stone-600">
                      {player.sessions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-600">
                      {Math.round(player.sessions * (player.rate / 100))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-amber-600">
                      {Math.round(player.sessions * 0.04)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-red-600">
                      {Math.round(player.sessions * ((100 - player.rate) / 100))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full',
                              player.rate >= 90 ? 'bg-green-500' : player.rate >= 80 ? 'bg-blue-500' : player.rate >= 70 ? 'bg-amber-500' : 'bg-red-500'
                            )}
                            style={{ width: `${player.rate}%` }}
                          />
                        </div>
                        <span className="font-medium">{player.rate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {player.trend === 'up' && <span className="text-green-600">↑ Improving</span>}
                      {player.trend === 'down' && <span className="text-red-600">↓ Declining</span>}
                      {player.trend === 'stable' && <span className="text-stone-500">→ Stable</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Groups Report */}
      {reportType === 'groups' && (
        <div className="grid gap-4">
          {mockGroupStats.map((group) => (
            <div
              key={group.name}
              className="bg-white rounded-xl border border-stone-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-stone-900">{group.name}</h3>
                  <p className="text-sm text-stone-500">{group.players} players</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-stone-900">{group.rate}%</p>
                    <p className="text-sm text-stone-500">attendance</p>
                  </div>
                  <div className="w-24 h-24">
                    <AttendanceStatsWidget
                      stats={{
                        total_sessions: 48,
                        attended: Math.round(48 * (group.rate / 100)),
                        absent: Math.round(48 * ((100 - group.rate) / 100)),
                        late: 2,
                        excused: 0,
                        pending: 0,
                        attendance_rate: group.rate,
                        streak: 5,
                      }}
                      variant="compact"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Metric Card Component
function MetricCard({
  label,
  value,
  icon: Icon,
  color,
  trend,
}: {
  label: string;
  value: string;
  icon: typeof Calendar;
  color: 'blue' | 'green' | 'red' | 'amber';
  trend?: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
  };

  return (
    <div className={cn('rounded-xl border p-4', colorClasses[color])}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-5 h-5 opacity-70" />
        {trend && (
          <span className="text-xs font-medium bg-white/50 px-2 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm opacity-80">{label}</p>
    </div>
  );
}

// Breakdown Bar Component
function BreakdownBar({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: 'green' | 'amber' | 'red';
}) {
  const percentage = (value / total) * 100;
  const colorClasses = {
    green: 'bg-green-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
  };

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-stone-600">{label}</span>
        <span className="font-medium text-stone-900">
          {value} ({percentage.toFixed(1)}%)
        </span>
      </div>
      <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', colorClasses[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
