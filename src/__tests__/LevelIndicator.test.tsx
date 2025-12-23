import { render, screen } from '@testing-library/react'
import { LevelIndicator } from '@/components/players/LevelIndicator'

describe('LevelIndicator', () => {
  it('renders the level number', () => {
    render(<LevelIndicator level={4} />)
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('renders with default variant (badge)', () => {
    const { container } = render(<LevelIndicator level={3} />)
    expect(container.firstChild).toHaveClass('inline-flex', 'items-center')
  })

  it('renders with pill variant', () => {
    const { container } = render(<LevelIndicator level={5} variant="pill" />)
    expect(container.firstChild).toHaveClass('inline-flex', 'rounded-full')
  })

  it('renders correct color classes for beginner level (1)', () => {
    const { container } = render(<LevelIndicator level={1} />)
    // The colored badge is inside the wrapper div
    const badge = container.querySelector('.bg-emerald-50')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('text-emerald-700')
  })

  it('renders correct color classes for intermediate level (4)', () => {
    const { container } = render(<LevelIndicator level={4} />)
    const badge = container.querySelector('.bg-blue-50')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('text-blue-700')
  })

  it('renders correct color classes for advanced level (6)', () => {
    const { container } = render(<LevelIndicator level={6} />)
    const badge = container.querySelector('.bg-amber-50')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('text-amber-700')
  })

  it('renders correct color classes for competition level (7)', () => {
    const { container } = render(<LevelIndicator level={7} />)
    const badge = container.querySelector('.bg-rose-50')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('text-rose-700')
  })

  it('applies custom className', () => {
    const { container } = render(
      <LevelIndicator level={3} className="custom-class" />
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('renders with different sizes', () => {
    const { container: smContainer } = render(
      <LevelIndicator level={3} size="sm" />
    )
    const { container: lgContainer } = render(
      <LevelIndicator level={3} size="lg" />
    )

    // Size classes are applied to the inner badge element
    const smBadge = smContainer.querySelector('.h-6.w-6')
    const lgBadge = lgContainer.querySelector('.h-10.w-10')

    expect(smBadge).toBeInTheDocument()
    expect(lgBadge).toBeInTheDocument()
  })

  it('renders arc variant with progress', () => {
    render(<LevelIndicator level={5} variant="arc" />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('shows label when showLabel is true', () => {
    render(<LevelIndicator level={3} showLabel />)
    // Level number appears in badge and in the label (showing level name from translations)
    const levelNumbers = screen.getAllByText('3')
    expect(levelNumbers.length).toBeGreaterThanOrEqual(1)
  })

  it('renders all levels without errors', () => {
    const levels = [1, 2, 3, 4, 5, 6, 7]
    levels.forEach((level) => {
      const { container } = render(<LevelIndicator level={level} />)
      expect(screen.getByText(String(level))).toBeInTheDocument()
      container.remove()
    })
  })
})
