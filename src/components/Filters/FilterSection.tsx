import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { resetFilters } from '../../store/slices/filterSlice';
import PricingFilter from './PricingFilter';
// import SortDropdown from './SortDropdown';
// import PriceSlider from './PriceSlider';
import styled from '@emotion/styled';
import SearchInput from './SearchInput';
import { useQueryParams } from '../../hooks/useQueryParams';

const FilterContainer = styled.div`
  margin-bottom: 30px;
  padding: 4px 10px;  
  background-color:  ${({theme}) => theme.dark.backgroundColor};
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: ${({theme}) => theme.dark.textColor};
`;

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
  // margin-bottom: 10px;
`;

const ResetButton = styled.button`
  padding: 5px;
  background-color:transparent;
  font-size: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 700;
  transition: background-color 0.2s;
  color: ${({theme}) => theme.dark.textColor};

  &:hover {
    background-color:rgb(146, 143, 144);
    color: white;
  }
`;

const FilterSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const { setParam } = useQueryParams();

  const handleReset = () => {
    dispatch(resetFilters());
    setParam('pricingOptions', '');
  };

  return (
    <>
      <SearchInput />
      <FilterContainer>
        <FilterRow>
          <PricingFilter />
          {/* TODO slider price */}
          <ResetButton onClick={handleReset}>RESET</ResetButton>
        </FilterRow>
      </FilterContainer>
    </>
  );
};

export default FilterSection;