import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { resetFilters } from '../../store/slices/filterSlice';
import PricingFilter from './PricingFilter';
// import SortDropdown from './SortDropdown';
// import PriceSlider from './PriceSlider';
import styled from '@emotion/styled';
import SearchInput from './SearchInput';

const FilterContainer = styled.div`
  margin-bottom: 30px;
  padding: 4px 10px;  
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  background-color:rgb(146, 143, 144);
  font-size: 10px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color:#007bff;
  }
`;

const FilterSection: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleReset = () => {
    dispatch(resetFilters());
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