import React, { useState } from 'react';
import {
  Container,
  SettingsContainer,
  SettingsHeader,
  SettingsTitle,
  SettingsTabs,
  Tab,
  TabIcon,
  ContentArea,
  SettingsGrid,
  SettingCard,
  CardHeader,
  CardTitle,
  CardIcon,
  CardContent,
  CardDescription,
  ArrowIcon,
  ActiveSettingContent,
  SettingBackButton
} from './ProfileSettings-Style';
import UpdateProfile from './UpdateProfile';
import AccountPrivacy from './AccountPrivacy';
import { FaUser, FaLock, FaBell, FaCog, FaChevronRight } from 'react-icons/fa';

const ProfileSettings = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [activeSettingCard, setActiveSettingCard] = useState(null);
    
    const settingsCards = [
        {
            id: 'personal-info',
            title: 'Personal Information',
            description: 'Update your name, email, and profile details',
            icon: <FaUser />,
            color: '#3b82f6',
            bgColor: '#dbeafe',
            component: <UpdateProfile />
        },
        {
            id: 'security',
            title: 'Privacy & Security',
            description: 'Manage your password, 2FA and privacy settings',
            icon: <FaLock />,
            color: '#10b981',
            bgColor: '#d1fae5',
            component: <AccountPrivacy />
        },
        {
            id: 'notifications',
            title: 'Notification Settings',
            description: 'Choose which notifications you want to receive',
            icon: <FaBell />,
            color: '#f59e0b',
            bgColor: '#fef3c7',
            component: (
                <div>
                    <h3>Notification Settings</h3>
                    <p>Configure your notification preferences here.</p>
                </div>
            )
        },
        {
            id: 'advanced',
            title: 'Advanced Settings',
            description: 'API access, data export and account management',
            icon: <FaCog />,
            color: '#8b5cf6',
            bgColor: '#ede9fe',
            component: (
                <div>
                    <h3>Advanced Settings</h3>
                    <p>Configure advanced account settings here.</p>
                </div>
            )
        }
    ];
    
    const getFilteredCards = () => {
        if (activeTab === 'all') return settingsCards;
        return settingsCards.filter(card => {
            if (activeTab === 'profile' && card.id === 'personal-info') return true;
            if (activeTab === 'privacy' && card.id === 'security') return true;
            if (activeTab === 'notifications' && card.id === 'notifications') return true;
            if (activeTab === 'advanced' && card.id === 'advanced') return true;
            return false;
        });
    };
    
    const handleCardClick = (cardId) => {
        setActiveSettingCard(cardId);
    };
    
    const handleBackClick = () => {
        setActiveSettingCard(null);
    };
    
    const getActiveComponent = () => {
        const card = settingsCards.find(c => c.id === activeSettingCard);
        return card ? card.component : null;
    };

    return (
        <Container>
            <SettingsContainer>
                <SettingsHeader>
                    <SettingsTitle>Account Settings</SettingsTitle>
                </SettingsHeader>
                
                {/* <SettingsTabs>
                    <Tab 
                        active={activeTab === 'all'} 
                        onClick={() => setActiveTab('all')}
                    >
                        <TabIcon>All Settings</TabIcon>
                    </Tab>
                    <Tab 
                        active={activeTab === 'profile'} 
                        onClick={() => setActiveTab('profile')}
                    >
                        <TabIcon><FaUser /></TabIcon>
                        Profile
                    </Tab>
                    <Tab 
                        active={activeTab === 'privacy'} 
                        onClick={() => setActiveTab('privacy')}
                    >
                        <TabIcon><FaLock /></TabIcon>
                        Security
                    </Tab>
                    <Tab 
                        active={activeTab === 'notifications'} 
                        onClick={() => setActiveTab('notifications')}
                    >
                        <TabIcon><FaBell /></TabIcon>
                        Notifications
                    </Tab>
                    <Tab 
                        active={activeTab === 'advanced'} 
                        onClick={() => setActiveTab('advanced')}
                    >
                        <TabIcon><FaCog /></TabIcon>
                        Advanced
                    </Tab>
                </SettingsTabs> */}
                
                <ContentArea>
                    {activeSettingCard ? (
                        <>
                            <SettingBackButton onClick={handleBackClick}>
                                <FaChevronRight /> Back to Settings
                            </SettingBackButton>
                            <ActiveSettingContent>
                                {getActiveComponent()}
                            </ActiveSettingContent>
                        </>
                    ) : (
                        <SettingsGrid>
                            {getFilteredCards().map(card => (
                                <SettingCard 
                                    key={card.id} 
                                    onClick={() => handleCardClick(card.id)}
                                >
                                    <CardHeader>
                                        <CardTitle>
                                            <CardIcon bgColor={card.bgColor} color={card.color}>
                                                {card.icon}
                                            </CardIcon>
                                            {card.title}
                                        </CardTitle>
                                        <ArrowIcon>
                                            <FaChevronRight />
                                        </ArrowIcon>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription>
                                            {card.description}
                                        </CardDescription>
                                    </CardContent>
                                </SettingCard>
                            ))}
                        </SettingsGrid>
                    )}
                </ContentArea>
            </SettingsContainer>
        </Container>
    );
};

export default ProfileSettings;