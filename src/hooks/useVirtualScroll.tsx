import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const useVirtualScroll = (itemHeight: number, gridGap: number, columnCount: number, itemCount: number) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });
  const requestRef = useRef<number>();
  const previousScrollTop = useRef(0);
  
  const totalRows = Math.ceil(itemCount / columnCount);
  const rowHeight = itemHeight + gridGap;
  
  const updateVisibleRange = useCallback(() => {
    if (!containerRef.current) return;
    
    const scrollTop = containerRef.current.scrollTop;
    const containerHeight = containerRef.current.clientHeight;
    
    const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - 1);
    const endRow = Math.min(
      totalRows - 1,
      Math.ceil((scrollTop + containerHeight) / rowHeight) + 1
    );
    
    const startIdx = Math.max(0, startRow * columnCount);
    const endIdx = Math.min(itemCount, (endRow + 1) * columnCount);
    
    setVisibleRange({ start: startIdx, end: endIdx });
    
    previousScrollTop.current = scrollTop;
  }, [rowHeight, totalRows, columnCount, itemCount]);
  
  const animate = useCallback(() => {
    updateVisibleRange();
    requestRef.current = requestAnimationFrame(animate);
  }, [updateVisibleRange]);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    updateVisibleRange();
    
    requestRef.current = requestAnimationFrame(animate);
    
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateVisibleRange, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [animate, updateVisibleRange]);
  
  return { containerRef, visibleRange };
};