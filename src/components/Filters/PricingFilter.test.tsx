import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PricingFilter from './PricingFilter';
import { updatePricingOption } from '../../store/slices/filterSlice';
import { useQueryParams } from '../../hooks/useQueryParams';
import { ThemeProvider } from '@emotion/react';
import { theme } from '../../App';

// Mock dependencies
jest.mock('../../store/slices/filterSlice', () => ({
  updatePricingOption: jest.fn().mockReturnValue({ 
    type: 'filter/updatePricingOption',
    payload: { option: 'Paid', value: true }
  }),
}));

jest.mock('../../hooks/useQueryParams', () => ({
  useQueryParams: jest.fn(),
}));

jest.mock('../../utils/filterUtils', () => ({
  princinOptMapping: ['Paid', 'Free', 'ViewOnly'],
}));

const mockUpdatePricingOption = updatePricingOption as jest.MockedFunction<typeof updatePricingOption>;
const mockUseQueryParams = useQueryParams as jest.MockedFunction<typeof useQueryParams>;
const mockSetParam = jest.fn();

describe('PricingFilter', () => {
  const createStore = (pricingOptions = { Paid: false, Free: false, ViewOnly: false }) => {
    return configureStore({
      reducer: {
        filter: () => ({
          pricingOptions,
          searchKeyword: '',
          sortBy: 'name',
          priceRange: [0, 999],
        }),
      },
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseQueryParams.mockReturnValue({
      params: {},
      setParam: mockSetParam,
      setMultipleParams: jest.fn(),
      clearParams: jest.fn(),
      hasParams: false,
    });
    mockUpdatePricingOption.mockImplementation((payload) => ({ 
      type: 'filter/updatePricingOption', 
      payload 
    }));
  });

  const renderComponent = (store = createStore()) => {
    return render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <PricingFilter />
        </Provider>
      </ThemeProvider>
    );
  };

  it('should render all pricing options with labels', () => {
    renderComponent();

    expect(screen.getByText('Pricing Option')).toBeInTheDocument();
    expect(screen.getByLabelText('Paid')).toBeInTheDocument();
    expect(screen.getByLabelText('Free')).toBeInTheDocument();
    expect(screen.getByLabelText('View Only')).toBeInTheDocument();
  });

  it('should display correct initial checked states', () => {
    const store = createStore({ Paid: true, Free: false, ViewOnly: true });
    renderComponent(store);

    const paidCheckbox = screen.getByLabelText('Paid') as HTMLInputElement;
    const freeCheckbox = screen.getByLabelText('Free') as HTMLInputElement;
    const viewOnlyCheckbox = screen.getByLabelText('View Only') as HTMLInputElement;

    expect(paidCheckbox.checked).toBe(true);
    expect(freeCheckbox.checked).toBe(false);
    expect(viewOnlyCheckbox.checked).toBe(true);
  });

  it('should call updatePricingOption and setParam when checkbox is clicked', () => {
    renderComponent();

    const paidCheckbox = screen.getByLabelText('Paid');
    fireEvent.click(paidCheckbox);

    expect(mockUpdatePricingOption).toHaveBeenCalledWith({
      option: 'Paid',
      value: true, // from false to true
    });
    expect(mockSetParam).toHaveBeenCalledWith('pricingOptions', '0');
  });

  it('should handle multiple option selections', () => {
    const store = createStore({ Paid: true, Free: false, ViewOnly: false });
    renderComponent(store);

    // Click Free checkbox
    const freeCheckbox = screen.getByLabelText('Free');
    fireEvent.click(freeCheckbox);

    expect(mockUpdatePricingOption).toHaveBeenCalledWith({
      option: 'Free',
      value: true,
    });
    expect(mockSetParam).toHaveBeenCalledWith('pricingOptions', '0+1');
  });

  it('should handle option deselection', () => {
    const store = createStore({ Paid: true, Free: true, ViewOnly: false });
    renderComponent(store);

    const paidCheckbox = screen.getByLabelText('Paid');
    fireEvent.click(paidCheckbox);

    expect(mockUpdatePricingOption).toHaveBeenCalledWith({
      option: 'Paid',
      value: false, // from true to false
    });
    expect(mockSetParam).toHaveBeenCalled();
  });

  it('should handle all options selected', () => {
    const store = createStore({ Paid: true, Free: true, ViewOnly: true });
    renderComponent(store);

    const paidCheckbox = screen.getByLabelText('Paid') as HTMLInputElement;
    const freeCheckbox = screen.getByLabelText('Free') as HTMLInputElement;
    const viewOnlyCheckbox = screen.getByLabelText('View Only') as HTMLInputElement;

    expect(paidCheckbox.checked).toBe(true);
    expect(freeCheckbox.checked).toBe(true);
    expect(viewOnlyCheckbox.checked).toBe(true);
  });

  it('should handle no options selected', () => {
    const store = createStore({ Paid: false, Free: false, ViewOnly: false });
    renderComponent(store);

    const paidCheckbox = screen.getByLabelText('Paid') as HTMLInputElement;
    const freeCheckbox = screen.getByLabelText('Free') as HTMLInputElement;
    const viewOnlyCheckbox = screen.getByLabelText('View Only') as HTMLInputElement;

    expect(paidCheckbox.checked).toBe(false);
    expect(freeCheckbox.checked).toBe(false);
    expect(viewOnlyCheckbox.checked).toBe(false);
  });

  it('should update URL param correctly for various combinations', () => {
    const store = createStore({ Paid: true, Free: false, ViewOnly: true });
    renderComponent(store);

    expect(mockSetParam).not.toHaveBeenCalled(); 

    const freeCheckbox = screen.getByLabelText('Free');
    fireEvent.click(freeCheckbox);

    expect(mockSetParam).toHaveBeenCalledWith('pricingOptions', '0+1+2');
  });

  it('should work with different initial URL params', () => {
    mockUseQueryParams.mockReturnValue({
      params: { pricingOptions: '0+1' },
      setParam: mockSetParam,
      setMultipleParams: jest.fn(),
      clearParams: jest.fn(),
      hasParams: true,
    });

    renderComponent();

    expect(screen.getByText('Pricing Option')).toBeInTheDocument();
  });
});