'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, startOfYear, endOfYear, getWeek, getYear, addMonths, subMonths, startOfMonth, endOfMonth, isSameMonth, isToday, isBefore, isAfter } from 'date-fns';
import type { AttendanceHeatmapData } from '@/types/database';

interface AttendanceCalendarHeatmapProps {
  data: AttendanceHeatmapData[];
  onDayClick?: (date: string) => void;
  startDate?: Date;
  endDate?: Date;
  view?: 'year' | 'month' | 'week';
  showLegend?: boolean;
  showLabels?: boolean;
  className?: string;
}

const LEVEL_COLORS = {
  0: 'bg-stone-100', // No data
  1: 'bg-green-100', // Low (< 50%)
  2: 'bg-green-300', // Medium (50-74%)
  3: 'bg-green-500', // High (75-89%)
  4: 'bg-green-700', // Perfect (90-100%)
};

const LEVEL_LABELS = {
  0: 'No sessions',
  1: 'Low (< 50%)',
  2: 'Medium (50-74%)',
  3: 'High (75-89%)',
  4: 'Perfect (90-100%)',
};

export function AttendanceCalendarHeatmap({
  data,
  onDayClick,
  startDate: propStartDate,
  endDate: propEndDate,
  view = 'year',
  showLegend = true,
  showLabels = true,
  className,
}: AttendanceCalendarHeatmapProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Create a map for quick lookup
  const dataMap = useMemo(() => {
    return new Map(data.map((d) => [d.date, d]));
  }, [data]);

  // Calculate date range based on view
  const { startDate, endDate, days } = useMemo(() => {
    let start: Date;
    let end: Date;

    switch (view) {
      case 'week':
        start = startOfWeek(currentDate, { weekStartsOn: 1 });
        end = endOfWeek(currentDate, { weekStartsOn: 1 });
        break;
      case 'month':
        start = startOfMonth(currentDate);
        end = endOfMonth(currentDate);
        break;
      case 'year':
      default:
        start = propStartDate || startOfYear(currentDate);
        end = propEndDate || endOfYear(currentDate);
    }

    const allDays = eachDayOfInterval({ start, end });
    return { startDate: start, endDate: end, days: allDays };
  }, [currentDate, view, propStartDate, propEndDate]);

  // Navigation handlers
  const navigatePrev = () => {
    switch (view) {
      case 'week':
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case 'month':
        setCurrentDate(subMonths(currentDate, 1));
        break;
      case 'year':
        setCurrentDate(new Date(currentDate.getFullYear() - 1, 0, 1));
        break;
    }
  };

  const navigateNext = () => {
    switch (view) {
      case 'week':
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case 'month':
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case 'year':
        setCurrentDate(new Date(currentDate.getFullYear() + 1, 0, 1));
        break;
    }
  };

  const getViewTitle = () => {
    switch (view) {
      case 'week':
        return `Week ${getWeek(currentDate)} - ${format(startDate, 'MMM d')} to ${format(endDate, 'MMM d, yyyy')}`;
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      case 'year':
        return format(currentDate, 'yyyy');
    }
  };

  if (view === 'year') {
    return (
      <div className={cn('', className)}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={navigatePrev}
            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors"
            aria-label="Previous year"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-semibold text-stone-900">{getViewTitle()}</h3>
          <button
            onClick={navigateNext}
            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors"
            aria-label="Next year"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Yearly Heatmap (GitHub style) */}
        <YearlyHeatmap
          days={days}
          dataMap={dataMap}
          onDayClick={onDayClick}
          showLabels={showLabels}
        />

        {/* Legend */}
        {showLegend && <HeatmapLegend />}
      </div>
    );
  }

  if (view === 'month') {
    return (
      <div className={cn('', className)}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={navigatePrev}
            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-semibold text-stone-900">{getViewTitle()}</h3>
          <button
            onClick={navigateNext}
            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Monthly Calendar Grid */}
        <MonthlyCalendar
          currentDate={currentDate}
          days={days}
          dataMap={dataMap}
          onDayClick={onDayClick}
        />

        {/* Legend */}
        {showLegend && <HeatmapLegend />}
      </div>
    );
  }

  // Week view
  return (
    <div className={cn('', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={navigatePrev}
          className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors"
          aria-label="Previous week"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold text-stone-900">{getViewTitle()}</h3>
        <button
          onClick={navigateNext}
          className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors"
          aria-label="Next week"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekly View */}
      <WeeklyView
        days={days}
        dataMap={dataMap}
        onDayClick={onDayClick}
      />

      {/* Legend */}
      {showLegend && <HeatmapLegend />}
    </div>
  );
}

