import React, { useState, useRef, useEffect } from 'react';
import { updateSortBy } from '../../store/slices/filterSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import styled from '@emotion/styled';
import { useQueryParams } from '../../hooks/useQueryParams';

interface SortOption {
  value: 'name' | 'price_high' | 'price_low';
  label: string;
}

const sortOptions: SortOption[] = [
  { value: 'name', label: 'Item Name' },
  { value: 'price_high', label: 'Higher Price' },
  { value: 'price_low', label: 'Lower Price' },
];

const DropdownContainer = styled.div`
  position: relative;
  min-width: 200px;
  margin: 20px 0;
  display:flex;
  align-items: center;
  flex-direction: row-reverse;
`;

const DropdownButton = styled.button<{ isOpen: boolean }>`
  position: relative;
  padding: 3px 5px;
  width: 150px;
  border: 0;
  border-bottom: 1px solid white;
  background-color: transparent;
  font-size: 11px;
  color: #d6d2d2;
  cursor: pointer;
  text-align: left;
  font-weight: 500;
  transition: all 0.2s ease;
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #9a9696;
  border: 1px solidrgb(177, 174, 174);
  border-radius: 4px;
  margin-top: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: translateY(${props => props.isOpen ? '0' : '-10px'});
  transition: all 0.2s ease;
`;

const DropdownItem = styled.button<{ isSelected: boolean }>`
  width: 100%;
  padding: 6px 8px;
  border: none;
  background: ${props => props.isSelected ? '#dae5ec' : 'transparent'};
  color: ${props => props.isSelected ? '#007bff' : '#333'};
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.isSelected ? '#e3f2fd' : '#d6dfe7'};
  }
  
  &:first-of-type {
    border-radius: 4px 4px 0 0;
  }
  
  &:last-of-type {
    border-radius: 0 0 4px 4px;
  }
`;

const ItemLabel = styled.span`
  flex: 1;
`;

const DropdownIcon = styled.div`
  position: absolute;
  width: 16px;
  height: 16px;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  fill: currentColor;
  color: #FFF;
  transition: transform 0.2s ease;
`;

const DropdownLabel = styled.label`
  display: block;
  margin-right: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #FFF;
  letter-spacing: 0.5px;
`;

const CustomSelectDropdown: React.FC = () => {
  const dispatch = useAppDispatch();
  const sortBy = useAppSelector((state) => state.filter.sortBy);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLButtonElement>(null);
  const { setParam } = useQueryParams();  

  const selectedOption = sortOptions.find(option => option.value === sortBy) || sortOptions[0];

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option: SortOption) => {
    dispatch(updateSortBy(option.value));
    setParam('sortBy', encodeURIComponent(option.value));
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <DropdownContainer >
      <DropdownButton
        ref={dropdownRef}
        isOpen={isOpen}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <ItemLabel>{selectedOption.label}</ItemLabel>

        <DropdownMenu isOpen={isOpen} role="listbox">
          {sortOptions.map((option) => (
            <DropdownItem
              key={option.value}
              isSelected={option.value === sortBy}
              onClick={() => handleSelect(option)}
              role="option"
              aria-selected={option.value === sortBy}
            >
              <ItemLabel>{option.label}</ItemLabel>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </DropdownButton>
      
      <DropdownIcon>
        <svg viewBox="0 0 24 24" color="#FFF"><path d="M12 15.5L5 8.5H19L12 15.5Z"></path></svg>
      </DropdownIcon>

      <DropdownLabel>Sort By</DropdownLabel>
    </DropdownContainer>
  );
};

export default React.memo(CustomSelectDropdown);