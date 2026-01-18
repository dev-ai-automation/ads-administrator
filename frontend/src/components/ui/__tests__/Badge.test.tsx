import { render, screen } from '@testing-library/react';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('renders content correctly', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders with default variant', () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText('Default')).toBeInTheDocument();
  });
});
