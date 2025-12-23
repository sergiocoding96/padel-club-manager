'use client'

import { useState, useEffect, createContext, useContext, useCallback, ReactNode } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

type Toast = {
  id: string
  type: ToastType
  title?: string
  message: string
  duration?: number
}

type ToastContextType = {
  toasts: Toast[]
  addToast: (type: ToastType, message: string, duration?: number) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

type ToastProviderProps = {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((type: ToastType, message: string, duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, type, message, duration }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

type ToastContainerProps = {
  toasts: Toast[]
  removeToast: (id: string) => void
}

function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

type ToastItemProps = {
  toast: Toast
  onClose: () => void
}

const toastConfig: Record<ToastType, { icon: typeof CheckCircle; bg: string; border: string; text: string }> = {
  success: {
    icon: CheckCircle,
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
  },
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const config = toastConfig[toast.type]
  const Icon = config.icon

  const handleClose = useCallback(() => {
    setIsLeaving(true)
    setTimeout(onClose, 300)
  }, [onClose])

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true)
    })

    if (toast.duration) {
      const timer = setTimeout(handleClose, toast.duration)
      return () => clearTimeout(timer)
    }
  }, [toast.duration, handleClose])

  return (
    <div
      role="alert"
      className={cn(
        'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg min-w-[300px] max-w-md transition-all duration-300 ease-out',
        config.bg,
        config.border,
        isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      )}
    >
      <Icon className={cn('w-5 h-5 shrink-0', config.text)} />
      <div className="flex-1 min-w-0">
        {toast.title && <p className={cn('text-sm font-medium', config.text)}>{toast.title}</p>}
        <p className={cn('text-sm', toast.title ? 'opacity-80' : 'font-medium', config.text)}>{toast.message}</p>
      </div>
      <button
        onClick={handleClose}
        className={cn('p-1 rounded hover:bg-black/5 transition-colors flex-shrink-0', config.text)}
      >
        <X className="w-4 h-4" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  )
}

// Helper hook for common toast actions
export function useBookingToasts() {
  const { addToast } = useToast()

  return {
    showSuccess: (message: string) => addToast('success', message),
    showError: (message: string) => addToast('error', message),
    showWarning: (message: string) => addToast('warning', message),
    showInfo: (message: string) => addToast('info', message),
  }
}
