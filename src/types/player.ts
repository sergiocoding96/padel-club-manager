/**
 * Player-specific types and interfaces
 */

import type { Player as DatabasePlayer } from './database'

// Re-export validation input types
export type {
  CreatePlayerInput,
  UpdatePlayerInput,
  PlayerFilterInput,
  PlayerSortInput,
  PaginationInput,
} from '@/lib/validations/player'

// Player status enum
export type PlayerStatus = 'active' | 'inactive' | 'suspended'

// Sort types for UI components
export type SortField = 'name' | 'level' | 'createdAt' | 'updatedAt'
export type SortOrder = 'asc' | 'desc'

// UI-friendly Player type with camelCase fields
export interface Player {
  id: string
  name: string
  email: string | null
  phone: string | null
  level: number
  status: PlayerStatus
  notes: string | null
  objectives: string | null
  createdAt: string
  updatedAt: string
}

// Transform database player to UI player
export function toUIPlayer(dbPlayer: DatabasePlayer): Player {
  return {
    id: dbPlayer.id,
    name: dbPlayer.name,
    email: dbPlayer.email,
    phone: dbPlayer.phone,
    level: dbPlayer.level_numeric ?? 1,
    status: dbPlayer.status,
    notes: dbPlayer.notes,
    objectives: dbPlayer.objectives,
    createdAt: dbPlayer.created_at,
    updatedAt: dbPlayer.updated_at,
  }
}

// Transform UI player to database format for insert/update
export function toDBPlayer(uiPlayer: Partial<Player>): Partial<DatabasePlayer> {
  const result: Partial<DatabasePlayer> = {}
  if (uiPlayer.id !== undefined) result.id = uiPlayer.id
  if (uiPlayer.name !== undefined) result.name = uiPlayer.name
  if (uiPlayer.email !== undefined) result.email = uiPlayer.email || null
  if (uiPlayer.phone !== undefined) result.phone = uiPlayer.phone || null
  if (uiPlayer.level !== undefined) result.level_numeric = uiPlayer.level
  if (uiPlayer.status !== undefined) result.status = uiPlayer.status
  if (uiPlayer.notes !== undefined) result.notes = uiPlayer.notes || null
  if (uiPlayer.objectives !== undefined) result.objectives = uiPlayer.objectives || null
  return result
}

// Level numeric range (1-7)
export type LevelNumeric = 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5 | 5.5 | 6 | 6.5 | 7

// Level categories with translations
export type LevelCategory =
  | 'beginner'        // 1
  | 'beginner_plus'   // 2
  | 'low_intermediate' // 3
  | 'intermediate'     // 4
  | 'high_intermediate' // 5
  | 'advanced'         // 6
  | 'competition'      // 7

// Level configuration with colors
export interface LevelConfig {
  numeric: number
  category: LevelCategory
  labelEs: string
  labelEn: string
  color: string
  bgColor: string
  textColor: string
}

// Level configurations (1-7)
export const LEVEL_CONFIGS: LevelConfig[] = [
  { numeric: 1, category: 'beginner', labelEs: 'Iniciacion', labelEn: 'Beginner', color: 'emerald', bgColor: 'bg-emerald-100', textColor: 'text-emerald-700' },
  { numeric: 2, category: 'beginner_plus', labelEs: 'Iniciacion+', labelEn: 'Beginner+', color: 'emerald', bgColor: 'bg-emerald-200', textColor: 'text-emerald-800' },
  { numeric: 3, category: 'low_intermediate', labelEs: 'Intermedio Bajo', labelEn: 'Low Intermediate', color: 'amber', bgColor: 'bg-amber-100', textColor: 'text-amber-700' },
  { numeric: 4, category: 'intermediate', labelEs: 'Intermedio', labelEn: 'Intermediate', color: 'amber', bgColor: 'bg-amber-200', textColor: 'text-amber-800' },
  { numeric: 5, category: 'high_intermediate', labelEs: 'Intermedio Alto', labelEn: 'High Intermediate', color: 'orange', bgColor: 'bg-orange-100', textColor: 'text-orange-700' },
  { numeric: 6, category: 'advanced', labelEs: 'Avanzado', labelEn: 'Advanced', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-700' },
  { numeric: 7, category: 'competition', labelEs: 'Competicion', labelEn: 'Competition', color: 'purple', bgColor: 'bg-purple-100', textColor: 'text-purple-700' },
]

// Get level config by numeric value
export function getLevelConfig(level: number | null): LevelConfig | undefined {
  if (level === null) return undefined
  const roundedLevel = Math.round(level)
  return LEVEL_CONFIGS.find(config => config.numeric === roundedLevel)
}

// Status configuration with colors
export interface StatusConfig {
  value: PlayerStatus
  labelEs: string
  labelEn: string
  color: string
  bgColor: string
  textColor: string
}

export const STATUS_CONFIGS: StatusConfig[] = [
  { value: 'active', labelEs: 'Activo', labelEn: 'Active', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-700' },
  { value: 'inactive', labelEs: 'Inactivo', labelEn: 'Inactive', color: 'gray', bgColor: 'bg-stone-100', textColor: 'text-stone-600' },
  { value: 'suspended', labelEs: 'Suspendido', labelEn: 'Suspended', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-700' },
]

// Get status config by value
export function getStatusConfig(status: PlayerStatus): StatusConfig {
  return STATUS_CONFIGS.find(config => config.value === status) ?? STATUS_CONFIGS[0]
}

// Player filters for list view (UI-friendly)
export interface PlayerFilters {
  search?: string
  status?: PlayerStatus | 'all'
  levelMin?: number
  levelMax?: number
}

// Player sort options
export type PlayerSortField = 'name' | 'level_numeric' | 'created_at' | 'updated_at'
export type SortDirection = 'asc' | 'desc'

export interface PlayerSort {
  field: PlayerSortField
  direction: SortDirection
}

// Pagination
export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Player list view mode
export type ViewMode = 'grid' | 'list'

// Player with computed fields (for UI)
export interface PlayerWithStats extends Player {
  groupCount?: number
  attendanceRate?: number
}

// Form data for create/edit
export interface PlayerFormData {
  name: string
  email: string
  phone: string
  level_numeric: number
  status: PlayerStatus
  notes: string
  objectives: string
}

// Default form values
export const DEFAULT_PLAYER_FORM: PlayerFormData = {
  name: '',
  email: '',
  phone: '',
  level_numeric: 3,
  status: 'active',
  notes: '',
  objectives: '',
}
