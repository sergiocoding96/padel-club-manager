'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'

interface TooltipProps {
  children: ReactNode
  content: ReactNode
  position?: TooltipPosition
  delay?: number
  className?: string
}

export function Tooltip({
  children,
  content,
  position = 'top',
  delay = 300,
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setShouldRender(true)
      // Small delay for the animation to work
      requestAnimationFrame(() => {
        setIsVisible(true)
      })
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsVisible(false)
    // Wait for animation to complete before removing from DOM
    setTimeout(() => {
      setShouldRender(false)
    }, 150)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const positionClasses: Record<TooltipPosition, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  const arrowClasses: Record<TooltipPosition, string> = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-stone-800 border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-stone-800 border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-stone-800 border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-stone-800 border-y-transparent border-l-transparent',
  }

  const animationClasses: Record<TooltipPosition, { enter: string; exit: string }> = {
    top: {
      enter: 'translate-y-0 opacity-100',
      exit: 'translate-y-1 opacity-0',
    },
    bottom: {
      enter: 'translate-y-0 opacity-100',
      exit: '-translate-y-1 opacity-0',
    },
    left: {
      enter: 'translate-x-0 opacity-100',
      exit: 'translate-x-1 opacity-0',
    },
    right: {
      enter: 'translate-x-0 opacity-100',
      exit: '-translate-x-1 opacity-0',
    },
  }

  return (
    <div
      ref={triggerRef}
      className="relative inline-flex"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {shouldRender && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-50 whitespace-nowrap rounded-lg bg-stone-800 px-3 py-1.5',
            'text-xs font-medium text-white shadow-lg',
            'transition-all duration-150 ease-out',
            positionClasses[position],
            isVisible ? animationClasses[position].enter : animationClasses[position].exit,
            className
          )}
        >
          {content}
          {/* Arrow */}
          <span
            className={cn(
              'absolute h-0 w-0 border-4',
              arrowClasses[position]
            )}
          />
        </div>
      )}
    </div>
  )
}

// Shorthand component for icon buttons with tooltips
interface TooltipButtonProps {
  tooltip: string
  position?: TooltipPosition
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export function TooltipButton({
  tooltip,
  position = 'top',
  children,
  onClick,
  disabled,
  className,
}: TooltipButtonProps) {
  return (
    <Tooltip content={tooltip} position={position}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          'rounded-lg p-2 text-stone-500 transition-colors',
          'hover:bg-stone-100 hover:text-stone-700',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
      >
        {children}
      </button>
    </Tooltip>
  )
}

export default Tooltip
