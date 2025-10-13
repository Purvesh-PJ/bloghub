import React from 'react';
import styled from 'styled-components';
import { Card, Flex, IconWrapper, Text, Divider } from '../../../components/ui/primitives';

const DrawerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${(props) => (props.$open ? 'block' : 'none')};
`;

const DrawerPanel = styled(Card)`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: ${(props) => props.$width}px;
  transform: translateX(${(props) => (props.$open ? '0' : '-100%')});
  transition: transform 0.3s ease;
  z-index: 1000;
  overflow-y: auto;
`;

const NavItem = styled(Flex)`
  align-items: center;
  gap: ${(p) => p.theme.spacing(3)};
  padding: ${(p) => p.theme.spacing(3)};
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${(p) => p.theme.palette.background.subtle};
  }
`;

export const SidePanel = ({ open, onClose, items = [], width = 240, ...props }) => {
  return (
    <>
      <DrawerOverlay $open={open} onClick={onClose} />
      <DrawerPanel $open={open} $width={width} {...props}>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {item.divider ? (
              <Divider />
            ) : (
              <NavItem onClick={item.onClick}>
                {item.icon && <IconWrapper>{item.icon}</IconWrapper>}
                <Text>{item.text}</Text>
              </NavItem>
            )}
          </React.Fragment>
        ))}
      </DrawerPanel>
    </>
  );
};
