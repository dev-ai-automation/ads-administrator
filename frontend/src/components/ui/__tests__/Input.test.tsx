import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../Input';

describe('Input', () => {
  it('renders correctly', () => {
    render(<Input placeholder="Test input" />);
    expect(screen.getByPlaceholderText('Test input')).toBeInTheDocument();
  });

  it('handles value changes', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} placeholder="Type here" />);
    
    const input = screen.getByPlaceholderText('Type here');
    fireEvent.change(input, { target: { value: 'New value' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('shows error state with accessibility attributes', () => {
    render(<Input error placeholder="Error input" />);
    const input = screen.getByPlaceholderText('Error input');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('can be disabled', () => {
    render(<Input disabled placeholder="Disabled" />);
    expect(screen.getByPlaceholderText('Disabled')).toBeDisabled();
  });

  it('forwards refs correctly', () => {
    const ref = { current: null };
    render(<Input ref={ref} placeholder="Ref input" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
