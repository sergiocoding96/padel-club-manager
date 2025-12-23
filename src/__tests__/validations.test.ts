import {
  createPlayerSchema,
  updatePlayerSchema,
  playerFilterSchema,
  playerIdSchema,
} from '@/lib/validations/player'

describe('Player Validation Schemas', () => {
  describe('createPlayerSchema', () => {
    it('should validate a valid player with all fields', () => {
      const validPlayer = {
        name: 'Juan García',
        email: 'juan@example.com',
        phone: '+34 612 345 678',
        level_numeric: 4,
        status: 'active',
        notes: 'Great player',
        objectives: 'Improve backhand',
      }

      const result = createPlayerSchema.safeParse(validPlayer)
      expect(result.success).toBe(true)
    })

    it('should validate a player with only required fields', () => {
      const minimalPlayer = {
        name: 'María López',
        level_numeric: 3,
        status: 'active',
      }

      const result = createPlayerSchema.safeParse(minimalPlayer)
      expect(result.success).toBe(true)
    })

    it('should reject a player without name', () => {
      const invalidPlayer = {
        level_numeric: 3,
        status: 'active',
      }

      const result = createPlayerSchema.safeParse(invalidPlayer)
      expect(result.success).toBe(false)
    })

    it('should reject a name that is too short', () => {
      const invalidPlayer = {
        name: 'J',
        level_numeric: 3,
        status: 'active',
      }

      const result = createPlayerSchema.safeParse(invalidPlayer)
      expect(result.success).toBe(false)
    })

    it('should reject invalid email format', () => {
      const invalidPlayer = {
        name: 'Juan García',
        email: 'not-an-email',
        level_numeric: 3,
        status: 'active',
      }

      const result = createPlayerSchema.safeParse(invalidPlayer)
      expect(result.success).toBe(false)
    })

    it('should reject level outside valid range (1-7)', () => {
      const invalidPlayer = {
        name: 'Juan García',
        level_numeric: 10,
        status: 'active',
      }

      const result = createPlayerSchema.safeParse(invalidPlayer)
      expect(result.success).toBe(false)
    })

    it('should reject invalid status', () => {
      const invalidPlayer = {
        name: 'Juan García',
        level_numeric: 3,
        status: 'unknown',
      }

      const result = createPlayerSchema.safeParse(invalidPlayer)
      expect(result.success).toBe(false)
    })
  })

  describe('updatePlayerSchema', () => {
    it('should validate partial updates', () => {
      const partialUpdate = {
        name: 'Juan García Updated',
      }

      const result = updatePlayerSchema.safeParse(partialUpdate)
      expect(result.success).toBe(true)
    })

    it('should validate status-only update', () => {
      const statusUpdate = {
        status: 'inactive',
      }

      const result = updatePlayerSchema.safeParse(statusUpdate)
      expect(result.success).toBe(true)
    })

    it('should validate level-only update', () => {
      const levelUpdate = {
        level_numeric: 5,
      }

      const result = updatePlayerSchema.safeParse(levelUpdate)
      expect(result.success).toBe(true)
    })

    it('should allow empty object for no changes', () => {
      const emptyUpdate = {}

      const result = updatePlayerSchema.safeParse(emptyUpdate)
      expect(result.success).toBe(true)
    })
  })

  describe('playerFilterSchema', () => {
    it('should validate filters with search', () => {
      const filters = {
        search: 'juan',
      }

      const result = playerFilterSchema.safeParse(filters)
      expect(result.success).toBe(true)
    })

    it('should validate filters with status', () => {
      const filters = {
        status: 'active',
      }

      const result = playerFilterSchema.safeParse(filters)
      expect(result.success).toBe(true)
    })

    it('should validate filters with level range', () => {
      const filters = {
        levelMin: 2,
        levelMax: 5,
      }

      const result = playerFilterSchema.safeParse(filters)
      expect(result.success).toBe(true)
    })

    it('should validate empty filters', () => {
      const filters = {}

      const result = playerFilterSchema.safeParse(filters)
      expect(result.success).toBe(true)
    })
  })

  describe('playerIdSchema', () => {
    it('should validate a valid UUID', () => {
      const validId = '123e4567-e89b-12d3-a456-426614174000'

      const result = playerIdSchema.safeParse(validId)
      expect(result.success).toBe(true)
    })

    it('should reject an invalid UUID', () => {
      const invalidId = 'not-a-uuid'

      const result = playerIdSchema.safeParse(invalidId)
      expect(result.success).toBe(false)
    })

    it('should reject an empty string', () => {
      const emptyId = ''

      const result = playerIdSchema.safeParse(emptyId)
      expect(result.success).toBe(false)
    })
  })
})
