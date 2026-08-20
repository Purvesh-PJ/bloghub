import styled, { keyframes } from 'styled-components';
import { text } from '../../styles/theme/mixins';
import { topicIcon } from '../../utils/topicIcons';

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

/**
 * Shown only while the tag endpoint has not answered, so the band is not empty on first
 * paint. Deliberately not a floor to pad a short list up to: the condition here used to be
 * `topics.length >= 6 ? topics : FALLBACK`, which meant a site with five real topics
 * displayed ten invented ones instead of its own — the marquee claimed a breadth of subject
 * matter the site did not have, and hid the subjects it did.
 */
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

/**
 * The scrolling band of topic names on the landing page.
 *
 * Decorative — the pills are not links. Real topics are used whenever there are any, however
 * few; a short list simply repeats sooner, which is honest about a young site.
 *
 * @param {object} props
 * @param {string[]} props.topics topic names from the API
 * @param {boolean} [props.loading] true while the endpoint is still answering
 */
export function TopicMarquee({ topics = [], loading = false }) {
  const names = topics.length > 0 ? topics : loading ? PLACEHOLDER : [];

  // Nothing published under any topic yet: an empty band is better than an invented one.
  if (names.length === 0) return null;

  /*
    Each band repeats its items twice to loop seamlessly, so a very short list would leave a
    visible gap mid-scroll. Repeat it up to a workable length first.
  */
  const filled = [...names];
  while (filled.length < 6) filled.push(...names);

  const half = Math.ceil(filled.length / 2);

  return (
    <MarqueeWrap>
      <Band items={filled.slice(0, half)} duration={38} />
      <Band items={filled.slice(half)} reverse duration={44} />
    </MarqueeWrap>
  );
}
