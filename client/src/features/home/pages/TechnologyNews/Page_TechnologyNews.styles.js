import styled from 'styled-components';
import { Stack, Flex } from '../../../../components/ui/primitives';

export const ParentWrapper = styled(Stack)`
  margin: ${({ theme }) => theme.spacing(25)};
`;

export const Container = styled(Flex)`
  gap: ${({ theme }) => theme.spacing(5)};
  align-items: center;
`;
