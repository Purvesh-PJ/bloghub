/**
 * Lets a keyboard user jump past the header straight to the page content.
 * Hidden off-screen until focused for a11y keyboard accessibility.
 */
export function SkipLink({ targetId = 'main-content' }) {
  return (
    <a
      href={`#${targetId}`}
      className="absolute left-4 top-4 z-50 -translate-y-24 focus:translate-y-0 px-4 py-2 rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-semibold shadow-lg transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      Skip to content
    </a>
  );
}
