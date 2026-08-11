import styled from 'styled-components';
import { Spinner } from './Spinner';

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xxl} 0;
  min-height: 300px;
`;

const LoadingText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export function Loading({ text = 'Loading...' }) {
  return (
    <LoadingWrapper>
      <Spinner size="32px" />
      <LoadingText>{text}</LoadingText>
    </LoadingWrapper>
  );
}
