import React, { useState, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateSearchKeyword } from '../../store/slices/filterSlice';
import styled from '@emotion/styled';
import SearchIcon from './SearchIcon';
import { useDebouncedCallback } from '../../hooks/useDebouncedCallback';
import { useQueryParams } from '../../hooks/useQueryParams';

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 20px;
`;

const SearchInputField = styled.input`
  width: calc(100% - 30px);
  padding: 10px 10px 10px 15px;
  border: 0;
  border-radius: 4px;
  font-size: 14px;
  background-color: #424141;
  color: #E7E7E8;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
  
  &::placeholder {
    color: ${({theme}) => theme.dark.textColor};
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
  color: #f1ecec;
  transition: color 0.2s ease;
  
  &:focus {
    outline: none;
  }
`;

const SearchInput: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchKeyword = useAppSelector((state) => state.filter.searchKeyword);
  const inputValRef = useRef<HTMLInputElement | null>(null)
  const { setParam } = useQueryParams();

  const debouncedSearchUpdate = useDebouncedCallback((searchValue: string) => {
    const _updateK = searchValue.trim()
    dispatch(updateSearchKeyword(_updateK));
    setParam('searchKeyword', encodeURIComponent(_updateK));
  }, 500);
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearchUpdate(e.target.value);
  }, []);

  const handleSearchClick = useCallback(() => {
    dispatch(updateSearchKeyword(inputValRef.current?.value?.trim()!));
  }, [dispatch]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  }, [handleSearchClick]);

  return (
    <SearchContainer>
      <SearchInputField
        ref={inputValRef}
        type="text"
        placeholder="Find the items you're looking for"
        defaultValue={searchKeyword}
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