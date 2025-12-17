import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

export function formatDate(date: string, locale: string = 'en'): string {
  return new Date(date).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function getWeekDates(date: Date): Date[] {
  const week: Date[] = []
  const current = new Date(date)
  current.setDate(current.getDate() - current.getDay() + 1)

  for (let i = 0; i < 7; i++) {
    week.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  return week
}

export function generateTimeSlots(startHour: number = 7, endHour: number = 22): string[] {
  const slots: string[] = []
  for (let hour = startHour; hour <= endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`)
    if (hour < endHour) {
      slots.push(`${hour.toString().padStart(2, '0')}:30`)
    }
  }
  return slots
}

export const coachColors: Record<string, string> = {
  'default': 'bg-gray-500',
}

export function getCoachColor(coachName: string): string {
  return coachColors[coachName] || coachColors['default']
}

export const LEVEL_CATEGORIES = {
  1: 'Iniciacion',
  2: 'Iniciacion+',
  3: 'Intermedio Bajo',
  4: 'Intermedio',
  5: 'Intermedio Alto',
  6: 'Avanzado',
  7: 'Competicion',
} as const

export const LEVEL_CATEGORIES_EN = {
  1: 'Beginner',
  2: 'Beginner+',
  3: 'Low Intermediate',
  4: 'Intermediate',
  5: 'High Intermediate',
  6: 'Advanced',
  7: 'Competition',
} as const

export function getLevelCategory(level: number, locale: string = 'es'): string {
  const categories = locale === 'es' ? LEVEL_CATEGORIES : LEVEL_CATEGORIES_EN
  const roundedLevel = Math.round(level)
  return categories[roundedLevel as keyof typeof categories] || 'Unknown'
}
