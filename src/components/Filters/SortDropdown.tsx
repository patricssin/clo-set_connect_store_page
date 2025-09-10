import React from 'react';
import styled from '@emotion/styled';
import { updateSortBy } from '../../store/slices/filterSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

const DropdownContainer = styled.div`
  position: relative;
  min-width: 200px;
`;

const DropdownSelect = styled.select`
  width: 100%;
  padding: 10px 15px;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  background-color: white;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  appearance: none;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
  
  &:hover {
    border-color: #b0b0b0;
  }
`;

const DropdownIcon = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #666;
`;

const DropdownLabel = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

interface SortOption {
  value: 'name' | 'price_high' | 'price_low';
  label: string;
}

const sortOptions: SortOption[] = [
  { value: 'name', label: 'Item Name' },
  { value: 'price_high', label: 'Higher Price' },
  { value: 'price_low', label: 'Lower Price' },
];

const SortDropdown: React.FC = () => {
  const dispatch = useAppDispatch();
  const sortBy = useAppSelector((state) => state.filter.sortBy);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortBy = event.target.value as 'name' | 'price_high' | 'price_low';
    dispatch(updateSortBy(newSortBy));
  };

  return (
    <DropdownContainer>
      <DropdownLabel htmlFor="sort-dropdown">Sort By</DropdownLabel>
      <DropdownSelect
        id="sort-dropdown"
        value={sortBy}
        onChange={handleSortChange}
        aria-label="Sort items"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </DropdownSelect>
      <DropdownIcon>
        <svg
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1.5L6 6.5L11 1.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </DropdownIcon>
    </DropdownContainer>
  );
};

export default React.memo(SortDropdown);