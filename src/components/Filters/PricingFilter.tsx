import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updatePricingOption } from '../../store/slices/filterSlice';
import styled from '@emotion/styled';
import { FilterState } from '../../types';
import { useQueryParams } from '../../hooks/useQueryParams';
import { princinOptMapping } from '../../utils/filterUtils';

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
  padding: 6px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({theme}) => theme.dark.hoverBgColor};
    color: white;
  }
`;

const CheckboxInput = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;

    &[type="checkbox"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #4a4848;
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease;

    &:checked {
      background-color: #2196F3;
      border-color: #2196F3;
         &::after {
        content: "✓";
        position: absolute;
        color: white;
        font-size: 14px;
        font-weight: bold;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
`;

const PricingFilter: React.FC = () => {
  const dispatch = useAppDispatch();
  const { pricingOptions } = useAppSelector((state) => state.filter);
  const { setParam } = useQueryParams();

  const handleChange = (option: keyof typeof pricingOptions) => {
    dispatch(updatePricingOption({ option, value: !pricingOptions[option] }));
    const _newoption = {...pricingOptions, [option]: !pricingOptions[option]};
    const updateParams = princinOptMapping.filter(opt => _newoption[opt as keyof FilterState['pricingOptions']]).map(param => princinOptMapping.indexOf(param)).join('+');
    setParam('pricingOptions', updateParams);
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