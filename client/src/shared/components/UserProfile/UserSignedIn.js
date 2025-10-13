import React, { useState } from 'react';
import styled from 'styled-components';
import { Avatar, Menu, MenuItem, IconButton, Text, Box } from '../../../components/ui/primitives';

const UserContainer = styled.div`
  position: relative;
`;

const UserInfo = styled(Box)`
  padding: ${(p) => p.theme.spacing(2)};
  border-bottom: 1px solid ${(p) => p.theme.palette.divider};
`;

const UserSignedIn = ({ user, onLogout, onProfile, onMenuClick, ...props }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = (e) => {
    setIsMenuOpen(!isMenuOpen);
    if (onMenuClick) onMenuClick(e);
  };

  const handleClose = () => {
    setIsMenuOpen(false);
  };

  const handleProfile = () => {
    handleClose();
    if (onProfile) onProfile();
  };

  const handleLogout = () => {
    handleClose();
    if (onLogout) onLogout();
  };

  return (
    <UserContainer>
      <IconButton onClick={handleMenuClick} {...props}>
        <Avatar src={user?.profileImage} alt={user?.name}>
          {user?.name?.charAt(0)}
        </Avatar>
      </IconButton>
      {isMenuOpen && (
        <Menu>
          <UserInfo>
            <Text>{user?.name}</Text>
            <Text $variant="muted">{user?.email}</Text>
          </UserInfo>
          <MenuItem onClick={handleProfile}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      )}
    </UserContainer>
  );
};

export default UserSignedIn;
