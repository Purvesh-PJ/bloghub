import { PenLine, BarChart3, MessagesSquare } from 'lucide-react';
import { topicIcon } from '../../../utils/topicIcons';
import { cn } from '../../../lib/utils';

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

const DesignTopicIcon = topicIcon('design');

export function AuthShell({ children, badge = 'Welcome to BlogHub' }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-[1080px] grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] rounded-[28px] overflow-hidden bg-[hsl(var(--card))] border border-[var(--line-subtle)] shadow-[0_20px_50px_-12px_rgba(15,23,42,0.08),0_0_24px_-4px_rgba(14,165,233,0.12)]">
        {/* Left Side: Interactive Form Canvas */}
        <div className="flex flex-col justify-center px-6 py-10 sm:px-12 sm:py-16 md:px-16">
          <div className="w-full max-w-sm mx-auto flex flex-col gap-6">{children}</div>
        </div>

        {/* Right Side: Editorial Showcase Panel with Soft Ambient Glow */}
        <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[hsl(var(--muted))/0.5] via-[hsl(var(--card))] to-[hsl(var(--muted))/0.3] border-l border-[var(--line-subtle)] overflow-hidden">
          {/* Ambient Radial Bloom */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[hsl(var(--primary))/0.15] blur-3xl pointer-events-none select-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[hsl(var(--primary))/0.10] blur-3xl pointer-events-none select-none" />

          {/* Top Badge */}
          <div className="relative z-10 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[hsl(var(--primary))/0.12] text-[hsl(var(--primary))] text-xs font-semibold tracking-wide select-none">
              <DesignTopicIcon className="h-3.5 w-3.5" />
              {badge}
            </span>
          </div>

          {/* Middle: Value Proposition Pitch */}
          <div className="relative z-10 flex flex-col gap-6 my-auto py-8">
            <h2 className="text-2xl font-bold tracking-tight text-[hsl(var(--foreground))] leading-snug">
              A distraction-free canvas engineered for deep reading & honest words.
            </h2>

            <div className="flex flex-col gap-4 text-sm text-[hsl(var(--muted-foreground))]">
              <div className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-lg bg-[hsl(var(--primary))/0.12] text-[hsl(var(--primary))] flex items-center justify-center shrink-0 mt-0.5">
                  <PenLine className="h-4 w-4" />
                </div>
                <div>
                  <strong className="font-semibold text-[hsl(var(--foreground))] block">
                    Distraction-free Markdown
                  </strong>
                  Live preview, code highlighting, and auto-generated read times.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-lg bg-[hsl(var(--primary))/0.12] text-[hsl(var(--primary))] flex items-center justify-center shrink-0 mt-0.5">
                  <BarChart3 className="h-4 w-4" />
                </div>
                <div>
                  <strong className="font-semibold text-[hsl(var(--foreground))] block">
                    True Attention Telemetry
                  </strong>
                  Track genuine read-through rates instead of superficial empty clicks.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-lg bg-[hsl(var(--primary))/0.12] text-[hsl(var(--primary))] flex items-center justify-center shrink-0 mt-0.5">
                  <MessagesSquare className="h-4 w-4" />
                </div>
                <div>
                  <strong className="font-semibold text-[hsl(var(--foreground))] block">
                    Thoughtful Community
                  </strong>
                  Meaningful responses, curated topics, and zero sensational clickbait.
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Line */}
          <div className="relative z-10 pt-6 border-t border-[var(--line-subtle)] flex items-center justify-between text-xs text-[hsl(var(--muted-foreground))]">
            <span>Free & Open Source</span>
            <span>Crafted for writers</span>
          </div>
        </div>
      </div>
    </div>
  );
}
