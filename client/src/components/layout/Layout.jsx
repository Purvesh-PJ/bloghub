import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { SkipLink } from './SkipLink';

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] transition-colors duration-200">
      <SkipLink />
      <Header />
      {/* tabIndex={-1} so the skip link can move focus here, not just scroll to it. */}
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
