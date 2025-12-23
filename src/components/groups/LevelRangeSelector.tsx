'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Zap, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LEVEL_RANGE } from '@/types/groups'

interface LevelRangeSelectorProps {
  minValue: number
  maxValue: number
  onMinChange: (value: number) => void
  onMaxChange: (value: number) => void
  min?: number
  max?: number
  showLabels?: boolean
  compact?: boolean
  disabled?: boolean
  className?: string
}

// Colors for each level - gradient from green to red
const LEVEL_COLORS = {
  1: '#22c55e', // green
  2: '#84cc16', // lime
  3: '#eab308', // yellow
  4: '#f97316', // orange
  5: '#ef4444', // red
  6: '#dc2626', // dark red
  7: '#991b1b', // very dark red
} as const

export function LevelRangeSelector({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  min = LEVEL_RANGE.min,
  max = LEVEL_RANGE.max,
  showLabels = true,
  compact = false,
  disabled = false,
  className,
}: LevelRangeSelectorProps) {
  const t = useTranslations('levels')
  const tGroups = useTranslations('groups')

  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState<'min' | 'max' | null>(null)

  // Calculate percentage position for a value
  const getPercentage = (value: number) => {
    return ((value - min) / (max - min)) * 100
  }

  // Calculate value from mouse/touch position
  const getValueFromPosition = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return min
      const rect = trackRef.current.getBoundingClientRect()
      const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
      const rawValue = min + (percentage / 100) * (max - min)
      return Math.round(rawValue)
    },
    [min, max]
  )

  // Handle mouse/touch move
  const handleMove = useCallback(
    (clientX: number) => {
      if (!dragging) return
      const newValue = getValueFromPosition(clientX)

      if (dragging === 'min') {
        // Ensure min doesn't exceed max
        const clampedValue = Math.min(newValue, maxValue)
        if (clampedValue !== minValue) {
          onMinChange(clampedValue)
        }
      } else {
        // Ensure max doesn't go below min
        const clampedValue = Math.max(newValue, minValue)
        if (clampedValue !== maxValue) {
          onMaxChange(clampedValue)
        }
      }
    },
    [dragging, getValueFromPosition, minValue, maxValue, onMinChange, onMaxChange]
  )

  // Mouse event handlers
  useEffect(() => {
    if (!dragging) return

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX)
    }

    const handleMouseUp = () => {
      setDragging(null)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragging, handleMove])

  // Touch event handlers
  useEffect(() => {
    if (!dragging) return

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      handleMove(e.touches[0].clientX)
    }

    const handleTouchEnd = () => {
      setDragging(null)
    }

    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [dragging, handleMove])

  // Keyboard handlers for accessibility
  const handleKeyDown = (type: 'min' | 'max', e: React.KeyboardEvent) => {
    const step = 1
    const currentValue = type === 'min' ? minValue : maxValue
    let newValue = currentValue

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = Math.min(currentValue + step, type === 'min' ? maxValue : max)
        break
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = Math.max(currentValue - step, type === 'max' ? minValue : min)
        break
      case 'Home':
        newValue = type === 'min' ? min : minValue
        break
      case 'End':
        newValue = type === 'max' ? max : maxValue
        break
      default:
        return
    }

    e.preventDefault()
    if (type === 'min') {
      onMinChange(newValue)
    } else {
      onMaxChange(newValue)
    }
  }

  const minPercent = getPercentage(minValue)
  const maxPercent = getPercentage(maxValue)

  // Generate level markers
  const levels = Array.from({ length: max - min + 1 }, (_, i) => min + i)

  return (
    <div className={cn('space-y-3', className)}>
      {/* Label */}
      {showLabels && !compact && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-stone-700">
            {tGroups('form.levelRange')}
          </label>
          <span className="text-sm text-stone-500">
            {minValue === maxValue
              ? t(String(minValue))
              : `${t(String(minValue))} - ${t(String(maxValue))}`}
          </span>
        </div>
      )}

      {/* Slider Container */}
      <div className={cn('relative', compact ? 'py-3' : 'py-4')}>
        {/* Track Background */}
        <div
          ref={trackRef}
          className={cn(
            'relative h-2 rounded-full bg-stone-200',
            disabled && 'opacity-50'
          )}
        >
          {/* Active Range Track */}
          <div
            className="absolute h-full rounded-full transition-all duration-75"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`,
              background: `linear-gradient(to right, ${LEVEL_COLORS[minValue as keyof typeof LEVEL_COLORS]}, ${LEVEL_COLORS[maxValue as keyof typeof LEVEL_COLORS]})`,
            }}
          />

          {/* Level Markers */}
          {levels.map((level) => {
            const percent = getPercentage(level)
            const isInRange = level >= minValue && level <= maxValue
            return (
              <div
                key={level}
                className={cn(
                  'absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full transition-all duration-200',
                  isInRange ? 'bg-white/60' : 'bg-stone-300'
                )}
                style={{ left: `${percent}%`, marginLeft: '-2px' }}
              />
            )
          })}

          {/* Min Thumb */}
          <button
            type="button"
            disabled={disabled}
            onMouseDown={() => !disabled && setDragging('min')}
            onTouchStart={() => !disabled && setDragging('min')}
            onKeyDown={(e) => !disabled && handleKeyDown('min', e)}
            className={cn(
              'absolute top-1/2 -translate-y-1/2 -translate-x-1/2',
              'w-5 h-5 rounded-full bg-white shadow-md border-2',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
              'transition-transform duration-100',
              dragging === 'min' && 'scale-110',
              disabled ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'
            )}
            style={{
              left: `${minPercent}%`,
              borderColor: LEVEL_COLORS[minValue as keyof typeof LEVEL_COLORS],
            }}
            aria-label={`${tGroups('form.levelMin')}: ${minValue}`}
            aria-valuemin={min}
            aria-valuemax={maxValue}
            aria-valuenow={minValue}
            aria-valuetext={t(String(minValue))}
            role="slider"
          >
            <span className="sr-only">{tGroups('form.levelMin')}</span>
          </button>

          {/* Max Thumb */}
          <button
            type="button"
            disabled={disabled}
            onMouseDown={() => !disabled && setDragging('max')}
            onTouchStart={() => !disabled && setDragging('max')}
            onKeyDown={(e) => !disabled && handleKeyDown('max', e)}
            className={cn(
              'absolute top-1/2 -translate-y-1/2 -translate-x-1/2',
              'w-5 h-5 rounded-full bg-white shadow-md border-2',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
              'transition-transform duration-100',
              dragging === 'max' && 'scale-110',
              disabled ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'
            )}
            style={{
              left: `${maxPercent}%`,
              borderColor: LEVEL_COLORS[maxValue as keyof typeof LEVEL_COLORS],
            }}
            aria-label={`${tGroups('form.levelMax')}: ${maxValue}`}
            aria-valuemin={minValue}
            aria-valuemax={max}
            aria-valuenow={maxValue}
            aria-valuetext={t(String(maxValue))}
            role="slider"
          >
            <span className="sr-only">{tGroups('form.levelMax')}</span>
          </button>
        </div>

        {/* Level Labels Below */}
        {showLabels && (
          <div className="flex justify-between mt-3 px-0.5">
            {levels.map((level) => {
              const isInRange = level >= minValue && level <= maxValue
              return (
                <div
                  key={level}
                  className={cn(
                    'flex flex-col items-center transition-all duration-200',
                    isInRange ? 'opacity-100' : 'opacity-40'
                  )}
                >
                  <span
                    className={cn(
                      'text-xs font-bold transition-colors duration-200',
                      isInRange ? 'text-stone-700' : 'text-stone-400'
                    )}
                    style={{
                      color: isInRange ? LEVEL_COLORS[level as keyof typeof LEVEL_COLORS] : undefined,
                    }}
                  >
                    {level}
                  </span>
                  {!compact && (
                    <span
                      className={cn(
                        'text-[10px] text-stone-400 truncate max-w-[60px] text-center',
                        isInRange && 'text-stone-500'
                      )}
                    >
                      {t(String(level))}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Value Pills */}
      {showLabels && !compact && (
        <div className="flex items-center justify-center gap-2">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: LEVEL_COLORS[minValue as keyof typeof LEVEL_COLORS] }}
          >
            <Zap className="w-3.5 h-3.5" />
            {t(String(minValue))}
          </div>
          <span className="text-stone-400">—</span>
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: LEVEL_COLORS[maxValue as keyof typeof LEVEL_COLORS] }}
          >
            <Zap className="w-3.5 h-3.5" />
            {t(String(maxValue))}
          </div>
        </div>
      )}
    </div>
  )
}

// Compact version for filters
export function LevelRangeSelectorCompact({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  className,
}: Omit<LevelRangeSelectorProps, 'showLabels' | 'compact'>) {
  return (
    <LevelRangeSelector
      minValue={minValue}
      maxValue={maxValue}
      onMinChange={onMinChange}
      onMaxChange={onMaxChange}
      showLabels={true}
      compact={true}
      className={className}
    />
  )
}
