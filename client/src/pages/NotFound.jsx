import { Link, useLocation } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';
import { Button } from '../components/ui';

/**
 * 404 page with clean editorial typography and action links.
 */
export function NotFound() {
  const { pathname } = useLocation();

  return (
    <PageShell width="narrow">
      <div className="flex flex-col items-center text-center gap-4 py-20 sm:py-28">
        <p className="text-5xl sm:text-6xl font-black text-[hsl(var(--primary))] leading-none tabular-nums select-none">
          404
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">
          There is nothing at this address
        </h1>
        <p className="text-base sm:text-lg text-[hsl(var(--muted-foreground))] max-w-[44ch] leading-relaxed">
          The page may have been moved or deleted, or the link that brought you here may be
          incomplete.
        </p>
        <code className="inline-block max-w-full [overflow-wrap:anywhere] px-3 py-1.5 rounded-lg bg-[hsl(var(--muted))] text-sm text-[hsl(var(--muted-foreground))] select-all font-mono">
          {pathname}
        </code>
        <div className="flex items-center gap-3 flex-wrap justify-center mt-3">
          <Button as={Link} to="/">
            <Home className="h-4 w-4" /> Home
          </Button>
          <Button as={Link} to="/search" variant="secondary">
            <Compass className="h-4 w-4" /> Explore
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
