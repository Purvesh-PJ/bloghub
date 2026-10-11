import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  Hash,
  Activity,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
  Compass,
  Globe,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { BrandMark, Avatar, Modal, Button } from '../ui';
import { cn } from '../../lib/utils';

/**
 * Admin shell.
 * Professional administrative control plane matching the design rhythm of the studio.
 */
export function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  const isActive = (path, exact) => (exact ? pathname === path : pathname.startsWith(path));

  const getPageTitle = () => {
    if (pathname === '/admin') return 'Overview';
    if (pathname.startsWith('/admin/posts')) return 'Posts';
    if (pathname.startsWith('/admin/tags')) return 'Tags & Topics';
    if (pathname.startsWith('/admin/users')) return 'People';
    if (pathname.startsWith('/admin/activity')) return 'Activity';
    return 'Admin Console';
  };

  const closeMobile = () => setMobileMenuOpen(false);

  const navItemClass = (active) =>
    cn(
      'relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 select-none cursor-pointer',
      active
        ? 'bg-[hsl(var(--primary))/0.12] text-[hsl(var(--primary))] font-semibold before:content-[""] before:absolute before:-left-2 before:top-1/4 before:bottom-1/4 before:w-1 before:rounded-full before:bg-[hsl(var(--primary))]'
        : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]',
      '[&>svg]:shrink-0 [&>svg]:h-4 [&>svg]:w-4',
      active ? '[&>svg]:text-[hsl(var(--primary))]' : '[&>svg]:text-[hsl(var(--muted-foreground))]'
    );

  return (
    <div className="flex min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={closeMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in-0 duration-200"
        />
      )}

      {/* Admin Sidebar */}
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
            to="/admin"
            onClick={closeMobile}
            className="inline-flex items-center gap-2 text-base font-bold text-[hsl(var(--foreground))] tracking-tight"
          >
            <BrandMark letter="B" />
            <span>BlogHub</span>
            <span className="px-2 py-0.5 rounded-full bg-[hsl(var(--destructive))/0.12] text-[hsl(var(--destructive))] text-[10px] font-extrabold uppercase tracking-wider select-none">
              Admin
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

        {/* Navigation */}
        <nav className="flex flex-col gap-1 flex-1 overflow-y-auto [scrollbar-width:thin]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))] px-3 pt-2 pb-1 select-none">
            Dashboard
          </span>
          <Link
            to="/admin"
            className={navItemClass(isActive('/admin', true))}
            onClick={closeMobile}
          >
            <LayoutDashboard /> Overview
          </Link>

          <span className="text-[11px] font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))] px-3 pt-4 pb-1 select-none">
            Management
          </span>
          <Link
            to="/admin/posts"
            className={navItemClass(isActive('/admin/posts'))}
            onClick={closeMobile}
          >
            <FileText /> Posts
          </Link>
          <Link
            to="/admin/tags"
            className={navItemClass(isActive('/admin/tags'))}
            onClick={closeMobile}
          >
            <Hash /> Tags & Topics
          </Link>
          <Link
            to="/admin/users"
            className={navItemClass(isActive('/admin/users'))}
            onClick={closeMobile}
          >
            <Users /> People
          </Link>

          <span className="text-[11px] font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))] px-3 pt-4 pb-1 select-none">
            Insights
          </span>
          <Link
            to="/admin/activity"
            className={navItemClass(isActive('/admin/activity'))}
            onClick={closeMobile}
          >
            <Activity /> Activity
          </Link>

          <span className="text-[11px] font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))] px-3 pt-4 pb-1 select-none">
            Shortcuts
          </span>
          <Link to="/dashboard" className={navItemClass(false)} onClick={closeMobile}>
            <Compass /> Creator Studio
          </Link>
          <Link to="/" className={navItemClass(false)} onClick={closeMobile}>
            <Globe /> Public Feed
          </Link>
        </nav>

        {/* Admin Footer Profile */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[hsl(var(--muted))/0.5] border border-[var(--line-subtle)] gap-2 mt-auto">
          <div className="flex items-center gap-2.5 min-w-0 flex-1 p-0.5">
            <Avatar name={user?.username} size="sm" />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-[hsl(var(--foreground))] truncate">
                {user?.username}
              </span>
              <span className="text-[11px] font-medium text-[hsl(var(--destructive))] flex items-center gap-1">
                <Shield className="h-2.5 w-2.5" /> Administrator
              </span>
            </div>
          </div>
          <button
            onClick={() => setConfirmSignOut(true)}
            aria-label="Sign out"
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive))/0.10] transition-colors shrink-0 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* Frame & Topbar */}
      <div className="flex flex-1 min-w-0 flex-col">
        <header className="flex items-center justify-between h-14 px-4 sm:px-6 bg-[hsl(var(--background))/0.85] backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="inline-flex md:hidden items-center justify-center h-9 w-9 rounded-lg border border-[var(--line-subtle)] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] cursor-pointer"
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--muted-foreground))] select-none">
              <span className="text-[hsl(var(--muted-foreground))]">Admin</span>
              <ChevronRight className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
              <strong className="text-[hsl(var(--foreground))] font-semibold">{getPageTitle()}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </header>

        {/* Content Region */}
        <main className="flex-1 min-w-0 flex flex-col bg-[hsl(var(--background))]">
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-16 sm:pb-24 flex flex-col gap-6 sm:gap-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Confirmation Modal */}
      <Modal
        open={confirmSignOut}
        onOpenChange={setConfirmSignOut}
        title="Sign out of Administrator Console?"
        description="Your administrative session will be ended securely."
      >
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmSignOut(false)}>
            Stay signed in
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            Sign out
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
