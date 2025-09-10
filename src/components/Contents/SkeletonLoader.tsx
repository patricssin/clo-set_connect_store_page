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
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const SkeletonImage = styled.div`
  width: 100%;
  height: 260px;
  background: linear-gradient(90deg, #f0f0f0 0px, #e8e8e8 40px, #f0f0f0 80px);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite linear;
`;

const SkeletonContent = styled.div`
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SkeletonLine = styled.div<{ width?: string; height?: string }>`
  height: ${props => props.height || '12px'};
  width: ${props => props.width || '100%'};
  border-radius: 4px;
  background: linear-gradient(90deg, #f0f0f0 0px, #e8e8e8 40px, #f0f0f0 80px);
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
    <SkeletonContainer>
      <SkeletonImage />
      <SkeletonContent>
        <SkeletonLine width="40%" height="10px" />
        <SkeletonLine height="16px" />
        <SkeletonLine height="14px" />
        <SkeletonLine width="60%" height="14px" />
        <SkeletonPricing>
          <SkeletonLine width="80px" height="20px" />
          <SkeletonLine width="60px" height="20px" />
        </SkeletonPricing>
      </SkeletonContent>
    </SkeletonContainer>
  );
};

export default SkeletonLoader;