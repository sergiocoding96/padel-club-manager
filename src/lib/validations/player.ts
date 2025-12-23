/**
 * Player validation schemas using Zod
 */

import { z } from 'zod'
import type { PlayerStatus, PlayerSortField, SortDirection } from '@/types/player'

// Phone number regex - accepts various formats
const phoneRegex = /^(\+?[0-9]{1,4})?[-.\s]?\(?[0-9]{1,4}\)?[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,9}$/

// Create player schema
export const createPlayerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: z
    .string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters')
    .toLowerCase()
    .trim()
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .regex(phoneRegex, 'Invalid phone number format')
    .max(20, 'Phone must be less than 20 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  level_numeric: z
    .number()
    .min(1, 'Level must be between 1 and 7')
    .max(7, 'Level must be between 1 and 7')
    .multipleOf(0.5, 'Level must be in increments of 0.5'),
  status: z.enum(['active', 'inactive', 'suspended'] as const).default('active'),
  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  objectives: z
    .string()
    .max(1000, 'Objectives must be less than 1000 characters')
    .trim()
    .optional()
    .or(z.literal('')),
})

// Update player schema (all fields optional except what's being updated)
export const updatePlayerSchema = createPlayerSchema.partial()

// Player filter schema
export const playerFilterSchema = z.object({
  search: z
    .string()
    .max(100, 'Search query too long')
    .trim()
    .optional(),
  status: z
    .enum(['active', 'inactive', 'suspended', 'all'] as const)
    .optional()
    .default('all'),
  levelMin: z
    .number()
    .min(1, 'Minimum level must be at least 1')
    .max(7, 'Minimum level must be at most 7')
    .optional(),
  levelMax: z
    .number()
    .min(1, 'Maximum level must be at least 1')
    .max(7, 'Maximum level must be at most 7')
    .optional(),
}).refine(
  (data) => {
    if (data.levelMin !== undefined && data.levelMax !== undefined) {
      return data.levelMin <= data.levelMax
    }
    return true
  },
  {
    message: 'Minimum level must be less than or equal to maximum level',
    path: ['levelMin'],
  }
)

// Sort schema
export const playerSortSchema = z.object({
  field: z.enum(['name', 'level_numeric', 'created_at', 'updated_at'] as const).default('name'),
  direction: z.enum(['asc', 'desc'] as const).default('asc'),
})

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().int().min(1, 'Page must be at least 1').default(1),
  pageSize: z.number().int().min(1).max(100, 'Page size must be at most 100').default(10),
})

// Combined query schema for list endpoint
export const playerListQuerySchema = z.object({
  filters: playerFilterSchema.optional(),
  sort: playerSortSchema.optional(),
  pagination: paginationSchema.optional(),
})

// Player ID schema (UUID validation)
export const playerIdSchema = z
  .string()
  .uuid('Invalid player ID format')

// Types inferred from schemas
export type CreatePlayerInput = z.infer<typeof createPlayerSchema>
export type UpdatePlayerInput = z.infer<typeof updatePlayerSchema>
export type PlayerFilterInput = z.infer<typeof playerFilterSchema>
export type PlayerSortInput = z.infer<typeof playerSortSchema>
export type PaginationInput = z.infer<typeof paginationSchema>
export type PlayerListQueryInput = z.infer<typeof playerListQuerySchema>

// Helper function to transform empty strings to null for database
export function transformEmptyStringsToNull<T extends Record<string, unknown>>(data: T): T {
  const result = { ...data }
  for (const key in result) {
    if (result[key] === '') {
      (result as Record<string, unknown>)[key] = null
    }
  }
  return result
}

// Validation helper with detailed errors
export function validateWithErrors<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string[]> } {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  const errors: Record<string, string[]> = {}
  for (const issue of result.error.issues) {
    const path = issue.path.join('.') || 'root'
    if (!errors[path]) {
      errors[path] = []
    }
    errors[path].push(issue.message)
  }

  return { success: false, errors }
}
