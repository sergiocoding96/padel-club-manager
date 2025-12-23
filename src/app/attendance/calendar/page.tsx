'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { format, subMonths, addMonths } from 'date-fns';
import {
  Filter,
  Download,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui';
import {
  AttendanceCalendarHeatmap,
  AttendanceStatsWidget,
} from '@/components/attendance';
import type { AttendanceHeatmapData, AttendanceStats } from '@/types/database';

// Mock heatmap data for the past year
const generateMockHeatmapData = (): AttendanceHeatmapData[] => {
  const data: AttendanceHeatmapData[] = [];
  const today = new Date();
  const startDate = subMonths(today, 12);

  let currentDate = startDate;
  while (currentDate <= today) {
    // Only add data for weekdays (Mon-Fri) and some Saturdays
    const dayOfWeek = currentDate.getDay();
    const hasSession = dayOfWeek >= 1 && dayOfWeek <= 5 || (dayOfWeek === 6 && Math.random() > 0.5);

    if (hasSession) {
      const rate = Math.floor(Math.random() * 40) + 60; // 60-100%
      const count = Math.floor(Math.random() * 5) + 1; // 1-5 sessions

      let level: 0 | 1 | 2 | 3 | 4;
      if (rate >= 90) level = 4;
      else if (rate >= 75) level = 3;
      else if (rate >= 50) level = 2;
      else level = 1;

      data.push({
        date: format(currentDate, 'yyyy-MM-dd'),
        count,
        rate,
        level,
      });
    }

    currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
  }

  return data;
};

const mockHeatmapData = generateMockHeatmapData();

const mockStats: AttendanceStats = {
  total_sessions: 248,
  attended: 221,
  absent: 18,
  late: 9,
  excused: 0,
  pending: 0,
  attendance_rate: 89.1,
  streak: 12,
};

type ViewMode = 'year' | 'month' | 'week';

export default function AttendanceCalendarPage() {
  const router = useRouter();
  const t = useTranslations('attendance');
  const tCommon = useTranslations('common');

  const [viewMode, setViewMode] = useState<ViewMode>('year');
  const [showFilters, setShowFilters] = useState(false);

  const handleDayClick = (date: string) => {
    // In a real app, this would navigate to a day view or show a modal
    console.log('Day clicked:', date);
  };

  // Calculate period stats
  const periodLabel = useMemo(() => {
    switch (viewMode) {
      case 'year':
        return 'This Year';
      case 'month':
        return 'This Month';
      case 'week':
        return 'This Week';
    }
  }, [viewMode]);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">{t('calendar')}</h2>
          <p className="text-sm text-stone-500 mt-0.5">
            Visualize attendance patterns over time
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="inline-flex rounded-lg border border-stone-200 bg-white p-1">
            {(['year', 'month', 'week'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200',
                  viewMode === mode
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                )}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          {/* Filter Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(showFilters && 'bg-stone-100')}
          >
            <Filter className="w-4 h-4 mr-1.5" />
            Filter
            <ChevronDown className={cn('w-4 h-4 ml-1 transition-transform', showFilters && 'rotate-180')} />
          </Button>

          {/* Export Button */}
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1.5" />
            {tCommon('export')}
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                {t('filters.byGroup')}
              </label>
              <select className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">{t('filters.all')}</option>
                <option value="group-1">Beginners A</option>
                <option value="group-2">Intermediate B</option>
                <option value="group-3">Advanced C</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                {t('filters.byCoach')}
              </label>
              <select className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">{t('filters.all')}</option>
                <option value="coach-1">Carlos García</option>
                <option value="coach-2">María Jiménez</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                {t('filters.byPlayer')}
              </label>
              <select className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">{t('filters.all')}</option>
                <option value="player-1">Ana López</option>
                <option value="player-2">Miguel Torres</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4 pt-4 border-t border-stone-100">
            <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
              {tCommon('reset')}
            </Button>
            <Button size="sm" className="ml-2">
              {tCommon('apply')}
            </Button>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Heatmap - Main Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <AttendanceCalendarHeatmap
              data={mockHeatmapData}
              view={viewMode}
              onDayClick={handleDayClick}
              showLegend={true}
              showLabels={true}
            />
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-4">
          {/* Period Stats */}
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <h3 className="text-sm font-medium text-stone-500 mb-3">{periodLabel}</h3>
            <AttendanceStatsWidget
              stats={mockStats}
              variant="compact"
              showTrend={true}
              trend="up"
              trendValue={3.2}
            />
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-4">
            <h3 className="text-sm font-medium text-stone-500">Breakdown</h3>

            <div className="space-y-3">
              <StatBar label="Present" value={mockStats.attended} total={mockStats.total_sessions} color="green" />
              <StatBar label="Late" value={mockStats.late} total={mockStats.total_sessions} color="amber" />
              <StatBar label="Absent" value={mockStats.absent} total={mockStats.total_sessions} color="red" />
              <StatBar label="Excused" value={mockStats.excused} total={mockStats.total_sessions} color="blue" />
            </div>
          </div>

          {/* Best/Worst Days */}
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <h3 className="text-sm font-medium text-stone-500 mb-3">Patterns</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-600">Best day</span>
                <span className="font-medium text-green-600">Wednesday (94%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Most absences</span>
                <span className="font-medium text-red-600">Monday (12%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Peak time</span>
                <span className="font-medium text-stone-900">09:00 - 11:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Summary Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100">
          <h3 className="font-semibold text-stone-900">Monthly Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Sessions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Present
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Absent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {[
                { month: 'December 2024', sessions: 22, present: 20, absent: 2, rate: 91 },
                { month: 'November 2024', sessions: 24, present: 21, absent: 3, rate: 88 },
                { month: 'October 2024', sessions: 26, present: 24, absent: 2, rate: 92 },
                { month: 'September 2024', sessions: 20, present: 17, absent: 3, rate: 85 },
              ].map((row, idx) => (
                <tr key={row.month} className="hover:bg-stone-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">
                    {row.month}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                    {row.sessions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                    {row.present}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    {row.absent}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full',
                            row.rate >= 90 ? 'bg-green-500' : row.rate >= 80 ? 'bg-blue-500' : 'bg-amber-500'
                          )}
                          style={{ width: `${row.rate}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-stone-900">{row.rate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {idx === 0 ? (
                      <span className="text-green-600">↑ +3%</span>
                    ) : idx === 1 ? (
                      <span className="text-red-600">↓ -4%</span>
                    ) : idx === 2 ? (
                      <span className="text-green-600">↑ +7%</span>
                    ) : (
                      <span className="text-stone-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Stat bar component
function StatBar({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: 'green' | 'amber' | 'red' | 'blue';
}) {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  const colorClasses = {
    green: 'bg-green-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
  };

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-stone-600">{label}</span>
        <span className="font-medium text-stone-900">{value}</span>
      </div>
      <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', colorClasses[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
