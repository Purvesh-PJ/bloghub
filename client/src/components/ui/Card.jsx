import styled from 'styled-components';

const StyledCard = styled.div`
  background: ${({ theme }) => theme.colors?.bgSecondary || '#ffffff'};
  border-radius: ${({ theme }) => theme.radii?.lg || '12px'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#e5e7eb'};
  padding: ${({ $padding, theme }) => $padding || theme.spacing?.lg || '20px'};
  box-shadow: ${({ theme }) => theme.shadows?.sm || '0 1px 3px rgba(0, 0, 0, 0.05)'};
  transition: all 0.2s ease-in-out;

  ${({ $hoverable }) =>
    $hoverable &&
    `
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
  `}
`;

export function Card({ children, padding, hoverable = false, ...props }) {
  return (
    <StyledCard $padding={padding} $hoverable={hoverable} {...props}>
      {children}
    </StyledCard>
  );
}
