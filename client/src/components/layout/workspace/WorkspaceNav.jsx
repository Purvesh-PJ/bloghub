import { Link } from 'react-router-dom';
import { WORKSPACE_NAV_SECTIONS } from './workspaceNavConfig';
import { cn } from '../../../lib/utils';

export function WorkspaceNav({ pathname, isAdmin, onCloseMobile }) {
  const navItemClass = (isActive) =>
    cn(
      'relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 select-none cursor-pointer',
      isActive
        ? 'bg-primary/12 text-primary font-semibold before:content-[""] before:absolute before:-left-2 before:top-1/4 before:bottom-1/4 before:w-1 before:rounded-full before:bg-primary'
        : 'text-muted-foreground hover:text-foreground hover:bg-muted',
      '[&>svg]:shrink-0 [&>svg]:h-4 [&>svg]:w-4',
      isActive ? '[&>svg]:text-primary' : '[&>svg]:text-muted-foreground'
    );

  return (
    <nav className="flex flex-col gap-1 flex-1 overflow-y-auto [scrollbar-width:thin]">
      {WORKSPACE_NAV_SECTIONS.map((section, idx) => {
        if (section.adminOnly && !isAdmin) return null;

        return (
          <div key={section.title} className="flex flex-col gap-1">
            <span
              className={cn(
                'text-caption font-bold uppercase tracking-wider text-muted-foreground px-3 pb-1 select-none',
                idx === 0 ? 'pt-2' : 'pt-4'
              )}
            >
              {section.title}
            </span>
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = item.isActive ? item.isActive(pathname) : pathname === item.to;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={navItemClass(active)}
                  onClick={onCloseMobile}
                >
                  <Icon /> {item.label}
                </Link>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
}
