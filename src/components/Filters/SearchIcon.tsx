import React from 'react';
import { css } from '@emotion/react';

interface SearchIconProps {
  size?: number;
  color?: string;
  className?: string;
}

const SearchIcon: React.FC<SearchIconProps> = ({ 
  size = 20, 
  color = 'currentColor',
  className 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      css={css`
        transition: fill 0.2s ease;
      `}
    >
      <path
        d="M8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C9.29583 14 10.4957 13.5892 11.4765 12.8907L16.2929 17.7071C16.6834 18.0976 17.3166 18.0976 17.7071 17.7071C18.0976 17.3166 18.0976 16.6834 17.7071 16.2929L12.8907 11.4765C13.5892 10.4957 14 9.29583 14 8C14 4.68629 11.3137 2 8 2ZM4 8C4 5.79086 5.79086 4 8 4C10.2091 4 12 5.79086 12 8C12 10.2091 10.2091 12 8 12C5.79086 12 4 10.2091 4 8Z"
        fill={color}
      />
    </svg>
  );
};

export default SearchIcon;