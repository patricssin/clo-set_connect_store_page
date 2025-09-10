import { useEffect, useRef, useCallback } from 'react';
import { AppDispatch } from '../store';
import { loadMoreItems } from '../store/slices/contentSlice';
import { useAppDispatch } from '../store/hooks';

interface UseInfiniteScrollProps {
  loading: boolean;
  hasMore: boolean;
  threshold?: number;
}

export const useInfiniteScroll = ({ loading, hasMore, threshold = 1 }: UseInfiniteScrollProps) => {
  const dispatch = useAppDispatch();
  const observer = useRef<IntersectionObserver>();
  
  const lastItemRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    if (!node) { return; }

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        dispatch(loadMoreItems());
      }
    }, { threshold });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, dispatch, threshold]);
  
  useEffect(() => {
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);
  
  return [lastItemRef];
};