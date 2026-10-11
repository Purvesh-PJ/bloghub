import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, PenLine, User, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { ThemeToggle } from './ThemeToggle';
import { Button, DropdownMenu, BrandMark, Avatar } from '../ui';
import { cn } from '../../lib/utils';

/**
 * Header — a floating glass bar with BlogHub signature visual identity.
 * Pill search with ⌘K, soft ambient avatar glow, frosted glass blur, and responsive action items.
 */
export function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { avatarUrl } = useCurrentUser();

  // Global ⌘K / Ctrl+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        navigate('/search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[hsl(var(--background))/0.85] backdrop-blur-xl backdrop-saturate-180">
      <div className="max-w-[1200px] mx-auto h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-6 min-w-0">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 text-base font-bold tracking-tight text-[hsl(var(--foreground))] shrink-0 transition-opacity hover:opacity-85"
          >
            <BrandMark letter="B" />
            <span>BlogHub</span>
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Button (Pill shaped with ⌘K) */}
          <button
            onClick={() => navigate('/search')}
            aria-label="Search stories (⌘K)"
            className={cn(
              'inline-flex items-center gap-2 h-[34px] px-2.5 sm:px-3 rounded-full text-xs font-medium cursor-pointer transition-all duration-150 select-none',
              'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] border border-black/10 dark:border-white/10',
              'hover:bg-[hsl(var(--muted))/0.6] hover:border-[hsl(var(--primary))/0.4] hover:text-[hsl(var(--foreground))]'
            )}
          >
            <Search className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline opacity-80">Search...</span>
            <kbd className="hidden sm:inline-flex items-center font-sans text-[10px] px-1.5 py-0.5 rounded bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] border border-black/10 dark:border-white/10">
              ⌘K
            </kbd>
          </button>

          <ThemeToggle />

          {isAuthenticated ? (
            <>
              {/* Write Post (Pill primary button with ambient glow) */}
              <span className="hidden sm:inline-flex">
                <Button size="sm" onClick={() => navigate('/write')}>
                  <PenLine className="h-3.5 w-3.5" /> Write
                </Button>
              </span>

              {/* User Dropdown */}
              <DropdownMenu
                trigger={
                  <button
                    aria-label="Account menu"
                    className="inline-flex rounded-full p-0 border-none bg-none cursor-pointer transition-transform duration-150 hover:scale-105 shadow-[0_2px_8px_rgba(14,165,233,0.35)] hover:shadow-[0_4px_12px_rgba(14,165,233,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Avatar src={avatarUrl} name={user?.username} size="sm" />
                  </button>
                }
              >
                <div className="px-3 py-2.5 border-b border-[hsl(var(--border))] mb-1">
                  <div className="text-sm font-semibold text-[hsl(var(--foreground))] truncate">
                    {user?.username}
                  </div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))] truncate">
                    {user?.email}
                  </div>
                </div>

                {isAdmin() && (
                  <>
                    <DropdownMenu.Item onSelect={() => navigate('/admin')}>
                      <LayoutDashboard className="h-4 w-4" /> Admin dashboard
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator />
                  </>
                )}

                <DropdownMenu.Item onSelect={() => navigate('/dashboard')}>
                  <LayoutDashboard className="h-4 w-4" /> Creator Studio
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => navigate(`/user/${user?.user_id || user?._id}`)}>
                  <User className="h-4 w-4" /> My Public Profile
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => navigate('/settings')}>
                  <Settings className="h-4 w-4" /> Settings
                </DropdownMenu.Item>

                <DropdownMenu.Separator />

                <DropdownMenu.Item tone="danger" onSelect={handleLogout}>
                  <LogOut className="h-4 w-4" /> Sign out
                </DropdownMenu.Item>
              </DropdownMenu>
            </>
          ) : (
            <>
              <span className="hidden sm:inline-flex">
                <Button size="sm" variant="ghost" onClick={() => navigate('/login')}>
                  Sign in
                </Button>
              </span>
              <Button size="sm" onClick={() => navigate('/register')}>
                Get started
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
