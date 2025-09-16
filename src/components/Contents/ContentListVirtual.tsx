import React, { useCallback, useEffect, useRef, useMemo, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { loadMoreItems } from '../../store/slices/contentSlice';
import ContentItem from './ContentItem';
import styled from '@emotion/styled';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import SkeletonLoader from './SkeletonLoader';
import { useVirtualScroll } from '../../hooks/useVirtualScroll';
import { useDebouncedCallback } from '../../hooks/useDebouncedCallback';

const ScrollContainer = styled.div`
  height: 70vh;
  overflow-y: auto;
  margin-bottom: 40px;
  -webkit-overflow-scrolling: touch;
  
  @media (max-width: 768px) {
    height: 60vh;
  }
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
    
    &:hover {
      background: #a8a8a8;
    }
  }
`;

const VirtualContainer = styled.div<{ height: number }>`
  position: relative;
  height: ${props => props.height}px;
`;

const GridContainer = styled.div<{ columnCount: number; gridGap: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.columnCount}, 1fr);
  gap: ${props => props.gridGap}px;
`;

const GridItem = styled.div<{ itemHeight: number }>`
  height: ${props => props.itemHeight}px;
  min-height: ${props => props.itemHeight}px;
`;

const Placeholder = styled.div<{ height: number }>`
  height: ${props => props.height}px;
  background: transparent;
  pointer-events: none;
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px;
  grid-column: 1 / -1;
`;

const LoadingText = styled.div`
  color: #666;
  font-size: 14px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  grid-column: 1 / -1;

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
  grid-column: 1 / -1;
`;

const ContentListVirtual: React.FC = () => {
  const dispatch = useAppDispatch();
  const { displayedItems, loading, hasMore } = useAppSelector((state) => state.content);
  const [lastItemRef] = useInfiniteScroll({
    loading,
    hasMore,
    threshold: 0.1
  });
  
  const [columnCount, setColumnCount] = useState(4);
  const handleResize = () => {
    const width = window.innerWidth;
    
    if (width <= 500) setColumnCount(1);
    else if (width <= 768) setColumnCount(2);
    else if (width <= 1200) setColumnCount(3);
    else setColumnCount(4);
  };
  
  const debouncedResize = useDebouncedCallback(handleResize, 250);
  useEffect(() => {
    handleResize();

    window.addEventListener('resize', debouncedResize);
    return () => window.removeEventListener('resize', debouncedResize);
  }, []);
  const itemHeight = 300;
  const gridGap = columnCount === 1 ? 12 : columnCount === 2 ? 16 : 24;
  
  const { containerRef, visibleRange } = useVirtualScroll(
    itemHeight, 
    gridGap, 
    columnCount, 
    displayedItems.length
  );
  
  const totalHeight = useMemo(() => {
    if (displayedItems.length === 0) return 0;
    
    const totalRows = Math.ceil(displayedItems.length / columnCount);
    return totalRows * (itemHeight + gridGap) - gridGap;
  }, [displayedItems.length, columnCount, itemHeight, gridGap]);
  
  const { topPlaceholderHeight, bottomPlaceholderHeight } = useMemo(() => {
    if (displayedItems.length === 0) {
      return { topPlaceholderHeight: 0, bottomPlaceholderHeight: 0 };
    }
    
    const startRow = Math.floor(visibleRange.start / columnCount);
    const endRow = Math.ceil(visibleRange.end / columnCount);
    const totalRows = Math.ceil(displayedItems.length / columnCount);
    
    const topHeight = startRow * (itemHeight + gridGap);
    const bottomHeight = Math.max(0, (totalRows - endRow) * (itemHeight + gridGap));
    
    return { 
      topPlaceholderHeight: topHeight, 
      bottomPlaceholderHeight: bottomHeight 
    };
  }, [displayedItems.length, visibleRange, columnCount, itemHeight, gridGap]);
  
  useEffect(() => {
    if (displayedItems.length === 0 && hasMore && !loading) {
      dispatch(loadMoreItems());
    }
  }, [displayedItems.length, hasMore, loading, dispatch]);
  
  const visibleItems = useMemo(() => {
    const { start, end } = visibleRange;
    const actualEnd = Math.min(end, displayedItems.length);
    
    if (start >= actualEnd) return [];
    
    return displayedItems.slice(start, actualEnd).map((item, index) => {
      const globalIndex = start + index;
      const isLastItem = globalIndex === displayedItems.length - 1;
      
      return (
        <GridItem key={item.id} itemHeight={itemHeight}>
          <ContentItem
            item={item}
            ref={isLastItem ? lastItemRef : undefined}
          />
        </GridItem>
      );
    });
  }, [displayedItems, visibleRange, lastItemRef, itemHeight]);
  
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
      <ScrollContainer ref={containerRef}>
        <VirtualContainer height={totalHeight}>
          {topPlaceholderHeight > 0 && (
            <Placeholder height={topPlaceholderHeight} />
          )}
          
          <GridContainer columnCount={columnCount} gridGap={gridGap}>
            {visibleItems}
          </GridContainer>
          
          {bottomPlaceholderHeight > 0 && (
            <Placeholder height={bottomPlaceholderHeight} />
          )}
        </VirtualContainer>
        
        {loading && displayedItems.length === 0 && (
          <GridContainer columnCount={columnCount} gridGap={gridGap}>
            {Array.from({ length: Math.min(8, columnCount * 3) }).map((_, index) => (
              <GridItem key={`skeleton-${index}`} itemHeight={itemHeight}>
                <SkeletonLoader />
              </GridItem>
            ))}
          </GridContainer>
        )}
      </ScrollContainer>

      {loading && displayedItems.length > 0 && (
        <LoaderContainer>
          <LoadingText>Loading more items...</LoadingText>
        </LoaderContainer>
      )}

      <ObserverTarget />
    </>
  );
};

export default ContentListVirtual;