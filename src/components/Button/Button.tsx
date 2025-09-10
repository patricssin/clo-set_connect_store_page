import React from 'react';
import styled from '@emotion/styled';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

const StyledButton = styled.button<{ variant: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;

  ${({ variant }) =>
    variant === 'primary'
      ? `
          background-color: #007bff;
          color: white;
          &:hover {
            background-color: #0056b3;
          }
        `
      : `
          background-color: #6c757d;
          color: white;
          &:hover {
            background-color: #545b62;
          }
        `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  ...props
}) => {
  return (
    <StyledButton variant={variant} onClick={onClick} {...props}>
      {children}
    </StyledButton>
  );
};