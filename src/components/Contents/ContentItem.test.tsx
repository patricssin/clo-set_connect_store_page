import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ContentItem from './ContentItem';
import { ContentItem as ContentItemType } from '../../types';
import { ThemeProvider } from '@emotion/react';
import { theme } from '../../App';

describe('ContentItem', () => {
  const mockItem: ContentItemType = {
    id: '1',
    title: 'Test Content Item',
    creator: 'Test Creator',
    imagePath: '',
    pricingOption: 0 as 0 | 1 | 2,
    price: 29.99,
  };

  afterEach(() => {
    cleanup();
  });

  describe('basic rendering', () => {
    beforeEach(() => {
      render(
        <ThemeProvider theme={theme}>
          <ContentItem item={mockItem} />
        </ThemeProvider>
      );
    });

    it('should render title and creator', () => {
      expect(screen.getByText('Test Content Item')).toBeInTheDocument();
      expect(screen.getByText('Test Creator')).toBeInTheDocument();
    });

    it('should render image with correct attributes', () => {
      const image = screen.getByAltText('Test Content Item');
      expect(image).toHaveAttribute('src', '');
      expect(image).toHaveAttribute('alt', 'Test Content Item');
    });

    it('should render pricing information', () => {
      expect(screen.getByText('$29.99')).toBeInTheDocument();
    });
  });

  describe('pricing options', () => {
    it('should display paid price correctly', () => {
      render(
        <ThemeProvider theme={theme}>
          <ContentItem item={mockItem} />
        </ThemeProvider>
      );
      expect(screen.getByText('$29.99')).toBeInTheDocument();
    });

    it('should display FREE for free content', () => {
      const freeItem = { ...mockItem, pricingOption: 1 as 0|1|2, price: 0 };
      render(
        <ThemeProvider theme={theme}>
          <ContentItem item={freeItem} />
        </ThemeProvider>
      );
      expect(screen.getByText('FREE')).toBeInTheDocument();
    });

    it('should display View Only for view only content', () => {
      const viewOnlyItem = { ...mockItem, pricingOption: 2 as 0|1|2 };
      render(
        <ThemeProvider theme={theme}>
          <ContentItem item={viewOnlyItem} />
        </ThemeProvider>
      );
      expect(screen.getByText('View Only')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle decimal price formatting', () => {
      const decimalItem = { ...mockItem, price: 19.5 };
      render(
        <ThemeProvider theme={theme}>
          <ContentItem item={decimalItem} />
        </ThemeProvider>
      );
      expect(screen.getByText('$19.50')).toBeInTheDocument();
    });

    it('should handle missing price gracefully', () => {
      const noPriceItem = { ...mockItem, price: undefined as any };
      render(
        <ThemeProvider theme={theme}>
          <ContentItem item={noPriceItem} />
        </ThemeProvider>
      );
      expect(screen.getByText('Test Content Item')).toBeInTheDocument();
    });
  });

  it('should forward ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <ThemeProvider theme={theme}>
        <ContentItem item={mockItem} ref={ref} />
      </ThemeProvider>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});