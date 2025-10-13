import React from 'react';
import styled from 'styled-components';
import { Card, Flex, IconWrapper, Text, H3, Box } from '../../../components/ui/primitives';

const SettingsPanel = styled(Card)`
  width: ${(props) => props.$width}px;
  height: 100%;
  overflow-y: auto;
`;

const Header = styled(Box)`
  padding: ${(p) => p.theme.spacing(4)};
  border-bottom: 1px solid ${(p) => p.theme.palette.divider};
`;

const NavItem = styled(Flex)`
  align-items: center;
  gap: ${(p) => p.theme.spacing(3)};
  padding: ${(p) => p.theme.spacing(3)};
  cursor: pointer;
  transition: background 0.2s ease;
  background: ${(props) =>
    props.$selected ? props.theme.palette.background.subtle : 'transparent'};

  &:hover {
    background: ${(p) => p.theme.palette.background.subtle};
  }
`;

const SettingsSideNavigationPanel = ({ navigationItems = [], width = 280, ...props }) => {
  return (
    <SettingsPanel $width={width} {...props}>
      <Header>
        <H3>Settings</H3>
      </Header>
      {navigationItems.map((item, index) => (
        <NavItem key={index} onClick={item.onClick} $selected={item.selected}>
          {item.icon && <IconWrapper>{item.icon}</IconWrapper>}
          <Text>{item.text}</Text>
        </NavItem>
      ))}
    </SettingsPanel>
  );
};

export default SettingsSideNavigationPanel;
