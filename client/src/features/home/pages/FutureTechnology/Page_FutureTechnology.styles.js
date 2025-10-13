import styled from 'styled-components';
import { Stack } from '../../../../components/ui/primitives';

export const Container = styled(Stack)`
  gap: ${({ theme }) => theme.spacing(20)};
`;
