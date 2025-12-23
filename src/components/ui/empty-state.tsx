import * as React from 'react'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  variant?: 'default' | 'card' | 'inline'
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = 'default',
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        {
          'default': 'py-16 px-4',
          'card': 'py-12 px-6 rounded-2xl border border-dashed border-stone-300 bg-stone-50/50',
          'inline': 'py-8 px-4',
        }[variant],
        className
      )}
      {...props}
    >
      {Icon && (
        <div className="mb-4 rounded-full bg-stone-100 p-4">
          <Icon className="h-8 w-8 text-stone-400" strokeWidth={1.5} />
        </div>
      )}
      <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-stone-500 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

// Preset empty states for common use cases
interface SearchEmptyStateProps {
  title?: string
  description?: string
  onClear?: () => void
  clearLabel?: string
}

function SearchEmptyState({
  title = 'No results found',
  description = 'Try adjusting your search or filter to find what you\'re looking for.',
  onClear,
  clearLabel = 'Clear filters',
}: SearchEmptyStateProps) {
  const SearchIcon = ({ className }: { className?: string }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  )

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 rounded-full bg-stone-100 p-4">
        <SearchIcon className="h-8 w-8 text-stone-400" />
      </div>
      <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-stone-500">{description}</p>
      {onClear && (
        <button
          onClick={onClear}
          className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          {clearLabel}
        </button>
      )}
    </div>
  )
}

export { EmptyState, SearchEmptyState }
