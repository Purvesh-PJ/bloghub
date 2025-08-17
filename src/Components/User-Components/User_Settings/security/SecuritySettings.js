import React, { useState } from 'react';
import {
  Container,
  SettingsCard,
  CardHeader,
  CardTitle,
  CardContent,
  FormGroup,
  Label,
  Input,
  Button,
  ToggleSwitch,
  ToggleLabel,
  SwitchInput,
  Slider,
  SessionsList,
  SessionItem,
  SessionDetails,
  SessionDevice,
  SessionLocation,
  SessionTime,
  SessionActions,
  Divider,
  CardDescription,
  CardIcon
} from './SecuritySettings-Style';
import { FaLock, FaShieldAlt, FaMobileAlt, FaDesktop, FaTabletAlt } from 'react-icons/fa';

const SecuritySettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  // Mock active sessions data
  const activeSessions = [
    {
      id: 1,
      device: 'Desktop - Chrome',
      icon: <FaDesktop />,
      location: 'New York, USA',
      ip: '192.168.1.1',
      time: 'Current session',
      current: true
    },
    {
      id: 2,
      device: 'iPhone - Safari',
      icon: <FaMobileAlt />,
      location: 'Boston, USA',
      ip: '192.168.1.2',
      time: '2 hours ago',
      current: false
    },
    {
      id: 3,
      device: 'iPad - Chrome',
      icon: <FaTabletAlt />,
      location: 'Miami, USA',
      ip: '192.168.1.3',
      time: '1 day ago',
      current: false
    }
  ];

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // Password change logic
    alert('Password change functionality will be implemented here');
  };

  const handleTwoFactorToggle = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    if (!twoFactorEnabled) {
      setShowQRCode(true);
    } else {
      setShowQRCode(false);
    }
  };

  const handleLogoutSession = (id) => {
    // Session logout logic
    alert(`Logging out session ${id}`);
  };

  return (
    <Container>
      <SettingsCard>
        <CardHeader>
          <CardIcon>
            <FaLock />
          </CardIcon>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardDescription>
          Keep your account secure by using a strong, unique password
        </CardDescription>
        <CardContent>
          <form onSubmit={handlePasswordChange}>
            <FormGroup>
              <Label>Current Password</Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
              />
            </FormGroup>
            <FormGroup>
              <Label>New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
              />
            </FormGroup>
            <FormGroup>
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
              />
            </FormGroup>
            <Button type="submit">Update Password</Button>
          </form>
        </CardContent>
      </SettingsCard>

      <SettingsCard>
        <CardHeader>
          <CardIcon>
            <FaShieldAlt />
          </CardIcon>
          <CardTitle>Two-Factor Authentication</CardTitle>
        </CardHeader>
        <CardDescription>
          Add an extra layer of security by requiring a verification code in addition to your password
        </CardDescription>
        <CardContent>
          <ToggleLabel>
            <span>Enable Two-Factor Authentication</span>
            <ToggleSwitch>
              <SwitchInput
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={handleTwoFactorToggle}
              />
              <Slider />
            </ToggleSwitch>
          </ToggleLabel>

          {showQRCode && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <p>Scan this QR code with your authenticator app</p>
              <div
                style={{
                  width: '200px',
                  height: '200px',
                  backgroundColor: '#f0f0f0',
                  margin: '0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                QR Code Placeholder
              </div>
              <p style={{ marginTop: '10px' }}>
                After scanning, enter the 6-digit code from your authenticator app to verify setup
              </p>
              <FormGroup>
                <Input
                  type="text"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  style={{ width: '200px', margin: '0 auto' }}
                />
              </FormGroup>
              <Button>Verify</Button>
            </div>
          )}
        </CardContent>
      </SettingsCard>

      <SettingsCard>
        <CardHeader>
          <CardIcon>
            <FaMobileAlt />
          </CardIcon>
          <CardTitle>Active Sessions</CardTitle>
        </CardHeader>
        <CardDescription>
          Review and manage all devices where you're currently logged in
        </CardDescription>
        <CardContent>
          <SessionsList>
            {activeSessions.map((session) => (
              <SessionItem key={session.id} isCurrent={session.current}>
                <SessionDetails>
                  <SessionDevice>
                    {session.icon}
                    {session.device}
                    {session.current && <span className="current">Current</span>}
                  </SessionDevice>
                  <SessionLocation>
                    {session.location} • {session.ip}
                  </SessionLocation>
                  <SessionTime>{session.time}</SessionTime>
                </SessionDetails>
                <SessionActions>
                  {!session.current && (
                    <Button 
                      onClick={() => handleLogoutSession(session.id)}
                      variant="secondary"
                    >
                      Logout
                    </Button>
                  )}
                </SessionActions>
              </SessionItem>
            ))}
          </SessionsList>
          <Divider />
          <Button variant="danger">Logout from all devices</Button>
        </CardContent>
      </SettingsCard>
    </Container>
  );
};

export default SecuritySettings; 