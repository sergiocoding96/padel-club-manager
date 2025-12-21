/**
 * Unit tests for court server actions
 * Tests validation logic and data transformation
 */

// Mock Supabase
const mockSelect = jest.fn().mockReturnThis()
const mockInsert = jest.fn().mockReturnThis()
const mockUpdate = jest.fn().mockReturnThis()
const mockDelete = jest.fn().mockReturnThis()
const mockEq = jest.fn().mockReturnThis()
const mockIlike = jest.fn().mockReturnThis()
const mockOrder = jest.fn().mockReturnThis()
const mockSingle = jest.fn()

jest.mock('@/lib/supabase', () => ({
  createServerClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
      eq: mockEq,
      ilike: mockIlike,
      order: mockOrder,
      single: mockSingle,
    })),
  })),
}))

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

// Import after mocks
import { createCourt, updateCourt, deleteCourt, updateCourtStatus } from '../actions'

// Valid UUID for testing
const VALID_UUID = '123e4567-e89b-12d3-a456-426614174000'
const INVALID_UUID = '999'

describe('Court Server Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Default successful response
    mockSingle.mockResolvedValue({
      data: { id: VALID_UUID, name: 'Test Court', status: 'available' },
      error: null,
    })
  })

  describe('createCourt', () => {
    it('should reject empty name', async () => {
      const formData = new FormData()
      formData.set('name', '')
      formData.set('status', 'available')

      const result = await createCourt(formData)

      expect(result.success).toBe(false)
      expect(result.errors?.name).toBeDefined()
      expect(result.errors?.name).toContain('obligatorio')
    })

    it('should reject name shorter than 2 characters', async () => {
      const formData = new FormData()
      formData.set('name', 'A')
      formData.set('status', 'available')

      const result = await createCourt(formData)

      expect(result.success).toBe(false)
      expect(result.errors?.name).toBeDefined()
      expect(result.errors?.name).toContain('2 caracteres')
    })

    it('should reject name longer than 100 characters', async () => {
      const formData = new FormData()
      formData.set('name', 'A'.repeat(101))
      formData.set('status', 'available')

      const result = await createCourt(formData)

      expect(result.success).toBe(false)
      expect(result.errors?.name).toBeDefined()
      expect(result.errors?.name).toContain('100 caracteres')
    })

    it('should reject invalid surface type', async () => {
      const formData = new FormData()
      formData.set('name', 'Test Court')
      formData.set('surface_type', 'invalid')
      formData.set('status', 'available')

      const result = await createCourt(formData)

      expect(result.success).toBe(false)
      expect(result.errors?.surface_type).toBeDefined()
    })

    it('should reject invalid status', async () => {
      const formData = new FormData()
      formData.set('name', 'Test Court')
      formData.set('status', 'invalid')

      const result = await createCourt(formData)

      expect(result.success).toBe(false)
      expect(result.errors?.status).toBeDefined()
    })

    it('should create court with valid data', async () => {
      const formData = new FormData()
      formData.set('name', 'Pista 1')
      formData.set('surface_type', 'indoor')
      formData.set('location', 'Planta baja')
      formData.set('status', 'available')

      const result = await createCourt(formData)

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
    })

    it('should create court with minimal data', async () => {
      const formData = new FormData()
      formData.set('name', 'Pista 2')

      const result = await createCourt(formData)

      expect(result.success).toBe(true)
    })

    it('should trim whitespace from name', async () => {
      const formData = new FormData()
      formData.set('name', '  Pista 3  ')

      const result = await createCourt(formData)

      expect(result.success).toBe(true)
    })
  })

  describe('updateCourt', () => {
    it('should reject invalid UUID format', async () => {
      const formData = new FormData()
      formData.set('name', 'Test Court')

      const result = await updateCourt(INVALID_UUID, formData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid court ID format')
    })

    it('should validate name on update', async () => {
      const formData = new FormData()
      formData.set('name', '')

      const result = await updateCourt(VALID_UUID, formData)

      expect(result.success).toBe(false)
      expect(result.errors?.name).toBeDefined()
    })

    it('should update court with valid data', async () => {
      const formData = new FormData()
      formData.set('name', 'Pista Actualizada')
      formData.set('surface_type', 'outdoor')
      formData.set('status', 'maintenance')

      const result = await updateCourt(VALID_UUID, formData)

      expect(result.success).toBe(true)
    })
  })

  describe('deleteCourt', () => {
    it('should reject invalid UUID format', async () => {
      const result = await deleteCourt(INVALID_UUID)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid court ID format')
    })

    it('should delete court successfully', async () => {
      // Mock successful delete
      mockEq.mockResolvedValueOnce({ error: null })

      const result = await deleteCourt(VALID_UUID)

      expect(result.success).toBe(true)
    })

    it('should handle delete errors', async () => {
      // Mock delete error
      mockEq.mockResolvedValueOnce({
        error: { message: 'Court not found' },
      })

      const result = await deleteCourt(VALID_UUID)

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('updateCourtStatus', () => {
    it('should reject invalid UUID format', async () => {
      const result = await updateCourtStatus(INVALID_UUID, 'available')

      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid court ID format')
    })

    it('should reject invalid status', async () => {
      const result = await updateCourtStatus(VALID_UUID, 'invalid' as any)

      expect(result.success).toBe(false)
      expect(result.error).toContain('no valido')
    })

    it('should update status to available', async () => {
      const result = await updateCourtStatus(VALID_UUID, 'available')

      expect(result.success).toBe(true)
    })

    it('should update status to maintenance', async () => {
      const result = await updateCourtStatus(VALID_UUID, 'maintenance')

      expect(result.success).toBe(true)
    })

    it('should update status to reserved', async () => {
      const result = await updateCourtStatus(VALID_UUID, 'reserved')

      expect(result.success).toBe(true)
    })
  })
})
