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
  const currentLoadingRef = useRef(loading);
  const currentHasMoreRef = useRef(hasMore);

  // 使用 ref 来跟踪最新的状态，避免回调函数中的闭包问题
  useEffect(() => {
    currentLoadingRef.current = loading;
    currentHasMoreRef.current = hasMore;
  }, [loading, hasMore]);

  const lastItemRef = useCallback((node: HTMLDivElement | null) => {
    // 如果正在加载，不创建观察器
    if (currentLoadingRef.current) {
      if (observer.current) {
        observer.current.disconnect();
        observer.current = undefined;
      }
      return;
    }

    // 断开之前的观察器
    if (observer.current) {
      observer.current.disconnect();
      observer.current = undefined;
    }

    // 如果没有更多内容或者没有节点，不创建观察器
    if (!currentHasMoreRef.current || !node) {
      return;
    }

    // 创建新的观察器
    observer.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !currentLoadingRef.current && currentHasMoreRef.current) {
          dispatch(loadMoreItems());
        }
      },
      { threshold }
    );

    observer.current.observe(node);
  }, [dispatch, threshold]);

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
        observer.current = undefined;
      }
    };
  }, []);

  return [lastItemRef];
};