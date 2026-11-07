import { useNavigate } from 'react-router-dom';
import { PenLine, Compass, Sparkles, Check } from 'lucide-react';
import { Button } from '../../../components/ui';
import { HeroIllustration } from './HeroIllustration';

export function HomeHero({ startHref, startLabel }) {
  const navigate = useNavigate();

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full">
      <header className="pt-8 sm:pt-12 pb-4 grid grid-cols-1 lg:grid-cols-[1.12fr_0.88fr] items-center gap-10 lg:gap-14">
        <div className="flex flex-col items-start text-left gap-6 w-full">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-xs font-semibold text-primary select-none">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>A sanctuary for thoughtful writing</span>
          </div>

          {/* Hero Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15] max-w-[800px]">
            Where ideas find their voice & stories find{' '}
            <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent inline-block">
              curious minds.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-[660px]">
            BlogHub is a modern, distraction-free publishing space for writers, thinkers, and
            storytellers. Write effortlessly in Markdown, track genuine reader attention, and
            discover perspectives that broaden your world.
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <Button size="lg" onClick={() => navigate(startHref)}>
              <PenLine className="h-4 w-4" /> {startLabel}
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate('/search')}>
              <Compass className="h-4 w-4" /> Explore stories
            </Button>
          </div>

          {/* Feature Pills */}
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap pt-2 text-xs font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-primary" /> Pure Markdown Canvas
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-primary" /> True Read Completion Metrics
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-primary" /> 100% Free & Open
            </span>
          </div>
        </div>

        {/* Right Side Illustration */}
        <HeroIllustration />
      </header>
    </div>
  );
}
