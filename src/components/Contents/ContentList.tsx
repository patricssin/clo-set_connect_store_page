import React, { useCallback, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { loadMoreItems } from '../../store/slices/contentSlice';
import ContentItem from './ContentItem';
import styled from '@emotion/styled';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import SkeletonLoader from './SkeletonLoader';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 40px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  // TODO one column under 480
  @media (max-width: 501px) {
    grid-template-columns: 1fr;
    // gap: 12px;
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px;
`;

const LoadingText = styled.div`
  color: #666;
  font-size: 14px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;

  h3 {
    margin-bottom: 8px;
    color: #333;
  }

  p {
    margin-bottom: 0;
  }
`;

const ObserverTarget = styled.div`
  height: 1px;
  width: 100%;
`;

const ContentList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { displayedItems, loading, hasMore } = useAppSelector((state) => state.content);
  const [lastItemRef] = useInfiniteScroll({
    loading,
    hasMore,
    threshold: 0.1
  });

  useEffect(() => {
    if (displayedItems.length === 0 && hasMore && !loading) {
      dispatch(loadMoreItems());
    }
  }, [displayedItems.length, hasMore, loading, dispatch]);

  if (displayedItems.length === 0 && !loading) {
    return (
      <EmptyState>
        <h3>No items found</h3>
        <p>Try adjusting your filters or search terms.</p>
      </EmptyState>
    );
  }

  return (
    <>
      <GridContainer>
        {displayedItems.map((item, index) => {
          const isLastItem = index === displayedItems.length - 1;
          return (
            <ContentItem
              key={item.id}
              item={item}
              ref={isLastItem ? lastItemRef : undefined}
            />
          );
        })}
        
        {loading && Array.from({ length: 8 }).map((_, index) => (
          <SkeletonLoader key={`skeleton-${index}`} />
        ))}
      </GridContainer>

      {loading && (
        <LoaderContainer>
          <LoadingText>Loading more items...</LoadingText>
        </LoaderContainer>
      )}

      {!hasMore && displayedItems.length > 0 && (
        <LoaderContainer>
          <LoadingText>No more items to load</LoadingText>
        </LoaderContainer>
      )}

      <ObserverTarget />
    </>
  );
};

export default ContentList;