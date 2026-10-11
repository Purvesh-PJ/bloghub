import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  PenLine,
  Settings,
  LogOut,
  Globe,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  FileText,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { ThemeToggle } from './ThemeToggle';
import { Button, Avatar, Modal, BrandMark } from '../ui';
import { cn } from '../../lib/utils';

export function WorkspaceLayout() {
  const { user, logout, isAdmin } = useAuth();
  const { avatarUrl } = useCurrentUser();
  const location = useLocation();
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userId = user?._id || user?.user_id;

  const getPageTitle = () => {
    if (location.pathname === '/dashboard') return 'Dashboard';
    if (location.pathname === '/stories') return 'Stories';
    if (location.pathname.startsWith('/write')) return 'Write Story';
    if (location.pathname.startsWith('/edit')) return 'Edit Story';
    if (location.pathname === '/comments') return 'Responses';
    if (location.pathname === '/settings') return 'Settings';
    return 'Creator Studio';
  };

  const closeMobile = () => setMobileMenuOpen(false);

  const navItemClass = (isActive) =>
    cn(
      'relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 select-none cursor-pointer',
      isActive
        ? 'bg-[hsl(var(--primary))/0.12] text-[hsl(var(--primary))] font-semibold before:content-[""] before:absolute before:-left-2 before:top-1/4 before:bottom-1/4 before:w-1 before:rounded-full before:bg-[hsl(var(--primary))]'
        : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]',
      '[&>svg]:shrink-0 [&>svg]:h-4 [&>svg]:w-4',
      isActive ? '[&>svg]:text-[hsl(var(--primary))]' : '[&>svg]:text-[hsl(var(--muted-foreground))]'
    );

  return (
    <div className="flex min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={closeMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in-0 duration-200"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'w-[260px] md:w-[260px] shrink-0 flex flex-col p-5 bg-[hsl(var(--card))] sticky top-0 h-screen z-50 transition-transform duration-200 ease-out',
          'max-md:fixed max-md:left-0 max-md:top-0 max-md:bottom-0 max-md:w-[280px] max-md:shadow-2xl',
          mobileMenuOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-1 mb-6">
          <Link
            to="/dashboard"
            onClick={closeMobile}
            className="inline-flex items-center gap-2 text-base font-bold text-[hsl(var(--foreground))] tracking-tight"
          >
            <BrandMark letter="B" />
            <span>BlogHub</span>
            <span className="px-2 py-0.5 rounded-full bg-[hsl(var(--primary))/0.12] text-[hsl(var(--primary))] text-[10px] font-extrabold uppercase tracking-wider select-none">
              Studio
            </span>
          </Link>
          <button
            onClick={closeMobile}
            aria-label="Close menu"
            className="inline-flex md:hidden items-center justify-center h-8 w-8 rounded-lg bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex flex-col gap-1 flex-1 overflow-y-auto [scrollbar-width:thin]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))] px-3 pt-2 pb-1 select-none">
            Workspace
          </span>
          <Link
            to="/dashboard"
            className={navItemClass(location.pathname === '/dashboard')}
            onClick={closeMobile}
          >
            <LayoutDashboard /> Dashboard
          </Link>
          <Link
            to="/stories"
            className={navItemClass(location.pathname === '/stories' || location.pathname.startsWith('/edit'))}
            onClick={closeMobile}
          >
            <FileText /> Stories
          </Link>
          <Link
            to="/write"
            className={navItemClass(location.pathname.startsWith('/write'))}
            onClick={closeMobile}
          >
            <PenLine /> Write
          </Link>
          <Link
            to="/comments"
            className={navItemClass(location.pathname === '/comments')}
            onClick={closeMobile}
          >
            <MessageSquare /> Responses
          </Link>

          <span className="text-[11px] font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))] px-3 pt-4 pb-1 select-none">
            Preferences
          </span>
          <Link
            to="/settings"
            className={navItemClass(location.pathname === '/settings')}
            onClick={closeMobile}
          >
            <Settings /> Settings
          </Link>

          {isAdmin() && (
            <>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))] px-3 pt-4 pb-1 select-none">
                Management
              </span>
              <Link to="/admin" className={navItemClass(false)} onClick={closeMobile}>
                <ShieldCheck /> Admin Console
              </Link>
            </>
          )}

          <span className="text-[11px] font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))] px-3 pt-4 pb-1 select-none">
            Explore
          </span>
          <Link to="/" className={navItemClass(false)} onClick={closeMobile}>
            <Globe /> Public Feed
          </Link>
        </nav>

        {/* User Card at Bottom */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[hsl(var(--muted))/0.5] border border-[hsl(var(--border))/0.5] gap-2 mt-auto">
          <Link
            to={userId ? `/user/${userId}` : '/settings'}
            title="View Public Profile"
            onClick={closeMobile}
            className="flex items-center gap-2.5 min-w-0 flex-1 rounded-md p-0.5 group transition-colors"
          >
            <Avatar src={avatarUrl} name={user?.username} size="sm" />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] truncate transition-colors">
                {user?.username || 'Creator'}
              </span>
              <span className="text-[11px] font-medium text-[hsl(var(--primary))] flex items-center gap-1">
                Public Profile <ExternalLink className="h-2.5 w-2.5" />
              </span>
            </div>
          </Link>
          <button
            onClick={() => setConfirmSignOut(true)}
            aria-label="Sign out"
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive))/0.10] transition-colors shrink-0 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* Main Studio Frame */}
      <div className="flex flex-1 min-w-0 flex-col">
        {/* Studio Topbar */}
        <header className="flex items-center justify-between h-14 px-4 sm:px-6 bg-[hsl(var(--background))/0.85] backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="inline-flex md:hidden items-center justify-center h-9 w-9 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] cursor-pointer"
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--muted-foreground))] select-none">
              <span className="text-[hsl(var(--muted-foreground))]">Studio</span>
              <ChevronRight className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
              <strong className="text-[hsl(var(--foreground))] font-semibold">{getPageTitle()}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 min-w-0 flex flex-col bg-[hsl(var(--background))]">
          <Outlet />
        </main>
      </div>

      {/* Sign Out Confirmation Modal */}
      <Modal
        open={confirmSignOut}
        onOpenChange={setConfirmSignOut}
        title="Sign out everywhere?"
        description="This ends your session on every device you are signed in on. Your drafts and published stories are safely saved."
      >
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmSignOut(false)}>
            Stay signed in
          </Button>
          <Button variant="danger" onClick={logout}>
            Sign out
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
