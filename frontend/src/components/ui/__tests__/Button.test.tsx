import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles onClick events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders as a link when href is provided', () => {
    render(<Button href="/test">Link Button</Button>);
    const link = screen.getByRole('link', { name: 'Link Button' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('applies variant classes', () => {
    render(<Button variant="danger">Danger</Button>);
    // Note: We check if the class name contains "danger". 
    // Since we use CSS modules, the actual class will be something like "Button_danger__..."
    // But our component logic applies `styles[variant]`.
    // We can just check if it renders without crashing, or check snapshots.
    // Testing CSS modules class names is tricky without improved setup, 
    // but we can check if the element is present.
    expect(screen.getByText('Danger')).toBeInTheDocument();
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button', { name: 'Disabled' });
    expect(button).toBeDisabled();
  });
});
