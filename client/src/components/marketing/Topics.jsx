import { topicIcon } from '../../utils/topicIcons';
import { cn } from '../../lib/utils';

/**
 * The scrolling band of topic names on the landing page.
 * Uses pure CSS marquee with seamless duplicate tracks and fade masks.
 */

const Band = ({ items, reverse, duration = 38 }) => (
  <div
    className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)] [-webkit-mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]"
  >
    <div
      style={{
        animationDuration: `${duration}s`,
      }}
      className={cn(
        'flex gap-3 w-max select-none',
        reverse ? 'animate-marquee-reverse' : 'animate-marquee',
        'motion-reduce:animate-none'
      )}
    >
      {[...items, ...items].map((name, index) => {
        const Icon = topicIcon(name);
        return (
          <div
            key={`${name}-${index}`}
            aria-hidden={index >= items.length}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[hsl(var(--card))] shadow-[0_1px_3px_rgba(0,0,0,0.05),inset_0_0_0_1px_rgba(255,255,255,0.06)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] text-sm font-medium text-[hsl(var(--foreground))] whitespace-nowrap"
          >
            <Icon className="h-4.5 w-4.5 text-[hsl(var(--primary))]" />
            {name}
          </div>
        );
      })}
    </div>
  </div>
);

const PLACEHOLDER = [
  'Technology',
  'Design',
  'Business',
  'Science',
  'Travel',
  'Programming',
  'Health',
  'Photography',
  'Lifestyle',
  'Food',
];

export function TopicMarquee({ topics = [], loading = false }) {
  const names = topics.length > 0 ? topics : loading ? PLACEHOLDER : [];

  if (names.length === 0) return null;

  const filled = [...names];
  while (filled.length < 6) filled.push(...names);

  const half = Math.ceil(filled.length / 2);

  return (
    <div className="flex flex-col gap-3 py-2">
      <Band items={filled.slice(0, half)} duration={38} />
      <Band items={filled.slice(half)} reverse duration={44} />
    </div>
  );
}
