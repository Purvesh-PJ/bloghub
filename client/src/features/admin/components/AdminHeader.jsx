import { Menu, ChevronRight } from 'lucide-react';
import { ThemeToggle } from '../../../components/layout/ThemeToggle';
import { getAdminPageTitle } from './adminNavConfig';

/**
 * Sticky topbar for the admin console with breadcrumb navigation and theme controls.
 */
export function AdminHeader({ pathname, onOpenMobile }) {
  const pageTitle = getAdminPageTitle(pathname);

  return (
    <header className="flex items-center justify-between h-14 px-4 sm:px-6 bg-background/85 backdrop-blur-xl sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          aria-label="Open navigation menu"
          className="inline-flex md:hidden items-center justify-center h-9 w-9 rounded-lg border border-border bg-card text-foreground cursor-pointer"
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground select-none">
          <span className="text-muted-foreground">Admin</span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          <strong className="text-foreground font-semibold">{pageTitle}</strong>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
      </div>
    </header>
  );
}
