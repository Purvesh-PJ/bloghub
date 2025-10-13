import React, { useState } from 'react';
import {
  Container,
  SettingsCard,
  CardHeader,
  CardIcon,
  CardTitle,
  CardContent,
  InfoSection,
  StatusBadge,
  PlanFeatures,
  PlanFeature,
  SubscriptionDetails,
  DetailItem,
  DetailLabel,
  DetailValue,
  ButtonGroup,
  Button,
  DangerCard,
  DangerTitle,
  DangerDescription,
  DangerButton,
  Divider,
  CardDescription,
  ConfirmationModal,
  ModalContent,
  ModalTitle,
  ModalDescription,
  ModalActions,
  ModalButton,
} from './AccountManagement.styles';
import { FaUserShield, FaDownload, FaTrash, FaCrown, FaCheck, FaTimes } from 'react-icons/fa';
import { Download, Trash2 } from 'lucide-react';

const AccountManagement = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Mock user data
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    plan: 'free',
    joinDate: 'June 15, 2023',
    nextBilling: 'N/A',
  };

  const downloadData = () => {
    alert('Your data will be prepared and available for download shortly');
  };

  const showDeleteConfirmation = () => {
    setShowConfirmation(true);
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
  };

  const deleteAccount = () => {
    // Account deletion logic
    alert('Account deletion process initiated');
    setShowConfirmation(false);
  };

  return (
    <Container>
      <SettingsCard>
        <CardHeader>
          <CardIcon>
            <FaCrown />
          </CardIcon>
          <CardTitle>Subscription Plan</CardTitle>
        </CardHeader>
        <CardDescription>Manage your subscription and billing details</CardDescription>
        <CardContent>
          <InfoSection>
            <StatusBadge plan={userData.plan}>
              {userData.plan === 'free' ? 'Free Plan' : 'Premium Plan'}
            </StatusBadge>

            <PlanFeatures>
              <PlanFeature available={true}>
                <FaCheck />
                <span>Unlimited public posts</span>
              </PlanFeature>
              <PlanFeature available={true}>
                <FaCheck />
                <span>Basic analytics</span>
              </PlanFeature>
              <PlanFeature available={userData.plan !== 'free'}>
                {userData.plan !== 'free' ? <FaCheck /> : <FaTimes />}
                <span>Custom domain</span>
              </PlanFeature>
              <PlanFeature available={userData.plan !== 'free'}>
                {userData.plan !== 'free' ? <FaCheck /> : <FaTimes />}
                <span>Advanced analytics</span>
              </PlanFeature>
              <PlanFeature available={userData.plan !== 'free'}>
                {userData.plan !== 'free' ? <FaCheck /> : <FaTimes />}
                <span>Priority support</span>
              </PlanFeature>
            </PlanFeatures>

            <SubscriptionDetails>
              <DetailItem>
                <DetailLabel>Account holder</DetailLabel>
                <DetailValue>{userData.name}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Email</DetailLabel>
                <DetailValue>{userData.email}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Member since</DetailLabel>
                <DetailValue>{userData.joinDate}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Next billing date</DetailLabel>
                <DetailValue>{userData.nextBilling}</DetailValue>
              </DetailItem>
            </SubscriptionDetails>

            <ButtonGroup>
              {userData.plan === 'free' ? (
                <Button primary>Upgrade to Premium</Button>
              ) : (
                <Button>Manage Subscription</Button>
              )}
            </ButtonGroup>
          </InfoSection>
        </CardContent>
      </SettingsCard>

      <SettingsCard>
        <CardHeader>
          <CardIcon>
            <FaUserShield />
          </CardIcon>
          <CardTitle>Account Data</CardTitle>
        </CardHeader>
        <CardDescription>Export your account data or delete your account</CardDescription>
        <CardContent>
          <InfoSection>
            <h3>Export Your Data</h3>
            <p>Download a copy of your data including posts, comments, and profile information.</p>
            <Button onClick={downloadData}>
              <Download style={{ margin: '0 0.50rem 0 0' }} size={16} strokeWidth={2} />
              Download My Data
            </Button>
          </InfoSection>

          <Divider />

          <DangerCard>
            <DangerTitle>Delete Account</DangerTitle>
            <DangerDescription>
              This action is irreversible. Once you delete your account, all your data will be
              permanently removed from our systems.
            </DangerDescription>
            <DangerButton onClick={showDeleteConfirmation}>
              <Trash2 style={{ margin: '0 0.50rem 0 0' }} size={16} strokeWidth={2} />
              Delete My Account
            </DangerButton>
          </DangerCard>
        </CardContent>
      </SettingsCard>

      {showConfirmation && (
        <ConfirmationModal>
          <ModalContent>
            <ModalTitle>Are you sure?</ModalTitle>
            <ModalDescription>
              This will permanently delete your account and all your data. This action cannot be
              undone.
            </ModalDescription>
            <ModalActions>
              <ModalButton secondary onClick={closeConfirmation}>
                Cancel
              </ModalButton>
              <ModalButton danger onClick={deleteAccount}>
                Delete Account
              </ModalButton>
            </ModalActions>
          </ModalContent>
        </ConfirmationModal>
      )}
    </Container>
  );
};

export default AccountManagement;
