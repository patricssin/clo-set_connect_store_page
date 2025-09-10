import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updatePricingOption } from '../../store/slices/filterSlice';
import styled from '@emotion/styled';

const FilterGroupLabel = styled.div`
  margin-left: 10px;
  font-size: 12px
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
`;

const FilterLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  padding: 8px 5px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const CheckboxInput = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const PricingFilter: React.FC = () => {
  const dispatch = useAppDispatch();
  const { pricingOptions } = useAppSelector((state) => state.filter);

  const handleChange = (option: keyof typeof pricingOptions) => {
    dispatch(updatePricingOption({ 
      option, 
      value: !pricingOptions[option] 
    }));
  };

  return (
    <FilterGroup>
      <FilterGroupLabel>Pricing Option</FilterGroupLabel>

      <FilterLabel>
        <CheckboxInput
          type="checkbox"
          checked={pricingOptions.Paid}
          onChange={() => handleChange('Paid')}
        />
        Paid
      </FilterLabel>
      
      <FilterLabel>
        <CheckboxInput
          type="checkbox"
          checked={pricingOptions.Free}
          onChange={() => handleChange('Free')}
        />
        Free
      </FilterLabel>
      
      <FilterLabel>
        <CheckboxInput
          type="checkbox"
          checked={pricingOptions.ViewOnly}
          onChange={() => handleChange('ViewOnly')}
        />
        View Only
      </FilterLabel>
    </FilterGroup>
  );
};

export default PricingFilter;