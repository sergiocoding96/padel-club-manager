import { test, expect } from '@playwright/test'

test.describe('Players Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/players')
  })

  test('should display the players page title', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('should display the new player button', async ({ page }) => {
    const newPlayerButton = page.getByRole('button', { name: /nuevo jugador|new player/i })
    await expect(newPlayerButton).toBeVisible()
  })

  test('should display stats cards', async ({ page }) => {
    // Check that stats cards are visible
    await expect(page.locator('[class*="rounded-2xl"]').first()).toBeVisible()
  })

  test('should open create player modal when clicking new player button', async ({ page }) => {
    const newPlayerButton = page.getByRole('button', { name: /nuevo jugador|new player/i })
    await newPlayerButton.click()

    // Wait for modal to open
    await expect(page.getByRole('dialog')).toBeVisible()
  })

  test('should display filter and sort controls', async ({ page }) => {
    // Search input should be visible
    await expect(page.getByPlaceholder(/buscar|search/i)).toBeVisible()
  })

  test('should toggle view mode between grid and list', async ({ page }) => {
    // Look for view toggle buttons
    const gridButton = page.locator('button[aria-label*="grid"], button:has-text("Grid"), button:has-text("Cuadrícula")')
    const listButton = page.locator('button[aria-label*="list"], button:has-text("List"), button:has-text("Lista")')

    if (await gridButton.isVisible()) {
      await gridButton.click()
    }

    if (await listButton.isVisible()) {
      await listButton.click()
    }
  })
})

test.describe('Player Detail Page', () => {
  test('should navigate to player detail when clicking view', async ({ page }) => {
    await page.goto('/players')

    // If there are players, try to view one
    const viewButton = page.locator('button, a').filter({ hasText: /ver|view/i }).first()

    if (await viewButton.isVisible({ timeout: 3000 })) {
      await viewButton.click()
      await expect(page).toHaveURL(/\/players\/[a-f0-9-]+/)
    }
  })
})

test.describe('Create Player Flow', () => {
  test('should validate required fields', async ({ page }) => {
    await page.goto('/players')

    // Open create modal
    const newPlayerButton = page.getByRole('button', { name: /nuevo jugador|new player/i })
    await newPlayerButton.click()

    // Try to submit without filling required fields
    const submitButton = page.getByRole('button', { name: /crear|create|guardar|save/i })
    await submitButton.click()

    // Should show validation error
    await expect(page.getByText(/nombre.*requerido|name.*required/i)).toBeVisible({ timeout: 5000 })
  })

  test('should create a new player with valid data', async ({ page }) => {
    await page.goto('/players')

    // Open create modal
    const newPlayerButton = page.getByRole('button', { name: /nuevo jugador|new player/i })
    await newPlayerButton.click()

    // Fill in the form
    await page.getByLabel(/nombre|name/i).fill('Test Player E2E')
    await page.getByLabel(/email/i).fill('test.e2e@example.com')
    await page.getByLabel(/teléfono|phone/i).fill('+34 612 345 678')

    // Select level
    const levelSelect = page.getByLabel(/nivel|level/i)
    if (await levelSelect.isVisible()) {
      await levelSelect.selectOption({ index: 3 })
    }

    // Submit
    const submitButton = page.getByRole('button', { name: /crear|create|guardar|save/i })
    await submitButton.click()

    // Modal should close and new player should appear
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10000 })
  })
})
