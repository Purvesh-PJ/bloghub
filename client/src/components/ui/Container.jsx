import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: ${({ $maxWidth }) => $maxWidth || '1200px'};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing?.md || '16px'};
`;

export const Box = styled.div`
  display: ${({ $display }) => $display || 'block'};
  padding: ${({ $p }) => $p || '0'};
  margin: ${({ $m }) => $m || '0'};
  width: ${({ $w }) => $w || 'auto'};
`;

export const Flex = styled.div`
  display: flex;
  flex-direction: ${({ $direction }) => $direction || 'row'};
  align-items: ${({ $align }) => $align || 'stretch'};
  justify-content: ${({ $justify }) => $justify || 'flex-start'};
  gap: ${({ $gap }) => $gap || '0'};
  flex-wrap: ${({ $wrap }) => ($wrap ? 'wrap' : 'nowrap')};
`;
