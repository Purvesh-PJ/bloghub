import {
  Sparkles,
  PenTool,
  BookOpen,
  Compass,
  Rocket,
  Palette,
  Heart,
  MessageSquare,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';

export function HeroIllustration() {
  return (
    <div className="relative w-full max-w-[520px] lg:max-w-[480px] mx-auto select-none max-lg:mt-6" aria-hidden="true">
      {/* Ambient Glow */}
      <div className="absolute top-[10%] left-[15%] w-[360px] h-[360px] rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.22)_0%,rgba(14,165,233,0.08)_40%,transparent_70%)] blur-[52px] pointer-events-none z-0 animate-pulse duration-1000" />

      {/* Floating Top Badge */}
      <div className="absolute -top-4 -right-2.5 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--card))] shadow-lg text-xs font-semibold text-[hsl(var(--foreground))] motion-safe:animate-bounce [animation-duration:6s]">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <span>#Ideas & Perspectives</span>
      </div>

      {/* Main Editorial Canvas Card */}
      <div className="relative z-10 bg-[hsl(var(--card))] rounded-[28px] sm:rounded-[36px] p-6 shadow-xl backdrop-blur-md transition-all hover:shadow-2xl">
        {/* Window Header */}
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[var(--line-subtle)]">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 opacity-80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 opacity-80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 opacity-80" />
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--primary))]">
            <PenTool className="w-3.5 h-3.5" />
            <span>Editorial Canvas</span>
          </div>
        </div>

        {/* Article Preview */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 flex-wrap mb-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[hsl(var(--primary))/0.12] text-[hsl(var(--primary))]">
              <Compass className="w-3 h-3" /> Explore
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[hsl(var(--primary))/0.12] text-[hsl(var(--primary))]">
              <Palette className="w-3 h-3" /> Design
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[hsl(var(--primary))/0.12] text-[hsl(var(--primary))]">
              <Rocket className="w-3 h-3" /> Tech
            </span>
          </div>

          <div className="text-base sm:text-lg font-bold text-[hsl(var(--foreground))] leading-snug tracking-tight">
            Crafting Ideas That Outlast the Algorithm
          </div>

          <div className="flex items-center gap-2.5 my-1.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              BH
            </div>
            <div className="text-xs text-[hsl(var(--muted-foreground))]">
              <strong className="text-[hsl(var(--foreground))]">Community Voice</strong>{' '}
              <span>· 3 min read</span>
            </div>
          </div>

          <div className="relative mt-1.5 p-3.5 rounded-xl bg-[hsl(var(--muted))/0.5] border-l-4 border-[hsl(var(--primary))] flex flex-col gap-1.5 text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
            <span className="text-[hsl(var(--foreground))] font-medium italic">
              &gt; Write for depth. Read for understanding. Connect with curious minds.
            </span>
            <span>
              A quiet, ad-free haven where thoughtful essays find a welcoming audience
              <span className="inline-block w-0.5 h-3 bg-[hsl(var(--primary))] ml-1 align-middle animate-pulse" />
            </span>
          </div>
        </div>
      </div>

      {/* Floating Bottom Card: Reading rate */}
      <div className="absolute -bottom-5 -left-3.5 z-20 flex items-center gap-3 p-3 px-4.5 rounded-[24px] bg-[hsl(var(--card))] shadow-xl">
        <div className="w-9 h-9 rounded-full bg-[hsl(var(--primary))/0.12] text-[hsl(var(--primary))] flex items-center justify-center">
          <BookOpen className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <strong className="text-sm font-bold text-[hsl(var(--foreground))] flex items-center gap-1">
            Deep Read Attention <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </strong>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">Zero popups · 100% ad-free</span>
        </div>
      </div>

      {/* Floating Interaction Pills */}
      <div className="absolute bottom-5 -right-3.5 z-20 flex items-center gap-3 py-2 px-3.5 rounded-full bg-[hsl(var(--card))] shadow-lg text-xs font-semibold text-[hsl(var(--muted-foreground))]">
        <span className="inline-flex items-center gap-1">
          <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> 248
        </span>
        <span className="inline-flex items-center gap-1">
          <MessageSquare className="w-3.5 h-3.5 text-[hsl(var(--primary))]" /> 42
        </span>
        <span className="inline-flex items-center gap-1">
          <Bookmark className="w-3.5 h-3.5 text-indigo-500" /> 95
        </span>
      </div>
    </div>
  );
}
