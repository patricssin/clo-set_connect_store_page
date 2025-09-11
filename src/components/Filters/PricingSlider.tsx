import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updatePriceRange } from '../../store/slices/filterSlice';
import { useQueryParams } from '../../hooks/useQueryParams';

const SliderContainer = styled.div<{ disabled: boolean }>`
  width: 35%;
  @media (max-width: 768px) {
    width: 75%;
  }

  max-width: 300px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  opacity: ${props => props.disabled ? 0.6 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'all'};
  transition: all 0.3s ease;
`;

const PriceValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #c2bebe;
  min-width: 60px;
  text-align: center;
`;

const SliderWrapper = styled.div`
  position: relative;
  height: 30px;
  margin: 20px 10px;
  width: 70%;
`;

const SliderTrack = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 6px;
  background-color: #e9ecef;
  transform: translateY(-50%);
  border-radius: 3px;
`;

const SliderRange = styled.div<{ left: number; right: number }>`
  position: absolute;
  top: 50%;
  left: ${props => props.left}%;
  right: ${props => 100 - props.right}%;
  height: 6px;
  background: linear-gradient(90deg, #007bff, #0056b3);
  transform: translateY(-50%);
  border-radius: 3px;
  z-index: 2;
`;

const ThumbContainer = styled.div<{ position: number, zIndex: number }>`
  position: absolute;
  top: 50%;
  left: ${props => props.position}%;
  transform: translate(-50%, -50%);
  z-index: ${props => props.zIndex || 3};
  cursor: pointer;
  touch-action: none;
`;

const Thumb = styled.div<{ isDragging: boolean }>`
  width: 14px;
  height: 14px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
  transition: all 0.2s ease;
  transform: ${props => props.isDragging ? 'scale(1.2)' : 'scale(1)'};
  
  &:hover {
    transform: scale(1.15);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
  }
`;


interface DragState {
  isDragging: boolean;
  thumbType: 'min' | 'max' | null;
  startX: number;
  startValue: number;
}

const PriceSlider: React.FC = () => {
  const dispatch = useAppDispatch();
  const { pricingOptions, priceRange } = useAppSelector((state) => state.filter);
  const [minValue, setMinValue] = useState(priceRange[0]);
  const [maxValue, setMaxValue] = useState(priceRange[1]);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    thumbType: null,
    startX: 0,
    startValue: 0
  });
  const sliderRef = useRef<HTMLDivElement>(null);
  const { setParam } = useQueryParams(); 

  const isEnabled = pricingOptions.Paid;
  const minPrice = 0;
  const maxPrice = 999;

  useEffect(() => {
    setMinValue(priceRange[0]);
    setMaxValue(priceRange[1]);
  }, [priceRange]);

  //calculation
  const getPosition = useCallback((value: number) => {
    return ((value - minPrice) / (maxPrice - minPrice)) * 100;
  }, [minPrice, maxPrice]);

  const getValueFromPosition = useCallback((position: number) => {
    return Math.round(minPrice + (position / 100) * (maxPrice - minPrice));
  }, [minPrice, maxPrice]);

  //event handlers
  const handleStartDrag = useCallback((thumbType: 'min' | 'max', clientX: number) => {
    if (!isEnabled) return;

    const startValue = thumbType === 'min' ? minValue : maxValue;
    setDragState({
      isDragging: true,
      thumbType,
      startX: clientX,
      startValue
    });
  }, [isEnabled, minValue, maxValue]);

  const handleDrag = useCallback((clientX: number) => {
    if (!dragState.isDragging || !dragState.thumbType || !sliderRef.current) return;

    const sliderRect = sliderRef.current.getBoundingClientRect();
    const sliderWidth = sliderRect.width;
    const moveX = clientX - dragState.startX;
    const movePercent = (moveX / sliderWidth) * 100;
    
    const newValue = getValueFromPosition(
      getPosition(dragState.startValue) + movePercent
    );
    // Clamp values and ensure min < max
    if (dragState.thumbType === 'min') {
      const clampedValue = Math.min(Math.max(newValue, minPrice), maxValue - 1);
      setMinValue(clampedValue);
    } else {
      const clampedValue = Math.max(Math.min(newValue, maxPrice), minValue + 1);
      setMaxValue(clampedValue);
    }
  }, [dragState, minPrice, maxPrice, minValue, maxValue, getPosition, getValueFromPosition]);

  const handleEndDrag = useCallback(() => {
    if (dragState.isDragging) {
      setDragState(prev => ({ ...prev, isDragging: false }));
      dispatch(updatePriceRange([minValue, maxValue]));
      setParam('priceRange', `${minValue}+${maxValue}`);
    }
  }, [dragState.isDragging, minValue, maxValue, dispatch]);
  // Add event listeners for mouse/touch move and up
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleDrag(e.clientX);
    const handleMouseUp = () => handleEndDrag();
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleDrag(e.touches[0].clientX);
      }
    };
    const handleTouchEnd = () => handleEndDrag();

    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [dragState.isDragging, handleDrag, handleEndDrag]);

  const minPosition = getPosition(minValue);
  const maxPosition = getPosition(maxValue);

  return (
    <SliderContainer disabled={!isEnabled}>
      <PriceValue>${minValue}</PriceValue>

      <SliderWrapper ref={sliderRef}>
        <SliderTrack />
        <SliderRange left={minPosition} right={maxPosition} />
        
        <ThumbContainer
          position={minPosition}
          onMouseDown={(e) => handleStartDrag('min', e.clientX)}
          onTouchStart={(e) => handleStartDrag('min', e.touches[0].clientX)}
          zIndex={(dragState.thumbType === 'min' && Math.abs(maxValue - minValue)<5) ? 4 : 3}
        >
          <Thumb data-testid='min-thumb' isDragging={dragState.isDragging && dragState.thumbType === 'min'} />
        </ThumbContainer>

        <ThumbContainer
          position={maxPosition}
          onMouseDown={(e) => handleStartDrag('max', e.clientX)}
          onTouchStart={(e) => handleStartDrag('max', e.touches[0].clientX)}
          zIndex={(dragState.thumbType === 'max' && Math.abs(maxValue - minValue)<5) ? 4 : 3}
        >
          <Thumb data-testid='max-thumb' isDragging={dragState.isDragging && dragState.thumbType === 'max'} />
        </ThumbContainer>
      </SliderWrapper>

      <PriceValue>${maxValue}</PriceValue>
    </SliderContainer>
  );
};

export default React.memo(PriceSlider);