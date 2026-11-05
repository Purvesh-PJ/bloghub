import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { BrandMark } from '../../../components/ui';
import { AdminNav } from './AdminNav';
import { AdminUserCard } from './AdminUserCard';
import { cn } from '../../../lib/utils';

/**
 * Responsive admin sidebar shell containing brand header, navigation, and user card.
 * Handles mobile drawer transition and accessible backdrop.
 */
export function AdminSidebar({
  pathname,
  mobileMenuOpen,
  onCloseMobile,
  onOpenSignOut,
}) {
  // Close drawer on Escape key press
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCloseMobile();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen, onCloseMobile]);

  return (
    <>
      {/* Accessible Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close navigation menu"
          onClick={onCloseMobile}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              onCloseMobile();
            }
          }}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in-0 duration-200 cursor-pointer"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        aria-label="Admin sidebar"
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
            onClick={onCloseMobile}
            className="inline-flex items-center gap-2 text-base font-bold text-[hsl(var(--foreground))] tracking-tight"
          >
            <BrandMark letter="B" />
            <span>BlogHub</span>
            <span className="px-2 py-0.5 rounded-full bg-[hsl(var(--destructive))/0.12] text-[hsl(var(--destructive))] text-[10px] font-extrabold uppercase tracking-wider select-none">
              Admin
            </span>
          </Link>
          <button
            onClick={onCloseMobile}
            aria-label="Close menu"
            className="inline-flex md:hidden items-center justify-center h-8 w-8 rounded-lg bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] cursor-pointer"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Navigation */}
        <AdminNav pathname={pathname} onNavigate={onCloseMobile} />

        {/* User Card */}
        <AdminUserCard onSignOut={onOpenSignOut} />
      </aside>
    </>
  );
}
