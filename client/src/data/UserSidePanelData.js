import { SquarePen, ChartSpline, TableOfContents, Settings2, LogOut } from 'lucide-react';

export const UserSidePanelData = [
  {
    category: 'DASHBOARD',
    items: [
      {
        id: 1,
        itemName: 'Analytics',
        location: 'Analytics',
        icon: <ChartSpline size={16} strokeWidth={2} />,
      },
    ],
  },
  {
    category: 'DATA MANAGEMENT',
    items: [
      {
        id: 1,
        itemName: 'Create post',
        location: 'CreatePost',
        icon: <SquarePen size={16} strokeWidth={2} />,
      },
      {
        id: 2,
        itemName: 'Manage Content',
        location: 'ManageContent',
        icon: <TableOfContents size={16} strokeWidth={2} />,
      },
    ],
  },
  {
    category: 'CONFIGURATION',
    items: [
      {
        id: 1,
        itemName: 'Settings',
        location: 'Settings',
        icon: <Settings2 size={16} strokeWidth={2} />,
      },
      {
        id: 2,
        itemName: 'Logout',
        location: '/',
        icon: <LogOut size={16} strokeWidth={2} />,
      },
    ],
  },
];
