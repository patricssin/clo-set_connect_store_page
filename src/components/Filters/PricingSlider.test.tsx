import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';
import PriceSlider from './PricingSlider';
import filterReducer from '../../store/slices/filterSlice';

// Mock the useQueryParams hook
jest.mock('../../hooks/useQueryParams', () => ({
  useQueryParams: () => ({
    setParam: jest.fn()
  })
}));

// Mock the store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      filter: filterReducer
    },
    preloadedState: {
      filter: {
        pricingOptions: {
          Paid: true,
          Free: false,
          ViewOnly: false
        },
        searchKeyword: '',
        sortBy: 'name' as const,
        priceRange: [0, 999] as [number, number],
        ...initialState
      }
    }
  });
};

describe('PriceSlider', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with correct initial values', () => {
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <PriceSlider />
      </Provider>
    );

    expect(screen.getByText('$0')).toBeInTheDocument();
    expect(screen.getByText('$999')).toBeInTheDocument();
  });

  test('disables slider when Paid option is not selected', () => {
    const store = createMockStore({
      pricingOptions: {
        Paid: false,
        Free: true,
        ViewOnly: false
      }
    });

    render(
      <Provider store={store}>
        <PriceSlider />
      </Provider>
    );

    const container = screen.getByText('$0').parentElement;
    expect(container).toHaveStyle('opacity: 0.6');
    expect(container).toHaveStyle('pointer-events: none');
  });

  test('enables slider when Paid option is selected', () => {
    const store = createMockStore({
      pricingOptions: {
        Paid: true,
        Free: false,
        ViewOnly: false
      }
    });

    render(
      <Provider store={store}>
        <PriceSlider />
      </Provider>
    );

    const container = screen.getByText('$0').parentElement;
    expect(container).toHaveStyle('opacity: 1');
    expect(container).toHaveStyle('pointer-events: all');
  });

  test('displays correct price values from Redux store', () => {
    const store = createMockStore({
      priceRange: [100, 500] as [number, number]
    });

    render(
      <Provider store={store}>
        <PriceSlider />
      </Provider>
    );

    expect(screen.getByText('$100')).toBeInTheDocument();
    expect(screen.getByText('$500')).toBeInTheDocument();
  });

  test('handles min thumb drag correctly', async () => {
    const store = createMockStore();
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <PriceSlider />
      </Provider>
    );

    const minThumb = screen.getByTestId('min-thumb');
    const sliderWrapper = minThumb.parentElement?.parentElement;

    // Mock getBoundingClientRect
    if (sliderWrapper) {
      sliderWrapper.getBoundingClientRect = jest.fn(() => ({
        width: 200,
        height: 30,
        top: 0,
        left: 0,
        right: 200,
        bottom: 30,
        x: 0,
        y: 0,
        toJSON: () => {}
      }));
    }

    // Start drag on min thumb
    fireEvent.mouseDown(minThumb, { clientX: 50 });
    
    // Drag to the right
    fireEvent.mouseMove(document, { clientX: 100 });
    
    // End drag
    fireEvent.mouseUp(document);

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'filter/updatePriceRange',
          payload: expect.any(Array)
        })
      );
    });
  });

  test('handles max thumb drag correctly', async () => {
    const store = createMockStore();
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <PriceSlider />
      </Provider>
    );

    const maxThumb = screen.getByTestId('max-thumb');
    const sliderWrapper = maxThumb.parentElement?.parentElement;

    // Mock getBoundingClientRect
    if (sliderWrapper) {
      sliderWrapper.getBoundingClientRect = jest.fn(() => ({
        width: 200,
        height: 30,
        top: 0,
        left: 0,
        right: 200,
        bottom: 30,
        x: 0,
        y: 0,
        toJSON: () => {}
      }));
    }

    // Start drag on max thumb
    fireEvent.mouseDown(maxThumb, { clientX: 150 });
    
    // Drag to the left
    fireEvent.mouseMove(document, { clientX: 100 });
    
    // End drag
    fireEvent.mouseUp(document);

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'filter/updatePriceRange',
          payload: expect.any(Array)
        })
      );
    });
  });

  // test('prevents min thumb from exceeding max thumb', async () => {
  //   const store = createMockStore({
  //     priceRange: [400, 500] as [number, number]
  //   });
  //   const dispatchSpy = jest.spyOn(store, 'dispatch');

  //   render(
  //     <Provider store={store}>
  //       <PriceSlider />
  //     </Provider>
  //   );

  //   const minThumb = screen.getAllByRole('slider')[0];
  //   const sliderWrapper = minThumb.parentElement?.parentElement;

  //   // Mock getBoundingClientRect
  //   if (sliderWrapper) {
  //     sliderWrapper.getBoundingClientRect = jest.fn(() => ({
  //       width: 200,
  //       height: 30,
  //       top: 0,
  //       left: 0,
  //       right: 200,
  //       bottom: 30,
  //       x: 0,
  //       y: 0,
  //       toJSON: () => {}
  //     }));
  //   }

  //   // Try to drag min thumb beyond max thumb
  //   fireEvent.mouseDown(minThumb, { clientX: 80 }); // Corresponds to $400
  //   fireEvent.mouseMove(document, { clientX: 120 }); // Try to drag to $600 (beyond max $500)
  //   fireEvent.mouseUp(document);

  //   await waitFor(() => {
  //     const action = dispatchSpy.mock.calls.find(call => 
  //       call[0].type === 'filter/updatePriceRange'
  //     );
      
  //     if (action) {
  //       const [min, max] = action[0].payload;
  //       expect(min).toBeLessThan(max); // Ensure min is always less than max
  //       expect(min).toBe(499); // Should be clamped to maxValue - 1
  //     }
  //   });
  // });

  // test('prevents max thumb from going below min thumb', async () => {
  //   const store = createMockStore({
  //     priceRange: [100, 200] as [number, number]
  //   });
  //   const dispatchSpy = jest.spyOn(store, 'dispatch');

  //   render(
  //     <Provider store={store}>
  //       <PriceSlider />
  //     </Provider>
  //   );

  //   const maxThumb = screen.getAllByRole('slider')[1];
  //   const sliderWrapper = maxThumb.parentElement?.parentElement;

  //   // Mock getBoundingClientRect
  //   if (sliderWrapper) {
  //     sliderWrapper.getBoundingClientRect = jest.fn(() => ({
  //       width: 200,
  //       height: 30,
  //       top: 0,
  //       left: 0,
  //       right: 200,
  //       bottom: 30,
  //       x: 0,
  //       y: 0,
  //       toJSON: () => {}
  //     }));
  //   }

  //   // Try to drag max thumb below min thumb
  //   fireEvent.mouseDown(maxThumb, { clientX: 40 }); // Corresponds to $200
  //   fireEvent.mouseMove(document, { clientX: 20 }); // Try to drag to $100 (below min $100)
  //   fireEvent.mouseUp(document);

  //   await waitFor(() => {
  //     const action = dispatchSpy.mock.calls.find(call => 
  //       call[0].type === 'filter/updatePriceRange'
  //     );
      
  //     if (action) {
  //       const [min, max] = action[0].payload;
  //       expect(min).toBeLessThan(max); // Ensure min is always less than max
  //       expect(max).toBe(101); // Should be clamped to minValue + 1
  //     }
  //   });
  // });

  test('handles touch events correctly', async () => {
    const store = createMockStore();
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <PriceSlider />
      </Provider>
    );

    const minThumb = screen.getByTestId('min-thumb');
    const sliderWrapper = minThumb.parentElement?.parentElement;

    // Mock getBoundingClientRect
    if (sliderWrapper) {
      sliderWrapper.getBoundingClientRect = jest.fn(() => ({
        width: 200,
        height: 30,
        top: 0,
        left: 0,
        right: 200,
        bottom: 30,
        x: 0,
        y: 0,
        toJSON: () => {}
      }));
    }

    // Simulate touch events
    fireEvent.touchStart(minThumb, {
      touches: [{ clientX: 50 }]
    });
    
    fireEvent.touchMove(document, {
      touches: [{ clientX: 100 }]
    });
    
    fireEvent.touchEnd(document);

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'filter/updatePriceRange',
          payload: expect.any(Array)
        })
      );
    });
  });

  test('does not handle drag when disabled', () => {
    const store = createMockStore({
      pricingOptions: {
        Paid: false,
        Free: true,
        ViewOnly: false
      }
    });
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <PriceSlider />
      </Provider>
    );

    const minThumb = screen.getByTestId('min-thumb');

    // Try to drag while disabled
    fireEvent.mouseDown(minThumb, { clientX: 50 });
    fireEvent.mouseMove(document, { clientX: 100 });
    fireEvent.mouseUp(document);

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  test('updates values correctly when props change', () => {
    const store = createMockStore({
      priceRange: [100, 200] as [number, number]
    });

    const { rerender } = render(
      <Provider store={store}>
        <PriceSlider />
      </Provider>
    );

    expect(screen.getByText('$100')).toBeInTheDocument();
    expect(screen.getByText('$200')).toBeInTheDocument();

    // Update store with new price range
    const newStore = createMockStore({
      priceRange: [300, 400] as [number, number]
    });

    rerender(
      <Provider store={newStore}>
        <PriceSlider />
      </Provider>
    );

    expect(screen.getByText('$300')).toBeInTheDocument();
    expect(screen.getByText('$400')).toBeInTheDocument();
  });
});