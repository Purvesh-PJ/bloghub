import styled from 'styled-components';
import {
  Input as UiInput,
  Button as UiButton,
  Stack,
  Flex,
} from '../../../../components/ui/primitives';

export const SearchContainer = styled(Stack)`
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(4)};
  background: ${({ theme }) => theme.palette.background.surface};
  border: ${({ theme }) => theme.borderWidth.thin} solid ${({ theme }) => theme.palette.grey[200]};
  border-radius: ${({ theme }) => theme.radii.lg};
  width: 100%;
  max-width: 640px;
`;

export const SearchInput = styled(UiInput)`
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(4)};
`;

export const ButtonRow = styled(Flex)`
  justify-content: flex-end;
`;

export const Button = styled(UiButton)`
  padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(3)};
`;
