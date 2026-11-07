import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { BrandMark } from '../../ui';
import { WorkspaceNav } from './WorkspaceNav';
import { WorkspaceUserCard } from './WorkspaceUserCard';
import { cn } from '../../../lib/utils';

export function WorkspaceSidebar({
  pathname,
  user,
  avatarUrl,
  isAdmin,
  mobileMenuOpen,
  onCloseMobile,
  onOpenSignOut,
}) {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-scrim backdrop-blur-sm md:hidden animate-in fade-in-0 duration-200"
        />
      )}

      {/* Sidebar Aside */}
      <aside
        className={cn(
          'w-[260px] md:w-[260px] shrink-0 flex flex-col p-5 bg-card sticky top-0 h-screen z-50 transition-transform duration-200 ease-out',
          'max-md:fixed max-md:left-0 max-md:top-0 max-md:bottom-0 max-md:w-[280px] max-md:shadow-2xl',
          mobileMenuOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-1 mb-6">
          <Link
            to="/dashboard"
            onClick={onCloseMobile}
            className="inline-flex items-center gap-2 text-base font-bold text-foreground tracking-tight"
          >
            <BrandMark letter="B" />
            <span>BlogHub</span>
            <span className="px-2 py-0.5 rounded-full bg-primary/12 text-primary text-2xs font-extrabold uppercase tracking-wider select-none">
              Studio
            </span>
          </Link>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close menu"
            className="inline-flex md:hidden items-center justify-center h-8 w-8 rounded-lg bg-muted text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <WorkspaceNav pathname={pathname} isAdmin={isAdmin} onCloseMobile={onCloseMobile} />

        {/* User Card */}
        <WorkspaceUserCard
          user={user}
          avatarUrl={avatarUrl}
          onOpenSignOut={onOpenSignOut}
          onCloseMobile={onCloseMobile}
        />
      </aside>
    </>
  );
}
