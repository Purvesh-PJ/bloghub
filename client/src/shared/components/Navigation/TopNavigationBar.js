import React from 'react';
import styled from 'styled-components';
import { Flex, IconButton, H3, Box } from '../../../components/ui/primitives';
import { Menu } from 'lucide-react';

const NavBar = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  padding: ${(p) => p.theme.spacing(3)} ${(p) => p.theme.spacing(4)};
  background: ${(p) => p.theme.palette.background.paper};
  border-bottom: 1px solid ${(p) => p.theme.palette.divider};
  position: ${(props) => props.$position || 'static'};
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
`;

const LeftSection = styled(Flex)`
  align-items: center;
  gap: ${(p) => p.theme.spacing(2)};
`;

const RightSection = styled(Flex)`
  align-items: center;
  gap: ${(p) => p.theme.spacing(2)};
`;

const TopNavigationBar = ({ title, children, onMenuClick, position = 'static', ...props }) => {
  return (
    <NavBar $position={position} {...props}>
      <LeftSection>
        {onMenuClick && (
          <IconButton onClick={onMenuClick} $size="sm">
            <Menu size={20} />
          </IconButton>
        )}
        <H3>{title}</H3>
      </LeftSection>
      <RightSection>{children}</RightSection>
    </NavBar>
  );
};

export default TopNavigationBar;
