import { useState, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar, AdminHeader, AdminSignOutModal } from './components';

/**
 * Admin shell.
 * Professional administrative control plane matching the design rhythm of the studio.
 * Orchestrates sidebar navigation, responsive mobile drawer, sticky topbar, and child routes.
 */
export function AdminLayout() {
  const { pathname } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  const closeMobile = useCallback(() => setMobileMenuOpen(false), []);
  const openMobile = useCallback(() => setMobileMenuOpen(true), []);
  const openSignOut = useCallback(() => setConfirmSignOut(true), []);

  return (
    <div className="flex min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {/* Admin Sidebar & Accessible Mobile Drawer */}
      <AdminSidebar
        pathname={pathname}
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobile={closeMobile}
        onOpenSignOut={openSignOut}
      />

      {/* Frame & Main Content Area */}
      <div className="flex flex-1 min-w-0 flex-col">
        <AdminHeader pathname={pathname} onOpenMobile={openMobile} />

        <main className="flex-1 min-w-0 flex flex-col bg-[hsl(var(--background))]">
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-16 sm:pb-24 flex flex-col gap-6 sm:gap-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Confirmation Sign Out Modal */}
      <AdminSignOutModal open={confirmSignOut} onOpenChange={setConfirmSignOut} />
    </div>
  );
}

