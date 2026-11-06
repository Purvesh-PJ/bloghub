import { useState, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth';
import { useCurrentUser } from '../../features/users';
import {
  WorkspaceSidebar,
  WorkspaceHeader,
  WorkspaceSignOutModal,
} from './workspace';

/**
 * WorkspaceLayout — Creator studio shell.
 * Orchestrates desktop sidebar, accessible mobile drawer, sticky studio topbar, and child routes.
 */
export function WorkspaceLayout() {
  const { user, logout, isAdmin } = useAuth();
  const { avatarUrl } = useCurrentUser();
  const { pathname } = useLocation();

  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileMenuOpen(false), []);
  const openMobile = useCallback(() => setMobileMenuOpen(true), []);
  const openSignOut = useCallback(() => setConfirmSignOut(true), []);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Studio Sidebar & Mobile Drawer */}
      <WorkspaceSidebar
        pathname={pathname}
        user={user}
        avatarUrl={avatarUrl}
        isAdmin={isAdmin()}
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobile={closeMobile}
        onOpenSignOut={openSignOut}
      />

      {/* Main Studio Frame */}
      <div className="flex flex-1 min-w-0 flex-col">
        <WorkspaceHeader pathname={pathname} onOpenMobile={openMobile} />

        <main className="flex-1 min-w-0 flex flex-col bg-background">
          <Outlet />
        </main>
      </div>

      {/* Sign Out Confirmation Modal */}
      <WorkspaceSignOutModal
        open={confirmSignOut}
        onOpenChange={setConfirmSignOut}
        onLogout={logout}
      />
    </div>
  );
}
