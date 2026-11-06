import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { Card } from '../../../components/ui';
import { cn } from '../../../lib/utils';

const THEMES = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Monitor },
];

export function AppearanceSettings({ preference, onThemeChange }) {
  return (
    <Card tone="low" radius="xl" padding="2xl" className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[hsl(var(--foreground))]">
          Appearance
        </h2>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
          System follows whatever your device is set to, and changes with it.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {THEMES.map(({ id, label, icon: Icon }) => {
          const isActive = preference === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onThemeChange(id)}
              aria-pressed={isActive}
              className={cn(
                'relative flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all cursor-pointer select-none',
                isActive
                  ? 'bg-[hsl(var(--primary))/0.12] text-[hsl(var(--primary))] border-[hsl(var(--primary))] shadow-sm'
                  : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] border-transparent hover:bg-[hsl(var(--muted))/0.8]'
              )}
            >
              {isActive && (
                <span className="absolute top-3 right-3 flex items-center justify-center w-5 h-5 rounded-full bg-[hsl(var(--primary))] text-white">
                  <Check className="w-3 h-3" />
                </span>
              )}
              <Icon className="w-6 h-6" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

