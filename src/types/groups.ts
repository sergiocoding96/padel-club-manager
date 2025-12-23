import type {
  Group,
  GroupPlayer,
  GroupStatus,
  Player,
  Coach,
  Court,
  ScheduleSlot,
  ScheduleTemplate
} from './database'

// ==========================================
// Extended Types with Relations
// ==========================================

/**
 * Group with all related data (coach, court, players)
 */
export interface GroupWithRelations extends Group {
  coach: Coach | null
  court: Court | null
  players: PlayerInGroup[]
  player_count: number
}

/**
 * Player data when displayed in a group context
 */
export interface PlayerInGroup extends Pick<Player, 'id' | 'name' | 'email' | 'level_numeric' | 'level_category'> {
  joined_at: string
  membership_status: GroupPlayer['status']
}

/**
 * Group summary for list views (lighter than full relations)
 */
export interface GroupSummary {
  id: string
  name: string
  level_min: number | null
  level_max: number | null
  status: GroupStatus
  max_players: number
  player_count: number
  coach_name: string | null
  next_session: ScheduleSlot | null
  color?: string
}

// ==========================================
// Form Input Types
// ==========================================

/**
 * Form data for creating a new group
 */
export interface GroupCreateInput {
  name: string
  description?: string
  level_min: number
  level_max: number
  max_players: number
  coach_id?: string | null
  court_id?: string | null
  schedule_template?: ScheduleTemplate | null
  color?: string
}

/**
 * Form data for updating an existing group
 */
export interface GroupUpdateInput extends Partial<GroupCreateInput> {
  status?: GroupStatus
}

/**
 * Schedule slot form input
 */
export interface ScheduleSlotInput {
  day: number
  startTime: string
  endTime: string
  courtId?: string
}

// ==========================================
// Filter & Query Types
// ==========================================

/**
 * Filters for querying groups
 */
export interface GroupFilters {
  status?: GroupStatus | 'all'
  level_min?: number
  level_max?: number
  coach_id?: string
  search?: string
}

/**
 * Sort options for groups list
 */
export type GroupSortField = 'name' | 'level_min' | 'player_count' | 'created_at'
export type SortDirection = 'asc' | 'desc'

export interface GroupSortOptions {
  field: GroupSortField
  direction: SortDirection
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  page: number
  pageSize: number
}

// ==========================================
// API Response Types
// ==========================================

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * Groups list response
 */
export type GroupsListResponse = PaginatedResponse<GroupSummary>

/**
 * Single group response
 */
export interface GroupDetailResponse {
  group: GroupWithRelations
}

/**
 * Mutation result
 */
export interface MutationResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

// ==========================================
// Player Assignment Types
// ==========================================

/**
 * Player available for assignment to a group
 */
export interface AvailablePlayer extends Pick<Player, 'id' | 'name' | 'email' | 'level_numeric' | 'level_category' | 'status'> {
  current_groups: string[] // Group names the player is already in
  level_compatible: boolean // Whether player level is within group range
}

/**
 * Input for adding a player to a group
 */
export interface AddPlayerInput {
  group_id: string
  player_id: string
}

/**
 * Input for removing a player from a group
 */
export interface RemovePlayerInput {
  group_id: string
  player_id: string
}

// ==========================================
// Schedule Types
// ==========================================

/**
 * Day of week with localized name
 */
export interface DayOfWeek {
  value: number // 0-6
  labelKey: string // i18n key
}

/**
 * Schedule display data
 */
export interface ScheduleDisplayData {
  day: number
  dayName: string
  slots: {
    startTime: string
    endTime: string
    court?: Court
  }[]
}

// ==========================================
// UI State Types
// ==========================================

/**
 * View mode for groups list
 */
export type ViewMode = 'grid' | 'list'

/**
 * Group form mode
 */
export type FormMode = 'create' | 'edit'

/**
 * Modal state
 */
export interface ModalState {
  isOpen: boolean
  mode: FormMode
  groupId?: string
}

// ==========================================
// Constants
// ==========================================

export const DAYS_OF_WEEK: DayOfWeek[] = [
  { value: 0, labelKey: 'days.sunday' },
  { value: 1, labelKey: 'days.monday' },
  { value: 2, labelKey: 'days.tuesday' },
  { value: 3, labelKey: 'days.wednesday' },
  { value: 4, labelKey: 'days.thursday' },
  { value: 5, labelKey: 'days.friday' },
  { value: 6, labelKey: 'days.saturday' },
]

export const LEVEL_RANGE = {
  min: 1,
  max: 7,
} as const

export const DEFAULT_MAX_PLAYERS = 4

export const GROUP_COLORS = [
  '#3B82F6', // blue
  '#8B5CF6', // purple
  '#10B981', // green
  '#F59E0B', // amber
  '#EF4444', // red
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#F97316', // orange
] as const
