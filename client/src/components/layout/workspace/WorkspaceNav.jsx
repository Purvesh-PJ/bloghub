import { Link } from 'react-router-dom';
import { WORKSPACE_NAV_SECTIONS } from './workspaceNavConfig';
import { cn } from '../../../lib/utils';

const navItemClass = (active) =>
  cn(
    'relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 select-none cursor-pointer',
    active
      ? 'bg-primary/12 text-primary font-semibold before:content-[""] before:absolute before:-left-2 before:top-1/4 before:bottom-1/4 before:w-1 before:rounded-full before:bg-primary'
      : 'text-muted-foreground hover:text-foreground hover:bg-muted',
    '[&>svg]:shrink-0 [&>svg]:h-4 [&>svg]:w-4',
    active ? '[&>svg]:text-primary' : '[&>svg]:text-muted-foreground'
  );

/**
 * Semantic and accessible workspace sidebar navigation list.
 * Supports customizable section lists and handles active route highlighting.
 */
export function WorkspaceNav({
  pathname,
  isAdmin = false,
  onCloseMobile,
  sections = WORKSPACE_NAV_SECTIONS,
  ariaLabel = 'Workspace navigation',
}) {
  const isItemActive = (item) => {
    if (item.isShortcut) return false;
    if (item.isActive) return item.isActive(pathname);
    return item.exact ? pathname === item.to : pathname.startsWith(item.to);
  };

  return (
    <nav
      aria-label={ariaLabel}
      className="flex flex-col gap-1 flex-1 overflow-y-auto [scrollbar-width:thin]"
    >
      {sections.map((section, idx) => {
        if (section.adminOnly && !isAdmin) return null;

        return (
          <div key={section.id || section.title} className="flex flex-col gap-1">
            <span
              className={cn(
                'text-caption font-bold uppercase tracking-wider text-muted-foreground px-3 pb-1 select-none',
                idx === 0 ? 'pt-2' : 'pt-4'
              )}
            >
              {section.title}
            </span>
            <ul className="flex flex-col gap-1 p-0 m-0 list-none">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(item);

                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={navItemClass(active)}
                      onClick={onCloseMobile}
                      aria-current={active ? 'page' : undefined}
                    >
                      <Icon aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
