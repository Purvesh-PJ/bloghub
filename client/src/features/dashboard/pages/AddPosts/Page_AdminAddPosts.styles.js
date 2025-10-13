import styled from 'styled-components';
import { Stack } from '../../../../components/ui/primitives';

export const Container = styled.div``;

export const TopBarWrapper = styled.div`
  /* Reserved for future sticky top bar implementation */
`;

export const MainContainer = styled(Stack)`
  width: 98%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: ${({ theme }) => theme.spacing(16)};
  padding-top: ${({ theme }) => theme.spacing(4)};
  box-sizing: border-box;
`;
