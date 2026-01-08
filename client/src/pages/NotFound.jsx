import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft } from 'lucide-react';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - ${({ theme }) => theme.layout.headerHeight} - 100px);
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

const ErrorCode = styled.h1`
  font-size: 120px;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1;
  letter-spacing: ${({ theme }) => theme.letterSpacing.tighter};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 80px;
  }
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  max-width: 400px;
`;

const HomeButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  height: 44px;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.buttonPrimaryBg};
  color: ${({ theme }) => theme.colors.buttonPrimaryText};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  border-radius: ${({ theme }) => theme.radii.md};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.buttonPrimaryHover};
    color: ${({ theme }) => theme.colors.buttonPrimaryText};
  }
`;

export function NotFound() {
  return (
    <PageWrapper>
      <ErrorCode>404</ErrorCode>
      <Title>Page not found</Title>
      <Description>The page you're looking for doesn't exist or has been moved.</Description>
      <HomeButton to="/">
        <ArrowLeft size={16} /> Back to Home
      </HomeButton>
    </PageWrapper>
  );
}
