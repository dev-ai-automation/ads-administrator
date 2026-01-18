import { render, screen, fireEvent } from '@testing-library/react';
import { Card } from '../Card';

describe('Card', () => {
  it('renders content', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('handles onClick', () => {
    const handleClick = jest.fn();
    render(<Card onClick={handleClick}>Clickable Card</Card>);
    
    fireEvent.click(screen.getByText('Clickable Card'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('has button role when clickable', () => {
    render(<Card onClick={() => {}}>Clickable</Card>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
