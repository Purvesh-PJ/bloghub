import styled, { keyframes } from 'styled-components';
import {
  Cpu,
  Palette,
  Briefcase,
  Leaf,
  FlaskConical,
  Plane,
  Code2,
  HeartPulse,
  UtensilsCrossed,
  Camera,
  Rocket,
  BookOpen,
  Music,
  Landmark,
  Dumbbell,
  Globe2,
} from 'lucide-react';
import { text, label as labelStyle, interactive } from '../../styles/theme/mixins';

/**
 * Topic components.
 *
 * BlogHub is not a single-subject blog. One writer might cover databases while another
 * writes about cooking, and both belong here. That breadth is the first thing a visitor
 * needs to grasp, so the real topic list is shown rather than described.
 */

/** Known topics get a face; anything else falls back to a globe. */
const ICONS = {
  technology: Cpu,
  programming: Code2,
  design: Palette,
  business: Briefcase,
  lifestyle: Leaf,
  science: FlaskConical,
  travel: Plane,
  health: HeartPulse,
  food: UtensilsCrossed,
  photography: Camera,
  aerospace: Rocket,
  education: BookOpen,
  music: Music,
  finance: Landmark,
  fitness: Dumbbell,
};

export const topicIcon = (name = '') => ICONS[name.toLowerCase()] ?? Globe2;

/* ── Marquee ─────────────────────────────────────────────────────────────────
   Two bands drifting in opposite directions. The track is duplicated so the loop
   is seamless; `aria-hidden` on the clone keeps it out of the accessibility tree. */

const scrollLeft = keyframes`
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
`;

const scrollRight = keyframes`
  from { transform: translateX(-50%); }
  to   { transform: translateX(0); }
`;

const Viewport = styled.div`
  position: relative;
  overflow: hidden;
  /* Fade the ends so the band reads as continuous rather than cut off. */
  mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
`;

const Track = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  width: max-content;
  animation: ${({ $reverse }) => ($reverse ? scrollRight : scrollLeft)}
    ${({ $duration }) => $duration}s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Pill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.lineSubtle};
  ${text('md', 'medium')}
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;

  svg {
    width: 18px;
    height: 18px;
    color: ${({ theme }) => theme.colors.accentText};
  }
`;

const Band = ({ items, reverse, duration }) => (
  <Viewport>
    <Track $reverse={reverse} $duration={duration}>
      {[...items, ...items].map((name, index) => {
        const Icon = topicIcon(name);
        return (
          <Pill key={`${name}-${index}`} aria-hidden={index >= items.length}>
            <Icon />
            {name}
          </Pill>
        );
      })}
    </Track>
  </Viewport>
);

const MarqueeWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

/** Falls back to a representative spread when the API has not answered yet. */
const FALLBACK = [
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

export function TopicMarquee({ topics = [] }) {
  const names = topics.length >= 6 ? topics : FALLBACK;
  const half = Math.ceil(names.length / 2);

  return (
    <MarqueeWrap>
      <Band items={names.slice(0, half)} duration={38} />
      <Band items={names.slice(half)} reverse duration={44} />
    </MarqueeWrap>
  );
}

/* ── Topic grid ──────────────────────────────────────────────────────────────
   The same breadth, browsable. Post counts come from the API, so the section is
   honest about how much is actually there. */

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const Tile = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: left;

  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  ${interactive}

  &:hover {
    background: ${({ theme }) => theme.colors.accentContainer};
    transform: translateY(-3px);
  }

  &:hover svg,
  &:hover span {
    color: ${({ theme }) => theme.colors.accentText};
  }
`;

const TileIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceContainerHigh};
  color: ${({ theme }) => theme.colors.textSecondary};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const TileName = styled.span`
  ${text('md', 'semibold')}
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const TileCount = styled.span`
  ${labelStyle('sm')}
  color: ${({ theme }) => theme.colors.textMuted};
`;

export function TopicGrid({ categories = [], onSelect }) {
  return (
    <Grid>
      {categories.map((category) => {
        const Icon = topicIcon(category.name);
        const count = category.posts?.length ?? 0;

        return (
          <Tile key={category._id} onClick={() => onSelect?.(category)}>
            <TileIcon>
              <Icon />
            </TileIcon>
            <div>
              <TileName>{category.name}</TileName>
              <br />
              <TileCount>
                {count} {count === 1 ? 'story' : 'stories'}
              </TileCount>
            </div>
          </Tile>
        );
      })}
    </Grid>
  );
}
