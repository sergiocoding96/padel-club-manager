/**
 * Tests for CourtStatusBadge component
 */
import { render, screen } from '@testing-library/react'
import { CourtStatusBadge } from '../CourtStatusBadge'

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      available: 'Disponible',
      maintenance: 'Mantenimiento',
      reserved: 'Reservada',
    }
    return translations[key] ?? key
  },
}))

// Mock Badge component
jest.mock('@/components/ui', () => ({
  Badge: ({ children, variant, size }: { children: React.ReactNode; variant: string; size: string }) => (
    <span data-testid="badge" data-variant={variant} data-size={size}>
      {children}
    </span>
  ),
}))

describe('CourtStatusBadge', () => {
  it('renders available status with success variant', () => {
    render(<CourtStatusBadge status="available" />)

    const badge = screen.getByTestId('badge')
    expect(badge).toHaveAttribute('data-variant', 'success')
    expect(badge).toHaveTextContent('Disponible')
  })

  it('renders maintenance status with warning variant', () => {
    render(<CourtStatusBadge status="maintenance" />)

    const badge = screen.getByTestId('badge')
    expect(badge).toHaveAttribute('data-variant', 'warning')
    expect(badge).toHaveTextContent('Mantenimiento')
  })

  it('renders reserved status with error variant', () => {
    render(<CourtStatusBadge status="reserved" />)

    const badge = screen.getByTestId('badge')
    expect(badge).toHaveAttribute('data-variant', 'error')
    expect(badge).toHaveTextContent('Reservada')
  })

  it('uses sm size by default', () => {
    render(<CourtStatusBadge status="available" />)

    const badge = screen.getByTestId('badge')
    expect(badge).toHaveAttribute('data-size', 'sm')
  })

  it('accepts md size', () => {
    render(<CourtStatusBadge status="available" size="md" />)

    const badge = screen.getByTestId('badge')
    expect(badge).toHaveAttribute('data-size', 'md')
  })
})
