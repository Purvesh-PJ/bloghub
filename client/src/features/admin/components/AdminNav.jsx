import { Link } from 'react-router-dom';
import { ADMIN_NAV_SECTIONS } from './adminNavConfig';
import { cn } from '../../../lib/utils';

const navItemClass = (active) =>
  cn(
    'relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 select-none cursor-pointer',
    active
      ? 'bg-[hsl(var(--primary))/0.12] text-[hsl(var(--primary))] font-semibold before:content-[""] before:absolute before:-left-2 before:top-1/4 before:bottom-1/4 before:w-1 before:rounded-full before:bg-[hsl(var(--primary))]'
      : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]',
    '[&>svg]:shrink-0 [&>svg]:h-4 [&>svg]:w-4',
    active ? '[&>svg]:text-[hsl(var(--primary))]' : '[&>svg]:text-[hsl(var(--muted-foreground))]'
  );

/**
 * Semantic and accessible admin sidebar navigation list.
 */
export function AdminNav({ pathname, onNavigate }) {
  const isItemActive = (item) => {
    if (item.isShortcut) return false;
    return item.exact ? pathname === item.to : pathname.startsWith(item.to);
  };

  return (
    <nav
      aria-label="Admin navigation"
      className="flex flex-col gap-1 flex-1 overflow-y-auto [scrollbar-width:thin]"
    >
      {ADMIN_NAV_SECTIONS.map((section, sectionIdx) => (
        <div key={section.id} className="flex flex-col gap-1">
          <span
            className={cn(
              'text-[11px] font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))] px-3 pb-1 select-none',
              sectionIdx === 0 ? 'pt-2' : 'pt-4'
            )}
          >
            {section.title}
          </span>
          <ul className="flex flex-col gap-1 p-0 m-0 list-none">
            {section.items.map((item) => {
              const active = isItemActive(item);
              const Icon = item.icon;

              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onNavigate}
                    aria-current={active ? 'page' : undefined}
                    className={navItemClass(active)}
                  >
                    <Icon aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
