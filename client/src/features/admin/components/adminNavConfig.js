import { LayoutDashboard, FileText, Users, Hash, Activity, Compass, Globe } from 'lucide-react';

/**
 * Declarative admin navigation configuration.
 * Single source of truth for route matching, labels, icons, and sections.
 */
export const ADMIN_NAV_SECTIONS = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    items: [
      {
        to: '/admin',
        label: 'Overview',
        icon: LayoutDashboard,
        exact: true,
      },
    ],
  },
  {
    id: 'management',
    title: 'Management',
    items: [
      {
        to: '/admin/posts',
        label: 'Posts',
        icon: FileText,
      },
      {
        to: '/admin/tags',
        label: 'Tags & Topics',
        icon: Hash,
      },
      {
        to: '/admin/users',
        label: 'People',
        icon: Users,
      },
    ],
  },
  {
    id: 'insights',
    title: 'Insights',
    items: [
      {
        to: '/admin/activity',
        label: 'Activity',
        icon: Activity,
      },
    ],
  },
  {
    id: 'shortcuts',
    title: 'Shortcuts',
    items: [
      {
        to: '/dashboard',
        label: 'Creator Studio',
        icon: Compass,
        isShortcut: true,
      },
      {
        to: '/',
        label: 'Public Feed',
        icon: Globe,
        isShortcut: true,
      },
    ],
  },
];

/**
 * Derives current page breadcrumb title from the active pathname.
 *
 * @param {string} pathname
 * @returns {string}
 */
export function getAdminPageTitle(pathname) {
  if (pathname === '/admin') return 'Overview';
  if (pathname.startsWith('/admin/posts')) return 'Posts';
  if (pathname.startsWith('/admin/tags')) return 'Tags & Topics';
  if (pathname.startsWith('/admin/users')) return 'People';
  if (pathname.startsWith('/admin/activity')) return 'Activity';
  return 'Admin Console';
}
