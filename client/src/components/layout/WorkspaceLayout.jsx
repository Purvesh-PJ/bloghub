import { useState, useCallback } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth';
import { useCurrentUser } from '../../features/users';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import {
  WorkspaceSidebar,
  WorkspaceHeader,
  WORKSPACE_NAV_SECTIONS,
  getWorkspacePageTitle,
} from './workspace';

/**
 * WorkspaceLayout — Creator studio and admin console shell.
 * Orchestrates desktop sidebar, accessible mobile drawer, sticky topbar, and routed views.
 */
export function WorkspaceLayout({
  variant = 'workspace',
  navSections,
  brandBadge,
  brandBadgeVariant,
  brandTo,
  sidebarAriaLabel,
  navAriaLabel,
  breadcrumbRoot,
  getPageTitle,
  signOutTitle,
  signOutDescription,
  onLogout,
  containerClassName,
  children,
}) {
  const { user, logout, isAdmin } = useAuth();
  const { avatarUrl } = useCurrentUser();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileMenuOpen(false), []);
  const openMobile = useCallback(() => setMobileMenuOpen(true), []);
  const openSignOut = useCallback(() => setConfirmSignOut(true), []);

  const isAdminVariant = variant === 'admin';

  const resolvedBrandBadge = brandBadge || (isAdminVariant ? 'Admin' : 'Studio');
  const resolvedBrandBadgeVariant =
    brandBadgeVariant || (isAdminVariant ? 'destructive' : 'primary');
  const resolvedBrandTo = brandTo || (isAdminVariant ? '/admin' : '/dashboard');
  const resolvedSidebarAriaLabel =
    sidebarAriaLabel || (isAdminVariant ? 'Admin sidebar' : 'Workspace sidebar');
  const resolvedNavAriaLabel =
    navAriaLabel || (isAdminVariant ? 'Admin navigation' : 'Workspace navigation');
  const resolvedBreadcrumbRoot = breadcrumbRoot || (isAdminVariant ? 'Admin' : 'Studio');
  const resolvedGetPageTitle = getPageTitle || getWorkspacePageTitle;
  const resolvedNavSections = navSections || WORKSPACE_NAV_SECTIONS;
  const resolvedSignOutTitle =
    signOutTitle ||
    (isAdminVariant ? 'Sign out of Administrator Console?' : 'Sign out everywhere?');
  const resolvedSignOutDescription =
    signOutDescription ||
    (isAdminVariant
      ? 'Your administrative session will be ended securely.'
      : 'This ends your session on every device you are signed in on. Your drafts and published stories are safely saved.');

  const handleSignOut = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
      if (isAdminVariant) {
        navigate('/', { replace: true });
      }
    }
    setConfirmSignOut(false);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar & Accessible Mobile Drawer */}
      <WorkspaceSidebar
        pathname={pathname}
        user={user}
        avatarUrl={avatarUrl}
        isAdmin={isAdmin()}
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobile={closeMobile}
        onOpenSignOut={openSignOut}
        brandBadge={resolvedBrandBadge}
        brandBadgeVariant={resolvedBrandBadgeVariant}
        brandTo={resolvedBrandTo}
        sidebarAriaLabel={resolvedSidebarAriaLabel}
        navAriaLabel={resolvedNavAriaLabel}
        navSections={resolvedNavSections}
        userCardVariant={variant}
      />

      {/* Main Studio / Admin Frame */}
      <div className="flex flex-1 min-w-0 flex-col">
        <WorkspaceHeader
          pathname={pathname}
          onOpenMobile={openMobile}
          breadcrumbRoot={resolvedBreadcrumbRoot}
          getPageTitle={resolvedGetPageTitle}
        />

        <main className="flex-1 min-w-0 flex flex-col bg-background">
          {containerClassName ? (
            <div className={containerClassName}>{children || <Outlet />}</div>
          ) : (
            children || <Outlet />
          )}
        </main>
      </div>

      {/* Confirmation Sign Out Modal */}
      <ConfirmDialog
        open={confirmSignOut}
        onOpenChange={setConfirmSignOut}
        title={resolvedSignOutTitle}
        description={resolvedSignOutDescription}
        confirmText="Sign out"
        cancelText="Stay signed in"
        confirmVariant="danger"
        onConfirm={handleSignOut}
      />
    </div>
  );
}
