import { Link } from 'react-router-dom';
import { Github, PenLine, Compass, Heart } from 'lucide-react';
import { useTags } from '../../features/posts';
import { BrandMark } from '../ui';
import { cn } from '../../lib/utils';

/**
 * Footer — high-end editorial footer with ambient watermark,
 * aligned gutters, and purposeful community discovery.
 */
const TOPIC_COUNT = 6;

export function Footer() {
  const { tags } = useTags({ withPostsOnly: true });
  const topics = tags.slice(0, TOPIC_COUNT);

  return (
    <footer className="relative overflow-hidden mt-20 pt-16 pb-8 bg-muted/25">
      {/* Background Ambient Watermark */}
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[clamp(70px,14vw,160px)] font-black tracking-tighter text-foreground/[0.03] select-none pointer-events-none whitespace-nowrap z-0">
        bloghub
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12 items-start">
          {/* Brand Identity & Mission */}
          <div className="flex flex-col gap-3 max-w-md">
            <div className="flex items-center gap-2.5">
              <BrandMark letter="B" />
              <span className="text-base font-bold tracking-tight text-foreground">BlogHub</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold select-none">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                Open Source
              </span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              A distraction-free publishing space for writers, thinkers, and curious minds. Pure
              Markdown canvas, true read attention metrics, and zero ads.
            </p>
          </div>

          {/* Quick Discover Pathways */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Explore
            </h4>
            <div className="flex flex-col gap-2.5">
              <Link
                to="/search"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:translate-x-0.5 transition-all duration-150 w-fit group"
              >
                <Compass className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                Discover Stories
              </Link>
              <Link
                to="/write"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:translate-x-0.5 transition-all duration-150 w-fit group"
              >
                <PenLine className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                Write an Article
              </Link>
              <a
                href="https://github.com/Purvesh-PJ/bloghub"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:translate-x-0.5 transition-all duration-150 w-fit group"
              >
                <Github className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                GitHub Repository
              </a>
            </div>
          </div>

          {/* Popular Community Topics */}
          {topics.length > 0 && (
            <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Popular Topics
              </h4>
              <div className="flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <Link
                    key={topic._id ?? topic.name}
                    to={`/search?topic=${encodeURIComponent(topic.name)}`}
                    className={cn(
                      'text-xs font-medium px-2.5 py-1 rounded-full transition-all duration-150 select-none',
                      'bg-card text-muted-foreground border-none shadow-none',
                      'hover:bg-primary/10 hover:text-primary hover:-translate-y-0.5'
                    )}
                  >
                    #{topic.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-12 pt-6 border-t border-border text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} BlogHub · All stories belong to their authors</span>
          <span className="inline-flex items-center gap-1.5">
            Crafted with <Heart className="h-3 w-3 text-destructive fill-destructive" /> for open
            web publishing
          </span>
        </div>
      </div>
    </footer>
  );
}
