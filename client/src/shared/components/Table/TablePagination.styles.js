import styled from 'styled-components';
import { Flex, Button, Select } from '../../../components/ui/primitives';

export const PaginationContainer = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  padding: ${(p) => p.theme.spacing(2)};
  border-top: 1px solid ${(p) => p.theme.palette.divider};
`;

export const PaginationInfo = styled.div`
  color: ${(p) => p.theme.palette.text.secondary};
  font-size: ${(p) => p.theme.typography.size.sm};
`;

export const PaginationControls = styled(Flex)`
  align-items: center;
  gap: ${(p) => p.theme.spacing(2)};
`;

export const PageSizeSelect = styled(Select)`
  min-width: 80px;
`;
