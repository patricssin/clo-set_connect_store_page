import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import FilterSection from '../components/Filters/FilterSection';
import ContentList from '../components/Contents/ContentList';
import { applyContentFilters, fetchContents } from '../store/slices/contentSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useQueryParams } from '../hooks/useQueryParams';
import CustomSelect from '../components/Filters/CustomSelect';
import ContentListVirtual from '../components/Contents/ContentListVirtual';

const Container = styled.div`
  padding: 20px;
  margin: 0 auto;
`;

export const Content: React.FC = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filter);
  const { params } = useQueryParams();

  useEffect(() => {
    dispatch(Object.keys(params).length === 0 ? fetchContents({}): fetchContents(params));
   }, [dispatch]);
  
  useEffect(() => {
    dispatch(applyContentFilters(filters));
  }, [dispatch, filters]);

  return (
    <Container>
      <FilterSection />
      <CustomSelect />
      {/* <ContentList /> */}
      <ContentListVirtual />
    </Container>
  );
};