import { render, screen } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import Button from './Button';
import userEvent from '@testing-library/user-event';

// Helper function to render Button components with router
const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: BrowserRouter });
};

describe('Button Component', () => {
  test('renders standard button correctly with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  test('applies primary variant class correctly', () => {
    render(<Button variant="primary">Primary Button</Button>);
    const button = screen.getByRole('button', { name: /primary button/i });
    expect(button).toHaveStyle(`background: var(--primary)`);
  });

  test('applies secondary variant class correctly', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole('button', { name: /secondary button/i });
    expect(button).toHaveStyle(`background-color: var(--white)`);
  });

  test('applies cta variant class correctly', () => {
    render(<Button variant="cta">CTA Button</Button>);
    const button = screen.getByRole('button', { name: /cta button/i });
    expect(button).toHaveStyle(`background: var(--secondary)`);
  });

  test('applies size variants correctly', () => {
    const { rerender } = render(<Button size="small">Small Button</Button>);
    let button = screen.getByRole('button', { name: /small button/i });
    expect(button).toHaveStyle(`padding: 0.6rem 1.5rem`);

    rerender(<Button size="large">Large Button</Button>);
    button = screen.getByRole('button', { name: /large button/i });
    expect(button).toHaveStyle(`padding: 1.2rem 2.5rem`);
  });

  test('renders as a link when "to" prop is provided', () => {
    renderWithRouter(<Button to="/test-route">Link Button</Button>);
    
    const linkButton = screen.getByRole('link', { name: /link button/i });
    expect(linkButton).toBeInTheDocument();
    expect(linkButton.getAttribute('href')).toBe('/test-route');
  });

  test('renders as an anchor when "href" prop is provided', () => {
    render(<Button href="https://example.com">External Link</Button>);
    
    const linkButton = screen.getByRole('link', { name: /external link/i });
    expect(linkButton).toBeInTheDocument();
    expect(linkButton.getAttribute('href')).toBe('https://example.com');
    expect(linkButton.getAttribute('target')).toBe('_blank');
    expect(linkButton.getAttribute('rel')).toBe('noopener noreferrer');
  });

  test('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Handler</Button>);
    
    const button = screen.getByRole('button', { name: /click handler/i });
    await userEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('sets disabled state correctly', () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        Disabled Button
      </Button>
    );
    
    const button = screen.getByRole('button', { name: /disabled button/i });
    expect(button).toBeDisabled();
    
    // Verify that clicking a disabled button doesn't trigger the handler
    userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('renders with icon children correctly', () => {
    render(
      <Button>
        <svg data-testid="test-icon" />
        With Icon
      </Button>
    );
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText('With Icon')).toBeInTheDocument();
  });

  test('applies custom className correctly', () => {
    render(<Button className="custom-class">Custom Class Button</Button>);
    
    const button = screen.getByRole('button', { name: /custom class button/i });
    expect(button).toHaveClass('custom-class');
  });

  test('forwards additional props to the button element', () => {
    render(
      <Button data-testid="extra-props" aria-label="Special Button">
        Extra Props
      </Button>
    );
    
    const button = screen.getByTestId('extra-props');
    expect(button).toHaveAttribute('aria-label', 'Special Button');
  });
});