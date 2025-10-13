import { UserCog, Palette, KeyRound, ShieldCheck, UserPen } from 'lucide-react';

const UsersSettingsSideNavigationData = {
  PanelHeading: {
    id: 1,
    heading: 'Settings',
  },

  Settings: [
    {
      id: 1,
      icon: <UserCog size={16} strokeWidth={2} />,
      itemName: 'Profile settings',
      location: 'profileSettings',
    },
    {
      id: 2,
      icon: <Palette size={16} strokeWidth={2} />,
      itemName: 'Appearance',
      location: 'appearence',
    },
    {
      id: 3,
      icon: <KeyRound size={16} strokeWidth={2} />,
      itemName: 'Security',
      location: 'securitySettings',
    },
    {
      id: 4,
      icon: <ShieldCheck size={16} strokeWidth={2} />,
      itemName: 'Privacy',
      location: 'privacySettings',
    },
    {
      id: 5,
      icon: <UserPen size={16} strokeWidth={2} />,
      itemName: 'Account Management',
      location: 'manageAccount',
    },
  ],
};

export default UsersSettingsSideNavigationData;
