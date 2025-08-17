import React, { useState } from 'react';
import {
  Container,
  SettingsCard,
  CardHeader,
  CardIcon,
  CardTitle,
  CardContent,
  ThemeGrid,
  ThemeOption,
  ThemePreview,
  ThemeTitle,
  ColorPalette,
  ColorSwatch,
  Section,
  SectionTitle,
  RadioInput,
  Button,
  Divider,
  CardDescription
} from './AppearanceSettings-Style';
import { FaPalette, FaMoon, FaSun, FaDesktop } from 'react-icons/fa';

const AppearanceSettings = () => {
  const [theme, setTheme] = useState('light');
  const [colorScheme, setColorScheme] = useState('indigo');
  
  const colors = [
    { id: 'indigo', color: '#4f46e5', name: 'Indigo' },
    { id: 'purple', color: '#8b5cf6', name: 'Purple' },
    { id: 'blue', color: '#3b82f6', name: 'Blue' },
    { id: 'green', color: '#10b981', name: 'Green' },
    { id: 'red', color: '#ef4444', name: 'Red' },
    { id: 'orange', color: '#f59e0b', name: 'Orange' }
  ];
  
  const saveSettings = () => {
    // Save settings logic
    alert('Appearance settings saved successfully');
  };

  return (
    <Container>
      <SettingsCard>
        <CardHeader>
          <CardIcon>
            <FaPalette />
          </CardIcon>
          <CardTitle>Theme</CardTitle>
        </CardHeader>
        <CardDescription>
          Choose your preferred theme for the application
        </CardDescription>
        <CardContent>
          <ThemeGrid>
            <ThemeOption 
              selected={theme === 'light'} 
              onClick={() => setTheme('light')}
            >
              <RadioInput 
                type="radio" 
                name="theme" 
                checked={theme === 'light'} 
                readOnly 
              />
              <ThemePreview className="light">
                <FaSun />
              </ThemePreview>
              <ThemeTitle>Light Mode</ThemeTitle>
            </ThemeOption>
            
            <ThemeOption 
              selected={theme === 'dark'} 
              onClick={() => setTheme('dark')}
            >
              <RadioInput 
                type="radio" 
                name="theme" 
                checked={theme === 'dark'} 
                readOnly 
              />
              <ThemePreview className="dark">
                <FaMoon />
              </ThemePreview>
              <ThemeTitle>Dark Mode</ThemeTitle>
            </ThemeOption>
            
            <ThemeOption 
              selected={theme === 'system'} 
              onClick={() => setTheme('system')}
            >
              <RadioInput 
                type="radio" 
                name="theme" 
                checked={theme === 'system'} 
                readOnly 
              />
              <ThemePreview className="system">
                <FaDesktop />
              </ThemePreview>
              <ThemeTitle>System Default</ThemeTitle>
            </ThemeOption>
          </ThemeGrid>
          
          <Divider />
          
          <Section>
            <SectionTitle>Color Scheme</SectionTitle>
            <ColorPalette>
              {colors.map(({id, color, name}) => (
                <ColorSwatch 
                  key={id}
                  color={color}
                  selected={colorScheme === id}
                  onClick={() => setColorScheme(id)}
                  title={name}
                >
                  {colorScheme === id && <span>✓</span>}
                </ColorSwatch>
              ))}
            </ColorPalette>
          </Section>
        </CardContent>
      </SettingsCard>
      
      <Button onClick={saveSettings}>Apply</Button>
    </Container>
  );
};

export default AppearanceSettings; 