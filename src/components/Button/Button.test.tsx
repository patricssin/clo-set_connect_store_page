import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  test('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies correct variant styles', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    const button = screen.getByText('Primary');
    
    expect(button).toHaveStyle('background-color: #007bff');
    
    rerender(<Button variant="secondary">Secondary</Button>);
    expect(button).toHaveStyle('background-color: #6c757d');
  });
});