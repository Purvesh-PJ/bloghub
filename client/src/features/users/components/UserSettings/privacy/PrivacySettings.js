import React, { useState } from 'react';
import {
  Container,
  SettingsCard,
  CardHeader,
  CardIcon,
  CardTitle,
  CardContent,
  ToggleOption,
  OptionLabel,
  OptionDescription,
  ToggleSwitch,
  SwitchInput,
  Slider,
  Section,
  SectionTitle,
  Divider,
  SelectWrapper,
  Select,
  Button,
  RadioGroup,
  RadioOption,
  RadioInput,
  RadioLabel,
  CardDescription,
} from './PrivacySettings.styles';
import { FaEye, FaGlobe, FaEnvelope, FaDatabase, FaLock, FaUserShield } from 'react-icons/fa';

const PrivacySettings = () => {
  // Profile visibility settings
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [showEmail, setShowEmail] = useState(false);
  const [showLocation, setShowLocation] = useState(true);

  // Data usage settings
  const [allowDataAnalytics, setAllowDataAnalytics] = useState(true);
  const [allowPersonalization, setAllowPersonalization] = useState(true);

  // Communication preferences
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [newsletterEmails, setNewsletterEmails] = useState(true);

  const saveSettings = () => {
    // Save settings logic
    alert('Privacy settings saved successfully');
  };

  return (
    <Container>
      <SettingsCard>
        <CardHeader>
          <CardIcon>
            <FaEye />
          </CardIcon>
          <CardTitle>Profile Visibility</CardTitle>
        </CardHeader>
        <CardDescription>
          Control who can see your profile information and activities
        </CardDescription>
        <CardContent>
          <Section>
            <SectionTitle>Who can see my profile?</SectionTitle>
            <RadioGroup>
              <RadioOption>
                <RadioInput
                  type="radio"
                  id="public"
                  name="visibility"
                  value="public"
                  checked={profileVisibility === 'public'}
                  onChange={() => setProfileVisibility('public')}
                />
                <RadioLabel htmlFor="public">
                  <strong>Public</strong>
                  <span>Anyone can view your profile</span>
                </RadioLabel>
              </RadioOption>

              <RadioOption>
                <RadioInput
                  type="radio"
                  id="registered"
                  name="visibility"
                  value="registered"
                  checked={profileVisibility === 'registered'}
                  onChange={() => setProfileVisibility('registered')}
                />
                <RadioLabel htmlFor="registered">
                  <strong>Registered Users</strong>
                  <span>Only registered users can view your profile</span>
                </RadioLabel>
              </RadioOption>

              <RadioOption>
                <RadioInput
                  type="radio"
                  id="private"
                  name="visibility"
                  value="private"
                  checked={profileVisibility === 'private'}
                  onChange={() => setProfileVisibility('private')}
                />
                <RadioLabel htmlFor="private">
                  <strong>Private</strong>
                  <span>Only you can view your profile</span>
                </RadioLabel>
              </RadioOption>
            </RadioGroup>
          </Section>

          <Divider />

          <Section>
            <SectionTitle>Profile information visibility</SectionTitle>

            <ToggleOption>
              <div>
                <OptionLabel>Show email address on profile</OptionLabel>
                <OptionDescription>
                  Allow others to see your email address on your public profile
                </OptionDescription>
              </div>
              <ToggleSwitch>
                <SwitchInput
                  type="checkbox"
                  checked={showEmail}
                  onChange={() => setShowEmail(!showEmail)}
                />
                <Slider />
              </ToggleSwitch>
            </ToggleOption>

            <ToggleOption>
              <div>
                <OptionLabel>Show location on profile</OptionLabel>
                <OptionDescription>
                  Allow others to see your location on your public profile
                </OptionDescription>
              </div>
              <ToggleSwitch>
                <SwitchInput
                  type="checkbox"
                  checked={showLocation}
                  onChange={() => setShowLocation(!showLocation)}
                />
                <Slider />
              </ToggleSwitch>
            </ToggleOption>
          </Section>
        </CardContent>
      </SettingsCard>

      <SettingsCard>
        <CardHeader>
          <CardIcon>
            <FaDatabase />
          </CardIcon>
          <CardTitle>Data Usage & Analytics</CardTitle>
        </CardHeader>
        <CardDescription>Manage how your data is used to improve your experience</CardDescription>
        <CardContent>
          <ToggleOption>
            <div>
              <OptionLabel>Allow analytics</OptionLabel>
              <OptionDescription>
                We use analytics to improve our platform and understand how users interact with our
                features
              </OptionDescription>
            </div>
            <ToggleSwitch>
              <SwitchInput
                type="checkbox"
                checked={allowDataAnalytics}
                onChange={() => setAllowDataAnalytics(!allowDataAnalytics)}
              />
              <Slider />
            </ToggleSwitch>
          </ToggleOption>

          <ToggleOption>
            <div>
              <OptionLabel>Allow personalization</OptionLabel>
              <OptionDescription>
                We use your activity to personalize content recommendations and suggestions
              </OptionDescription>
            </div>
            <ToggleSwitch>
              <SwitchInput
                type="checkbox"
                checked={allowPersonalization}
                onChange={() => setAllowPersonalization(!allowPersonalization)}
              />
              <Slider />
            </ToggleSwitch>
          </ToggleOption>
        </CardContent>
      </SettingsCard>

      <SettingsCard>
        <CardHeader>
          <CardIcon>
            <FaEnvelope />
          </CardIcon>
          <CardTitle>Communication Preferences</CardTitle>
        </CardHeader>
        <CardDescription>
          Control what types of emails and notifications you receive
        </CardDescription>
        <CardContent>
          <ToggleOption>
            <div>
              <OptionLabel>Marketing Emails</OptionLabel>
              <OptionDescription>
                Receive emails about new features, offers, and promotions
              </OptionDescription>
            </div>
            <ToggleSwitch>
              <SwitchInput
                type="checkbox"
                checked={marketingEmails}
                onChange={() => setMarketingEmails(!marketingEmails)}
              />
              <Slider />
            </ToggleSwitch>
          </ToggleOption>

          <ToggleOption>
            <div>
              <OptionLabel>Newsletter</OptionLabel>
              <OptionDescription>
                Receive our weekly digest of top content and updates
              </OptionDescription>
            </div>
            <ToggleSwitch>
              <SwitchInput
                type="checkbox"
                checked={newsletterEmails}
                onChange={() => setNewsletterEmails(!newsletterEmails)}
              />
              <Slider />
            </ToggleSwitch>
          </ToggleOption>
        </CardContent>
      </SettingsCard>

      <Button onClick={saveSettings}>Save Privacy Settings</Button>
    </Container>
  );
};

export default PrivacySettings;
