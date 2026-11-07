import { WorkspaceLayout } from '../../components/layout/WorkspaceLayout';
import { ADMIN_NAV_SECTIONS, getAdminPageTitle } from './components/adminNavConfig';

/**
 * Admin shell.
 * Uses unified WorkspaceLayout with administrator configuration.
 */
export function AdminLayout() {
  return (
    <WorkspaceLayout
      variant="admin"
      navSections={ADMIN_NAV_SECTIONS}
      getPageTitle={getAdminPageTitle}
      containerClassName="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-16 sm:pb-24 flex flex-col gap-6 sm:gap-8"
    />
  );
}
