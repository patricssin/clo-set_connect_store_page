import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from '@emotion/styled';
import FilterSection from '../components/Filters/FilterSection';
import ContentList from '../components/Contents/ContentList';
import { applyContentFilters, fetchContents } from '../store/slices/contentSlice';
import { AppDispatch } from '../store';
import { useAppSelector } from '../store/hooks';

const Container = styled.div`
  padding: 20px;
  // max-width: 800px;
  margin: 0 auto;
`;

export const Content: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useAppSelector((state) => state.filter);

  useEffect(() => {
    dispatch(fetchContents());
  }, [dispatch]);
  
  useEffect(() => {
    console.log('====================================');
    console.log(filters);
    console.log('====================================');
    dispatch(applyContentFilters(filters));
  }, [dispatch, filters]);

  return (
    <Container>
      <FilterSection />
      {/* TODO sort by */}
      <ContentList />
    </Container>
  );
};