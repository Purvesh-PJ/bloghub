import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { SettingSection, ChoiceGrid } from '../../../components/patterns';

const THEMES = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Monitor },
];

export function AppearanceSettings({ preference, onThemeChange }) {
  return (
    <SettingSection
      title="Appearance"
      description="System follows whatever your device is set to, and changes with it."
    >
      <ChoiceGrid
        options={THEMES}
        value={preference}
        onChange={onThemeChange}
        ariaLabel="Theme preference"
      />
    </SettingSection>
  );
}
