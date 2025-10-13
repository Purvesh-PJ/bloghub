import styled, { keyframes } from 'styled-components';
import { fadeIn } from '../../../../components/common/theme/animations';
import { Container as UiContainer, Grid as UiGrid } from '../../../../components/ui/primitives';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Container = styled(UiContainer)`
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.palette.background.surface};
  animation: ${fadeIn} 0.5s ease-out;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
`;

export const MainContent = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing(12)} ${theme.spacing(8)}`};

  @media (max-width: 768px) {
    padding: ${({ theme }) => `${theme.spacing(8)} ${theme.spacing(6)}`};
  }

  @media (max-width: 480px) {
    padding: ${({ theme }) => `${theme.spacing(6)} ${theme.spacing(4)}`};
  }
`;

export const SectionDivider = styled.div`
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(226, 232, 240, 0),
    rgba(226, 232, 240, 1),
    rgba(226, 232, 240, 0)
  );
  margin: 4rem 0;

  @media (max-width: 768px) {
    margin: 3rem 0;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing(8)};

  h2 {
    font-size: ${({ theme }) => theme.typography.size.h2};
    font-weight: ${({ theme }) => theme.typography.weight.bold};
    color: ${({ theme }) => theme.palette.text.primary};
    position: relative;

    &:after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 40px;
      height: 3px;
      background: linear-gradient(
        90deg,
        ${({ theme }) => theme.palette.primary.main},
        ${({ theme }) => theme.palette.primary.light}
      );
      border-radius: 2px;
    }
  }

  a {
    color: ${({ theme }) => theme.palette.primary.main};
    font-weight: 500;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: color 0.2s ease;

    &:hover {
      color: ${({ theme }) => theme.palette.primary.dark};
    }
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
  gap: 1.5rem;
  color: ${({ theme }) => theme.palette.text.secondary};

  .loader {
    width: 40px;
    height: 40px;
    border: 3px solid ${({ theme }) => theme.palette.grey[200]};
    border-bottom-color: ${({ theme }) => theme.palette.primary.main};
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
  }

  p {
    font-size: 1.125rem;
    font-weight: 500;
    margin: 0;
    letter-spacing: -0.01em;
  }
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
  gap: 1.5rem;
  color: ${({ theme }) => theme.palette.error.main};
  text-align: center;

  svg {
    font-size: 3rem;
  }

  h3 {
    font-size: 1.5rem;
    margin: 0;
    font-weight: 600;
  }

  p {
    font-size: 1.125rem;
    max-width: 600px;
    color: ${({ theme }) => theme.palette.text.secondary};
    line-height: 1.6;
  }
`;

export const StatsBar = styled(UiGrid)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing(6)};
  margin: ${({ theme }) => `${theme.spacing(12)} 0`};

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  background-color: ${({ theme }) => theme.palette.background.subtle};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing(6)};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.size.h1};
    font-weight: ${({ theme }) => theme.typography.weight.bold};
    margin: 0 0 0.5rem;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.palette.primary.main},
      ${({ theme }) => theme.palette.primary.light}
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    font-size: ${({ theme }) => theme.typography.size.sm};
    color: ${({ theme }) => theme.palette.text.secondary};
    margin: 0;
    font-weight: 500;
  }
`;
