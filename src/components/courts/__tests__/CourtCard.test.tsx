/**
 * Tests for CourtCard component
 */
import { render, screen, fireEvent } from '@testing-library/react'
import { CourtCard } from '../CourtCard'
import type { Court } from '@/types/database'

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      courts: {
        available: 'Available',
        maintenance: 'Maintenance',
        reserved: 'Reserved',
        indoor: 'Indoor',
        outdoor: 'Outdoor',
        status: 'Status',
      },
      common: {
        edit: 'Edit',
        delete: 'Delete',
      },
    }
    return translations[namespace]?.[key] ?? key
  },
}))

const mockCourt: Court = {
  id: '1',
  name: 'Pista 1',
  surface_type: 'indoor',
  location: 'Planta baja',
  status: 'available',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

describe('CourtCard', () => {
  const mockOnEdit = jest.fn()
  const mockOnDelete = jest.fn()
  const mockOnStatusChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders court name', () => {
    render(
      <CourtCard
        court={mockCourt}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    )

    expect(screen.getByText('Pista 1')).toBeInTheDocument()
  })

  it('renders court location', () => {
    render(
      <CourtCard
        court={mockCourt}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    )

    expect(screen.getByText('Planta baja')).toBeInTheDocument()
  })

  it('renders status badge', () => {
    render(
      <CourtCard
        court={mockCourt}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    )

    // Use getAllByText since "Available" appears in both badge and menu
    const availableElements = screen.getAllByText('Available')
    expect(availableElements.length).toBeGreaterThan(0)
  })

  it('renders surface type indicator', () => {
    render(
      <CourtCard
        court={mockCourt}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    )

    expect(screen.getByText('Indoor')).toBeInTheDocument()
  })

  it('opens menu on button click', () => {
    render(
      <CourtCard
        court={mockCourt}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    )

    const menuButton = screen.getByRole('button', { name: 'Menu' })
    fireEvent.click(menuButton)

    // Menu should be visible with edit and delete options
    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', () => {
    render(
      <CourtCard
        court={mockCourt}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    )

    // Open menu
    const menuButton = screen.getByRole('button', { name: 'Menu' })
    fireEvent.click(menuButton)

    // Click edit
    const editButton = screen.getByText('Edit')
    fireEvent.click(editButton)

    expect(mockOnEdit).toHaveBeenCalledWith(mockCourt)
  })

  it('calls onDelete when delete button is clicked', () => {
    render(
      <CourtCard
        court={mockCourt}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    )

    // Open menu
    const menuButton = screen.getByRole('button', { name: 'Menu' })
    fireEvent.click(menuButton)

    // Click delete
    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)

    expect(mockOnDelete).toHaveBeenCalledWith(mockCourt)
  })

  it('calls onStatusChange when status option is clicked', () => {
    render(
      <CourtCard
        court={mockCourt}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    )

    // Open menu
    const menuButton = screen.getByRole('button', { name: 'Menu' })
    fireEvent.click(menuButton)

    // Click maintenance status
    const maintenanceButton = screen.getByText('Maintenance')
    fireEvent.click(maintenanceButton)

    expect(mockOnStatusChange).toHaveBeenCalledWith(mockCourt, 'maintenance')
  })

  it('disables current status option', () => {
    render(
      <CourtCard
        court={mockCourt}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    )

    // Open menu
    const menuButton = screen.getByRole('button', { name: 'Menu' })
    fireEvent.click(menuButton)

    // Current status (available) should be disabled
    const availableButtons = screen.getAllByRole('button')
    const availableStatusButton = availableButtons.find(
      (btn) => btn.textContent?.includes('Available') && btn.closest('[class*="py-1"]')
    )

    expect(availableStatusButton).toBeDisabled()
  })

  it('renders outdoor court with different gradient', () => {
    const outdoorCourt: Court = {
      ...mockCourt,
      surface_type: 'outdoor',
    }

    render(
      <CourtCard
        court={outdoorCourt}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    )

    expect(screen.getByText('Outdoor')).toBeInTheDocument()
  })

  it('renders court without location', () => {
    const courtWithoutLocation: Court = {
      ...mockCourt,
      location: null,
    }

    render(
      <CourtCard
        court={courtWithoutLocation}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    )

    expect(screen.queryByText('Planta baja')).not.toBeInTheDocument()
  })

  it('has proper data-testid attribute', () => {
    render(
      <CourtCard
        court={mockCourt}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    )

    expect(screen.getByTestId('court-card')).toBeInTheDocument()
  })
})
