import React from 'react';
import styled from 'styled-components';
import { Box } from '../../../components/ui/primitives';

const ResponsiveBox = styled(Box)`
  width: 100%;
  padding: ${(p) => p.theme.spacing(2)};

  @media (max-width: ${(p) => p.theme.breakpoints.md}) {
    padding: ${(p) => p.theme.spacing(1)};
  }
`;

const MyResponsiveComponent = ({ children, ...props }) => {
  return <ResponsiveBox {...props}>{children}</ResponsiveBox>;
};

export default MyResponsiveComponent;