// Yearly heatmap (GitHub contribution style)
function YearlyHeatmap({
  days,
  dataMap,
  onDayClick,
  showLabels,
}: {
  days: Date[];
  dataMap: Map<string, AttendanceHeatmapData>;
  onDayClick?: (date: string) => void;
  showLabels?: boolean;
}) {
  // Group days by week
  const weeks = useMemo(() => {
    const result: Date[][] = [];
    let currentWeek: Date[] = [];
    let lastWeekNum = -1;

    days.forEach((day) => {
      const weekNum = getWeek(day);
      if (weekNum !== lastWeekNum && currentWeek.length > 0) {
        result.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
      lastWeekNum = weekNum;
    });

    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }

    return result;
  }, [days]);

  const dayLabels = ['Mon', '', 'Wed', '', 'Fri', '', 'Sun'];

  return (
    <div className="overflow-x-auto pb-2">
      <div className="inline-flex gap-0.5">
        {/* Day labels */}
        {showLabels && (
          <div className="flex flex-col gap-0.5 mr-1">
            {dayLabels.map((label, i) => (
              <div key={i} className="h-3 w-6 text-[10px] text-stone-500 flex items-center">
                {label}
              </div>
            ))}
          </div>
        )}

        {/* Weeks */}
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="flex flex-col gap-0.5">
            {[1, 2, 3, 4, 5, 6, 0].map((dayOfWeek) => {
              const day = week.find((d) => d.getDay() === dayOfWeek);
              if (!day) {
                return <div key={dayOfWeek} className="w-3 h-3" />;
              }

              const dateStr = format(day, 'yyyy-MM-dd');
              const dayData = dataMap.get(dateStr);
              const level = dayData?.level ?? 0;
              const isFuture = isAfter(day, new Date());

              return (
                <button
                  key={dayOfWeek}
                  onClick={() => !isFuture && onDayClick?.(dateStr)}
                  disabled={isFuture}
                  className={cn(
                    'w-3 h-3 rounded-sm transition-all duration-200',
                    LEVEL_COLORS[level as keyof typeof LEVEL_COLORS],
                    !isFuture && onDayClick && 'hover:ring-2 hover:ring-stone-400 hover:ring-offset-1 cursor-pointer',
                    isFuture && 'opacity-30 cursor-default',
                    isToday(day) && 'ring-2 ring-blue-500'
                  )}
                  title={`${format(day, 'MMM d, yyyy')}: ${dayData ? `${dayData.rate}% (${dayData.count} sessions)` : 'No data'}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// Monthly calendar view
function MonthlyCalendar({
  currentDate,
  days,
  dataMap,
  onDayClick,
}: {
  currentDate: Date;
  days: Date[];
  dataMap: Map<string, AttendanceHeatmapData>;
  onDayClick?: (date: string) => void;
}) {
  const startPadding = (days[0].getDay() + 6) % 7; // Monday = 0
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="grid grid-cols-7 gap-1">
      {/* Day headers */}
      {dayLabels.map((label) => (
        <div key={label} className="text-center text-xs font-medium text-stone-500 py-2">
          {label}
        </div>
      ))}

      {/* Padding for first week */}
      {Array.from({ length: startPadding }).map((_, i) => (
        <div key={`pad-${i}`} className="aspect-square" />
      ))}

      {/* Days */}
      {days.map((day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const dayData = dataMap.get(dateStr);
        const level = dayData?.level ?? 0;
        const isFuture = isAfter(day, new Date());
        const isCurrentMonth = isSameMonth(day, currentDate);

        return (
          <button
            key={dateStr}
            onClick={() => !isFuture && onDayClick?.(dateStr)}
            disabled={isFuture || !isCurrentMonth}
            className={cn(
              'aspect-square rounded-lg flex flex-col items-center justify-center transition-all duration-200 p-1',
              LEVEL_COLORS[level as keyof typeof LEVEL_COLORS],
              !isFuture && isCurrentMonth && onDayClick && 'hover:ring-2 hover:ring-stone-400 cursor-pointer',
              isFuture && 'opacity-40',
              !isCurrentMonth && 'opacity-30',
              isToday(day) && 'ring-2 ring-blue-500'
            )}
          >
            <span className={cn('text-sm font-medium', level >= 3 ? 'text-white' : 'text-stone-700')}>
              {format(day, 'd')}
            </span>
            {dayData && dayData.count > 0 && (
              <span className={cn('text-[10px]', level >= 3 ? 'text-white/80' : 'text-stone-500')}>
                {dayData.rate}%
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Weekly view with more details
function WeeklyView({
  days,
  dataMap,
  onDayClick,
}: {
  days: Date[];
  dataMap: Map<string, AttendanceHeatmapData>;
  onDayClick?: (date: string) => void;
}) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const dayData = dataMap.get(dateStr);
        const level = dayData?.level ?? 0;
        const isFuture = isAfter(day, new Date());

        return (
          <button
            key={dateStr}
            onClick={() => !isFuture && onDayClick?.(dateStr)}
            disabled={isFuture}
            className={cn(
              'rounded-xl p-3 transition-all duration-200 text-left',
              LEVEL_COLORS[level as keyof typeof LEVEL_COLORS],
              !isFuture && onDayClick && 'hover:ring-2 hover:ring-stone-400 hover:shadow-md cursor-pointer',
              isFuture && 'opacity-40',
              isToday(day) && 'ring-2 ring-blue-500'
            )}
          >
            <div className={cn('text-xs font-medium mb-1', level >= 3 ? 'text-white/80' : 'text-stone-500')}>
              {format(day, 'EEE')}
            </div>
            <div className={cn('text-lg font-bold', level >= 3 ? 'text-white' : 'text-stone-900')}>
              {format(day, 'd')}
            </div>
            {dayData && (
              <div className={cn('text-sm mt-2', level >= 3 ? 'text-white' : 'text-stone-600')}>
                <div className="font-semibold">{dayData.rate}%</div>
                <div className="text-xs opacity-80">{dayData.count} sessions</div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Legend component
function HeatmapLegend() {
  return (
    <div className="flex items-center justify-end gap-2 mt-4 text-xs text-stone-500">
      <span>Less</span>
      {([0, 1, 2, 3, 4] as const).map((level) => (
        <div
          key={level}
          className={cn('w-3 h-3 rounded-sm', LEVEL_COLORS[level])}
          title={LEVEL_LABELS[level]}
        />
      ))}
      <span>More</span>
    </div>
  );
}
