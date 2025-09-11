import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SkeletonLoader from './SkeletonLoader'; 
import { ThemeProvider } from '@emotion/react';
import { theme } from '../../App';

describe('SkeletonLoader', () => {
  beforeEach(() => {
    render(
      <ThemeProvider theme={theme}>
        <SkeletonLoader />
      </ThemeProvider>
    );
  });

  test('render container', () => {
    const container = screen.getByTestId('skeleton-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveStyle('background: white');
    expect(container).toHaveStyle('border-radius: 5px');
  });

  test('render image', () => {
    const imagePlaceholder = screen.getByTestId('skeleton-image');
    expect(imagePlaceholder).toBeInTheDocument();
    expect(imagePlaceholder).toHaveStyle('height: 340px');
  });

  test('render content', () => {
    const contentArea = screen.getByTestId('skeleton-content');
    expect(contentArea).toBeInTheDocument();
  });

  test('render line', () => {
    const textLines = screen.getAllByTestId('skeleton-line');
    expect(textLines.length).toBe(3); 
    
    expect(textLines[0]).toHaveStyle('width: 60%');
    expect(textLines[0]).toHaveStyle('height: 14px');
  });

  test('render pricing', () => {
    const pricingArea = screen.getByTestId('skeleton-pricing');
    expect(pricingArea).toBeInTheDocument();
  });
});