import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const SkeletonContainer = styled.div`
  background: white;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const SkeletonImage = styled.div`
  width: 100%;
  height: 340px;
  background: linear-gradient(90deg,rgb(210, 208, 208) 0px,rgb(213, 213, 213) 40px,rgb(214, 210, 210) 80px);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite linear;
`;

const SkeletonContent = styled.div`
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: ${({theme}) => theme.dark.appBgColor};
`;

const SkeletonLine = styled.div<{ width?: string; height?: string }>`
  height: ${props => props.height || '12px'};
  width: ${props => props.width || '100%'};
  border-radius: 4px;
  background: linear-gradient(90deg,rgb(147, 143, 143) 0px,rgb(146, 141, 141) 40px,rgb(137, 132, 132) 80px);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite linear;
`;

const SkeletonPricing = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const SkeletonLoader: React.FC = () => {
  return (
    <SkeletonContainer data-testid="skeleton-container">
      <SkeletonImage data-testid="skeleton-image" />
      <SkeletonContent data-testid="skeleton-content">
        <SkeletonLine width="60%" height="14px" data-testid="skeleton-line" />
        <SkeletonPricing  data-testid="skeleton-pricing">
          <SkeletonLine width="80px" height="20px" data-testid="skeleton-line" />
          <SkeletonLine width="60px" height="20px" data-testid="skeleton-line" />
        </SkeletonPricing>
      </SkeletonContent>
    </SkeletonContainer>
  );
};

export default SkeletonLoader;