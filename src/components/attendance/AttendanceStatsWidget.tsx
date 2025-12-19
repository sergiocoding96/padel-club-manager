'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, Flame, Target, Calendar } from 'lucide-react';
import type { AttendanceStats } from '@/types/database';

interface AttendanceStatsWidgetProps {
  stats: AttendanceStats;
  comparisonValue?: number;
  comparisonLabel?: string;
  showTrend?: boolean;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

export function AttendanceStatsWidget({
  stats,
  comparisonValue,
  comparisonLabel = 'vs average',
  showTrend = true,
  trend,
  trendValue,
  size = 'md',
  variant = 'default',
  className,
}: AttendanceStatsWidgetProps) {
  const rateColor = useMemo(() => {
    if (stats.attendance_rate >= 90) return 'text-green-600';
    if (stats.attendance_rate >= 75) return 'text-blue-600';
    if (stats.attendance_rate >= 60) return 'text-amber-600';
    return 'text-red-600';
  }, [stats.attendance_rate]);

  const ringColor = useMemo(() => {
    if (stats.attendance_rate >= 90) return 'stroke-green-500';
    if (stats.attendance_rate >= 75) return 'stroke-blue-500';
    if (stats.attendance_rate >= 60) return 'stroke-amber-500';
    return 'stroke-red-500';
  }, [stats.attendance_rate]);

  const comparison = comparisonValue !== undefined
    ? stats.attendance_rate - comparisonValue
    : undefined;

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <div className="relative">
          <CircularProgress
            value={stats.attendance_rate}
            size={40}
            strokeWidth={4}
            ringColor={ringColor}
          />
          <span className={cn('absolute inset-0 flex items-center justify-center text-xs font-bold', rateColor)}>
            {Math.round(stats.attendance_rate)}%
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-stone-900">
            {stats.attended}/{stats.total_sessions}
          </p>
          <p className="text-xs text-stone-500">sessions</p>
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={cn('bg-white rounded-xl border border-stone-200 p-6', className)}>
        {/* Main Rate */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-medium text-stone-500 mb-1">Attendance Rate</p>
            <div className="flex items-baseline gap-2">
              <span className={cn('text-4xl font-bold', rateColor)}>
                {Math.round(stats.attendance_rate)}%
              </span>
              {showTrend && trend && (
                <TrendIndicator trend={trend} value={trendValue} />
              )}
            </div>
            {comparison !== undefined && (
              <p className="text-sm text-stone-500 mt-1">
                <span className={cn(comparison >= 0 ? 'text-green-600' : 'text-red-600', 'font-medium')}>
                  {comparison >= 0 ? '+' : ''}{comparison.toFixed(1)}%
                </span>{' '}
                {comparisonLabel}
              </p>
            )}
          </div>
          <div className="relative">
            <CircularProgress
              value={stats.attendance_rate}
              size={80}
              strokeWidth={8}
              ringColor={ringColor}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Target className={cn('w-6 h-6', rateColor)} />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatItem
            label="Sessions Attended"
            value={stats.attended}
            total={stats.total_sessions}
            icon={Calendar}
            color="text-green-600"
          />
          <StatItem
            label="Current Streak"
            value={stats.streak}
            suffix="sessions"
            icon={Flame}
            color={stats.streak >= 5 ? 'text-orange-500' : 'text-stone-500'}
          />
          <StatItem
            label="Absences"
            value={stats.absent}
            color="text-red-600"
          />
          <StatItem
            label="Late Arrivals"
            value={stats.late}
            color="text-amber-600"
          />
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn('bg-white rounded-xl border border-stone-200 p-4', className)}>
      <div className="flex items-center gap-4">
        {/* Circular Progress */}
        <div className="relative flex-shrink-0">
          <CircularProgress
            value={stats.attendance_rate}
            size={size === 'sm' ? 56 : size === 'lg' ? 80 : 64}
            strokeWidth={size === 'sm' ? 4 : size === 'lg' ? 8 : 6}
            ringColor={ringColor}
          />
          <span
            className={cn(
              'absolute inset-0 flex items-center justify-center font-bold',
              rateColor,
              size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base'
            )}
          >
            {Math.round(stats.attendance_rate)}%
          </span>
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-stone-900">
            {stats.attended} of {stats.total_sessions} sessions
          </p>
          {stats.streak > 0 && (
            <p className="text-sm text-stone-500 flex items-center gap-1 mt-0.5">
              <Flame className={cn('w-4 h-4', stats.streak >= 5 ? 'text-orange-500' : 'text-stone-400')} />
              {stats.streak} session streak
            </p>
          )}
          {showTrend && trend && (
            <div className="mt-1">
              <TrendIndicator trend={trend} value={trendValue} size="sm" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Circular Progress Ring Component
function CircularProgress({
  value,
  size,
  strokeWidth,
  ringColor,
}: {
  value: number;
  size: number;
  strokeWidth: number;
  ringColor: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(100, Math.max(0, value));
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-stone-100"
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className={cn(ringColor, 'transition-all duration-700 ease-out')}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

// Trend Indicator Component
function TrendIndicator({
  trend,
  value,
  size = 'md',
}: {
  trend: 'up' | 'down' | 'stable';
  value?: number;
  size?: 'sm' | 'md';
}) {
  const Icon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const color = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-stone-500';

  return (
    <span className={cn('inline-flex items-center gap-0.5', color, size === 'sm' ? 'text-xs' : 'text-sm')}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      {value !== undefined && <span className="font-medium">{value > 0 ? '+' : ''}{value}%</span>}
    </span>
  );
}

// Individual Stat Item
function StatItem({
  label,
  value,
  total,
  suffix,
  icon: Icon,
  color = 'text-stone-700',
}: {
  label: string;
  value: number;
  total?: number;
  suffix?: string;
  icon?: typeof Calendar;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
      {Icon && (
        <div className={cn('p-2 rounded-lg bg-white', color)}>
          <Icon className="w-4 h-4" />
        </div>
      )}
      <div>
        <p className={cn('text-lg font-semibold', color)}>
          {value}
          {total !== undefined && <span className="text-stone-400 font-normal">/{total}</span>}
          {suffix && <span className="text-sm text-stone-500 font-normal ml-1">{suffix}</span>}
        </p>
        <p className="text-xs text-stone-500">{label}</p>
      </div>
    </div>
  );
}

// Quick stat cards for dashboards
export function AttendanceQuickStats({
  stats,
  className,
}: {
  stats: AttendanceStats;
  className?: string;
}) {
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
      <QuickStatCard
        label="Attendance Rate"
        value={`${Math.round(stats.attendance_rate)}%`}
        color={stats.attendance_rate >= 80 ? 'green' : stats.attendance_rate >= 60 ? 'amber' : 'red'}
        icon={Target}
      />
      <QuickStatCard
        label="Sessions"
        value={stats.attended.toString()}
        subValue={`of ${stats.total_sessions}`}
        color="blue"
        icon={Calendar}
      />
      <QuickStatCard
        label="Streak"
        value={stats.streak.toString()}
        subValue="sessions"
        color={stats.streak >= 5 ? 'orange' : 'stone'}
        icon={Flame}
      />
      <QuickStatCard
        label="Absences"
        value={stats.absent.toString()}
        color={stats.absent > 3 ? 'red' : 'stone'}
      />
    </div>
  );
}

function QuickStatCard({
  label,
  value,
  subValue,
  color,
  icon: Icon,
}: {
  label: string;
  value: string;
  subValue?: string;
  color: 'green' | 'amber' | 'red' | 'blue' | 'orange' | 'stone';
  icon?: typeof Target;
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
    <div className={cn('p-4 rounded-xl border', colorClasses[color])}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium opacity-80">{label}</p>
        {Icon && <Icon className="w-4 h-4 opacity-60" />}
      </div>
      <p className="text-2xl font-bold">
        {value}
        {subValue && <span className="text-sm font-normal ml-1 opacity-70">{subValue}</span>}
      </p>
    </div>
  );
}
