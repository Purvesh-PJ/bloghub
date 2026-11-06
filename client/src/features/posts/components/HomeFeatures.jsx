import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Feather,
  BarChart2,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  PenLine,
  ArrowRight,
  Compass,
  CheckCircle2,
} from 'lucide-react';

export function HomeFeatures({ startHref, startLabel }) {
  const navigate = useNavigate();

  return (
    <>
      {/* ── "Why BlogHub?" Bento Section ── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full">
        <div className="text-center flex flex-col items-center gap-1.5 mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[hsl(var(--primary))] select-none">
            <Layers className="h-3.5 w-3.5" /> Built for depth & clarity
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">
            Everything you need to write and connect
          </h2>
          <p className="text-sm sm:text-base text-[hsl(var(--muted-foreground))] max-w-xl">
            Thoughtfully built tools crafted to honor your words and your readers' time.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-3 p-6 sm:p-8 rounded-[24px] bg-[hsl(var(--card))] shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-[hsl(var(--primary))/0.12] text-[hsl(var(--primary))]">
              <Feather className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-[hsl(var(--foreground))] tracking-tight">Pure Markdown Canvas</h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
              Write in clean, effortless Markdown with live side-by-side preview, code syntax
              highlighting, cover image support, and distraction-free typography.
            </p>
          </div>

          <div className="flex flex-col gap-3 p-6 sm:p-8 rounded-[24px] bg-[hsl(var(--card))] shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-[hsl(var(--primary))/0.12] text-[hsl(var(--primary))]">
              <BarChart2 className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-[hsl(var(--foreground))] tracking-tight">Meaningful Read Metrics</h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
              Go far beyond superficial page clicks. Track how many readers actually finished your
              entire article and understand where your ideas truly resonate.
            </p>
          </div>

          <div className="flex flex-col gap-3 p-6 sm:p-8 rounded-[24px] bg-[hsl(var(--card))] shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-[hsl(var(--primary))/0.12] text-[hsl(var(--primary))]">
              <MessageCircle className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-[hsl(var(--foreground))] tracking-tight">Thoughtful Discussions</h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
              Engage with curious readers through threaded responses, meaningful reactions, and
              streamlined creator moderation tools.
            </p>
          </div>

          <div className="flex flex-col gap-3 p-6 sm:p-8 rounded-[24px] bg-[hsl(var(--card))] shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] hover:shadow-md transition-shadow sm:col-span-2">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-[hsl(var(--primary))/0.12] text-[hsl(var(--primary))]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-[hsl(var(--foreground))] tracking-tight">Complete Creative & Privacy Control</h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
              Keep works in progress safe with Private Drafts, test ideas privately with direct
              links, or publish publicly to the global feed with curated topics and custom tags.
            </p>
          </div>

          <div className="flex flex-col gap-3 p-6 sm:p-8 rounded-[24px] bg-[hsl(var(--card))] shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-[hsl(var(--primary))/0.12] text-[hsl(var(--primary))]">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-[hsl(var(--foreground))] tracking-tight">Serene Reading Sanctuary</h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
              No intrusive popups, no noisy advertising, and no clickbait algorithms. Just clean,
              fast-loading pages with effortless dark and light mode switching.
            </p>
          </div>
        </div>
      </div>

      {/* ── Closing CTA Section ── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full">
        <div className="relative rounded-[32px] sm:rounded-[36px] bg-gradient-to-tr from-[hsl(var(--primary))] to-sky-700 py-12 sm:py-16 px-6 sm:px-12 text-center text-white flex flex-col items-center gap-6 overflow-hidden shadow-[0_20px_40px_-15px_rgba(14,165,233,0.35)]">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight max-w-xl text-white">
            Have an idea or story worth sharing?
          </h2>
          <p className="text-sm sm:text-base text-white/90 max-w-lg leading-relaxed">
            Join a growing community of writers, creators, and curious thinkers. Start drafting in
            seconds with our distraction-free editor.
          </p>

          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
            <button
              onClick={() => navigate(startHref)}
              className="inline-flex items-center gap-2 h-12 px-6 rounded-full text-base font-bold bg-white text-sky-700 hover:bg-slate-50 transition-transform active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.15)] cursor-pointer"
            >
              <PenLine className="h-4 w-4" /> {startLabel} <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate('/search')}
              className="inline-flex items-center gap-2 h-12 px-6 rounded-full text-base font-semibold bg-white/15 text-white border-none backdrop-blur-md hover:bg-white/25 transition-transform active:scale-95 cursor-pointer"
            >
              <Compass className="h-4 w-4" /> Explore Stories
            </button>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center pt-2 text-xs font-medium text-white/85">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> 100% Free to publish
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> Markdown & Code native
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> Zero intrusive paywalls
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

