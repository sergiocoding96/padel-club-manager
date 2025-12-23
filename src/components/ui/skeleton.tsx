import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'circular' | 'text' | 'card'
}

function Skeleton({ className, variant = 'default', ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-stone-100',
        // Shimmer animation
        'before:absolute before:inset-0',
        'before:-translate-x-full before:animate-[shimmer_2s_infinite]',
        'before:bg-gradient-to-r',
        'before:from-transparent before:via-white/60 before:to-transparent',
        {
          'default': 'rounded-lg',
          'circular': 'rounded-full',
          'text': 'rounded h-4 w-full',
          'card': 'rounded-2xl',
        }[variant],
        className
      )}
      {...props}
    />
  )
}

// Preset skeleton components for common use cases
function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-stone-200 bg-white p-6', className)}>
      <div className="flex items-start gap-4">
        <Skeleton variant="circular" className="h-14 w-14 shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="h-5 w-3/4" />
          <Skeleton variant="text" className="h-4 w-1/2" />
        </div>
      </div>
      <div className="mt-6 space-y-3">
        <Skeleton variant="text" className="h-4 w-full" />
        <Skeleton variant="text" className="h-4 w-5/6" />
      </div>
      <div className="mt-6 flex gap-2">
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-16 rounded-full" />
      </div>
    </div>
  )
}

function SkeletonRow({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-4 p-4 border-b border-stone-100', className)}>
      <Skeleton variant="circular" className="h-10 w-10 shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="h-4 w-1/3" />
        <Skeleton variant="text" className="h-3 w-1/4" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-12 rounded-full" />
    </div>
  )
}

function SkeletonAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  }
  return <Skeleton variant="circular" className={sizeClasses[size]} />
}

export { Skeleton, SkeletonCard, SkeletonRow, SkeletonAvatar }
