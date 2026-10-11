import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../styles/ThemeProvider';
import { cn } from '../../lib/utils';

export const ThemeToggle = ({ className }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'inline-flex items-center justify-center w-9 h-9 rounded-full cursor-pointer select-none transition-all duration-150',
        'border border-black/10 dark:border-white/10 bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))]',
        'hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary))/0.4]',
        'active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
};
