import React, { useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateSearchKeyword } from '../../store/slices/filterSlice';
import styled from '@emotion/styled';
import SearchIcon from './SearchIcon';

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 20px;
`;

const SearchInputField = styled.input`
  width: calc(100% - 30px);
  padding: 10px 10px 10px 15px;
  border: 2px solid #e1e5e9;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
  
  &::placeholder {
    color: #a0a0a0;
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #666;
  transition: color 0.2s ease;
  
  &:hover {
    color: #007bff;
    
    svg {
      fill: #007bff;
    }
  }
  
  &:focus {
    outline: none;
  }
`;

const SearchInput: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchKeyword = useAppSelector((state) => state.filter.searchKeyword);
  const [inputValue, setInputValue] = useState(searchKeyword);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleSearchClick = useCallback(() => {
    dispatch(updateSearchKeyword(inputValue.trim()));
  }, [dispatch, inputValue]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  }, [handleSearchClick]);

  return (
    <SearchContainer>
      <SearchInputField
        type="text"
        placeholder="Find the items you're looking for"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
      />
      
      <SearchButton onClick={handleSearchClick} aria-label="Search">
        <SearchIcon size={18} />
      </SearchButton>
    </SearchContainer>
  );
};

export default SearchInput;