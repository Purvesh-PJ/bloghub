import styled from 'styled-components';
import breakpoints from '../components/common/theme/breakpoints';
import { Box } from '../components/ui/primitives';

export const Container = styled(Box)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${(p) => p.theme.palette.background.default};
  position: relative;
  border: 1px solid ${(p) => p.theme.palette.divider};
`;

export const MainContent = styled.main`
  flex: 1;
  width: 90%;
  margin: 0 auto;
  position: relative;
  border: 1px solid ${(p) => p.theme.palette.divider};
  background: ${(p) => p.theme.palette.background.default};
`;

export const ContentWrapper = styled.div`
  max-width: ${breakpoints.xl};
  margin: 0 auto;
  padding: ${(p) => p.theme.spacing(6)} ${(p) => p.theme.spacing(4)};

  @media (max-width: ${breakpoints.desktop}) {
    padding: ${(p) => p.theme.spacing(5)} ${(p) => p.theme.spacing(3)};
  }

  @media (max-width: ${breakpoints.tablet}) {
    padding: ${(p) => p.theme.spacing(4)} ${(p) => p.theme.spacing(2)};
  }
`;
