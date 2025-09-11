import React, { RefAttributes } from 'react';
import { ContentItem as ContentItemType } from '../../types';
import styled from '@emotion/styled';

const ItemContainer = styled.div`
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 350px;
  overflow: hidden;
  position: relative;
  border-radius: 5px;

    &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
`;

const ItemImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${ItemContainer}:hover & {
    transform: scale(1.05);
  }
`;

const ItemContent = styled.div`
  padding: 8px;
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UserName = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  font-weight: 500;
  color: ${({theme}) => theme.dark.textColor};
`;

const Title = styled.h5`
  font-size: 16px;
  font-weight: 600;
  margin: 6px 0;
  color: ${({theme}) => theme.dark.titleColor};
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CreaterInfo = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
`;

const PricingInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({theme}) => theme.dark.titleColor};

`;

const PricingOption = styled.span<{ type: 0|1|2 }>`
  font-size: 24px;
  font-weight: 600;
  border-radius: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

interface ContentItemProps {
  item: ContentItemType;
  ref?: React.Ref<HTMLDivElement>;
}

const ContentItem = React.forwardRef<HTMLDivElement, ContentItemProps>(
  ({ item }, ref) => {
  const priceText = item.pricingOption === 0 ? `$${item.price.toFixed(2)}` : item.pricingOption === 1 ? 'FREE' : 'View Only';

  return (
    <ItemContainer ref={ref}>
      <ImageContainer>
        <ItemImage
          src={item.imagePath}
          alt={item.title}
        />
      </ImageContainer>
      
      <ItemContent>
        <CreaterInfo>
          <Title>{item.title}</Title>
          <UserName>{item.creator}</UserName>
        </CreaterInfo>
        
        <PricingInfo>
          <PricingOption type={item.pricingOption}>
            {priceText}
          </PricingOption>
        </PricingInfo>
      </ItemContent>
    </ItemContainer>
    );
  })


ContentItem.displayName = 'ContentItem';

export default ContentItem;