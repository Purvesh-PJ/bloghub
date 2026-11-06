import {
  LayoutDashboard,
  FileText,
  PenLine,
  MessageSquare,
  Settings,
  ShieldCheck,
  Globe,
} from 'lucide-react';

export const WORKSPACE_NAV_SECTIONS = [
  {
    title: 'Workspace',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      {
        to: '/stories',
        label: 'Stories',
        icon: FileText,
        isActive: (pathname) => pathname === '/stories' || pathname.startsWith('/edit'),
      },
      {
        to: '/write',
        label: 'Write',
        icon: PenLine,
        isActive: (pathname) => pathname.startsWith('/write'),
      },
      { to: '/comments', label: 'Responses', icon: MessageSquare },
    ],
  },
  {
    title: 'Preferences',
    items: [{ to: '/settings', label: 'Settings', icon: Settings }],
  },
  {
    title: 'Management',
    adminOnly: true,
    items: [{ to: '/admin', label: 'Admin Console', icon: ShieldCheck }],
  },
  {
    title: 'Explore',
    items: [{ to: '/', label: 'Public Feed', icon: Globe }],
  },
];

export function getWorkspacePageTitle(pathname) {
  if (pathname === '/dashboard') return 'Dashboard';
  if (pathname === '/stories') return 'Stories';
  if (pathname.startsWith('/write')) return 'Write Story';
  if (pathname.startsWith('/edit')) return 'Edit Story';
  if (pathname === '/comments') return 'Responses';
  if (pathname === '/settings') return 'Settings';
  return 'Creator Studio';
}

