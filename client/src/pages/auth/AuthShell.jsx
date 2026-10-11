import { PenLine, BarChart3, MessagesSquare } from 'lucide-react';
import { topicIcon } from '../../utils/topicIcons';
import { cn } from '../../lib/utils';

/**
 * Shared shell for the auth pages (Login / Register).
 * High-end split screen:
 * - Left: Form side directly on surface
 * - Right: Showcase editorial showcase with soft cyan bloom and feature list
 */

export function AuthHeading({ className, children, ...props }) {
  return (
    <h1
      className={cn(
        'text-3xl sm:text-4xl font-bold tracking-tight text-[hsl(var(--foreground))] leading-tight',
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function AuthSubheading({ className, children, ...props }) {
  return (
    <p
      className={cn('text-base sm:text-lg text-[hsl(var(--muted-foreground))] -mt-3', className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function AuthForm({ className, children, ...props }) {
  return (
    <form className={cn('flex flex-col gap-4', className)} {...props}>
      {children}
    </form>
  );
}

export function AuthFooter({ className, children, ...props }) {
  return (
    <p
      className={cn(
        'text-sm text-[hsl(var(--muted-foreground))] [&_a]:text-[hsl(var(--primary))] [&_a]:font-medium hover:[&_a]:underline hover:[&_a]:underline-offset-4',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

const POINTS = [
  {
    icon: PenLine,
    title: 'Write in Markdown',
    text: 'Live preview, code blocks and cover images. Nothing to set up first.',
  },
  {
    icon: BarChart3,
    title: 'See who actually read it',
    text: 'Not just clicks. You also see how many people finished.',
  },
  {
    icon: MessagesSquare,
    title: 'Threaded conversation',
    text: 'Readers reply to each other, follow you and come back.',
  },
];

const TOPICS = ['Technology', 'Design', 'Science', 'Travel', 'Programming', 'Health', 'Food'];

export function AuthShell({ children }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-56px)] bg-[hsl(var(--background))]">
      {/* Form side */}
      <div className="flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-[400px] flex flex-col gap-6">
          {children}
        </div>
      </div>

      {/* Showcase side */}
      <aside className="relative overflow-hidden hidden lg:flex flex-col justify-center gap-8 p-12 lg:p-16 bg-[hsl(var(--card))] border-l border-[hsl(var(--border))/0.4]">
        {/* Soft Ambient Bloom */}
        <div
          aria-hidden="true"
          className="absolute -top-1/4 -right-1/4 w-[80%] aspect-square rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.20)_0%,rgba(56,189,248,0.06)_45%,transparent_70%)] pointer-events-none"
        />

        <div className="relative max-w-[460px] mx-auto w-full flex flex-col gap-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--primary))] mb-1">
              BlogHub
            </p>
            <p className="text-2xl lg:text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">
              A quieter place to publish what you write.
            </p>
          </div>

          <ul className="flex flex-col gap-5">
            {POINTS.map(({ icon: Icon, title, text: body }) => (
              <li key={title} className="flex gap-4 items-start">
                <span className="inline-flex items-center justify-center w-10 h-10 shrink-0 rounded-xl bg-gradient-to-tr from-[hsl(var(--primary))] to-sky-400 text-white shadow-[0_2px_8px_rgba(14,165,233,0.35)]">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[hsl(var(--foreground))]">{title}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5 leading-relaxed">{body}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2 pt-6 border-t border-[hsl(var(--border))/0.4]">
            {TOPICS.map((name) => {
              const Icon = topicIcon(name);
              return (
                <span
                  key={name}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[hsl(var(--muted))] text-xs font-medium text-[hsl(var(--muted-foreground))] select-none"
                >
                  <Icon className="h-3 w-3 text-[hsl(var(--primary))]" />
                  {name}
                </span>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
}
