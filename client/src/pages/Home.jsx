import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { ArrowRight, PenLine, BarChart3 } from 'lucide-react';
import { postService } from '../services/postService';
import { categoryService } from '../services/categoryService';
import { useAuth } from '../context/AuthContext';
import { Button, Chip, Surface, Loading } from '../components/ui';
import { PostCard } from '../components/posts/PostCard';
import {
  ReadGapIllustration,
  VisibilityFlow,
  CommentThread,
} from '../components/marketing/Illustrations';
import { AnalyticsMockup } from '../components/marketing/Mockups';
import { FeatureGrid } from '../components/marketing/FeatureGrid';
import { TopicMarquee, TopicGrid } from '../components/marketing/Topics';
import { display, text, label, media } from '../styles/theme/mixins';

/**
 * Landing page.
 *
 * Built as an argument rather than a feature list. The platform's one genuine difference is
 * that it separates a view from a read, so the page opens with that gap, explains it, and
 * only then shows the rest of the product. Every illustration teaches the point beside it.
 */

/* ── Shell ───────────────────────────────────────────────────────────────────── */

const Page = styled.div`
  overflow-x: clip;
`;

const Shell = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.xl};
`;

const Section = styled.section`
  padding: ${({ theme }) => theme.spacing['3xl']} 0;

  ${media.down('md')`padding: ${({ theme }) => theme.spacing['2xl']} 0;`}
`;

const Eyebrow = styled.p`
  ${label('md')}
  color: ${({ theme }) => theme.colors.accentText};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const H2 = styled.h2`
  ${display('lg')}
  color: ${({ theme }) => theme.colors.textPrimary};

  ${media.down('md')`font-size: ${({ theme }) => theme.display.md[0]};`}
`;

const Lead = styled.p`
  ${text('xl')}
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.lg};
  max-width: 620px;
`;

/* ── Hero ────────────────────────────────────────────────────────────────────── */

const Hero = styled.header`
  position: relative;
  padding: ${({ theme }) => theme.spacing['4xl']} 0 ${({ theme }) => theme.spacing['2xl']};
`;

/* Asymmetric rather than centred. A centred column of text with buttons under it is the
   default every template ships with; an off-centre split gives the eye somewhere to go. */
const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: ${({ theme }) => theme.spacing['4xl']};
  align-items: end;

  ${media.down('lg')`
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing['2xl']};
  `}
`;

const HeroAside = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
`;

const AsideStat = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lineSubtle};

  b {
    ${display('md')}
    color: ${({ theme }) => theme.colors.textPrimary};
    font-variant-numeric: tabular-nums;
  }

  span {
    ${text('sm')}
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Glow = styled.div`
  position: absolute;
  inset: -40% 0 auto 50%;
  transform: translateX(-50%);
  width: min(1200px, 140vw);
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    ${({ theme }) => theme.colors.accentContainer} 0%,
    transparent 58%
  );
  pointer-events: none;
  z-index: -1;
`;

const HeroTitle = styled.h1`
  ${display('2xl')}
  color: ${({ theme }) => theme.colors.textPrimary};
  max-width: 14ch;

  span {
    color: ${({ theme }) => theme.colors.accentText};
  }

  ${media.down('lg')`font-size: ${({ theme }) => theme.display.xl[0]};`}
  ${media.down('md')`font-size: ${({ theme }) => theme.display.lg[0]};`}
`;

const HeroLead = styled.p`
  ${text('xl')}
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 50ch;
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

/* The topic band doubles as the hero visual: it shows the platform's breadth in the same
   glance as the headline, which a picture of an editor never did. */
const HeroTopics = styled.div`
  margin-top: ${({ theme }) => theme.spacing['3xl']};
  /* Break out of the shell padding so the band runs to the viewport edges. */
  margin-inline: calc(-50vw + 50%);
  padding-inline: 0;
`;

const HeroMeta = styled.p`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: ${({ theme }) => theme.spacing.xl};

  strong {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: ${({ theme }) => theme.weights.semibold};
  }
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  margin-top: ${({ theme }) => theme.spacing['2xl']};
`;

const CentredActions = styled(Actions)`
  justify-content: center;
`;

const HeroVisual = styled.div`
  max-width: 900px;
  margin: ${({ theme }) => theme.spacing['4xl']} auto 0;
`;

/* ── Statement section ───────────────────────────────────────────────────────── */

const Statement = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing['4xl']};
  align-items: center;

  ${media.down('lg')`
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing['2xl']};
  `}
`;

const BigStatement = styled.h2`
  ${display('xl')}
  color: ${({ theme }) => theme.colors.textPrimary};

  ${media.down('md')`font-size: ${({ theme }) => theme.display.lg[0]};`}
`;

/* ── Split rows ──────────────────────────────────────────────────────────────── */

const Row = styled.div`
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: ${({ theme }) => theme.spacing['4xl']};
  align-items: center;

  & + & {
    margin-top: ${({ theme }) => theme.spacing['4xl']};
  }

  &:nth-of-type(even) > *:first-child {
    order: 2;
  }

  ${media.down('lg')`
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing['2xl']};
    &:nth-of-type(even) > *:first-child { order: 0; }
  `}
`;

const RowTitle = styled.h3`
  ${display('md')}
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const RowText = styled.p`
  ${text('lg')}
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

/* ── Audience split ──────────────────────────────────────────────────────────── */

const Two = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  ${media.down('md')`grid-template-columns: 1fr;`}
`;

const AudiencePanel = styled(Surface)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: flex-start;
`;

const AudienceTitle = styled.h3`
  ${display('sm')}
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const List = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  ${text('md')}
  color: ${({ theme }) => theme.colors.textSecondary};

  li {
    display: flex;
    gap: ${({ theme }) => theme.spacing.md};
  }

  li::before {
    content: '';
    width: 6px;
    height: 6px;
    margin-top: 9px;
    flex-shrink: 0;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.accentSolid};
  }
`;

/* ── Feed ────────────────────────────────────────────────────────────────────── */

const FeedHead = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Topics = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Feed = styled.div`
  display: flex;
  flex-direction: column;

  > * + * {
    border-top: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  }
`;

const Centre = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing['2xl']};
`;

/* ── Closing ─────────────────────────────────────────────────────────────────── */

const Cta = styled(Surface)`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing.xl};
`;

const CtaTitle = styled.h2`
  ${display('xl')}
  color: ${({ theme }) => theme.colors.textPrimary};
  max-width: 18ch;
  margin: 0 auto;

  ${media.down('md')`font-size: ${({ theme }) => theme.display.lg[0]};`}
`;

/* ── Page ────────────────────────────────────────────────────────────────────── */

export function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { data: postsResponse, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => postService.getPosts({ limit: 5 }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
  });

  if (isLoading) return <Loading text="Loading…" />;

  const posts = postsResponse?.data ?? [];
  const categories = categoriesData?.data ?? [];
  const totalPosts = postsResponse?.pagination?.total ?? posts.length;

  const startHref = isAuthenticated ? '/write' : '/register';
  const startLabel = isAuthenticated ? 'Open the editor' : 'Start writing';

  return (
    <Page>
      <Shell>
        <Hero>
          <Glow aria-hidden="true" />

          <HeroGrid>
            <div>
              <HeroTitle>
                Publish your writing.
                <br />
                <span>Find out if it landed.</span>
              </HeroTitle>

              <HeroLead>
                BlogHub is a blogging platform with an editor that keeps out of your way. It also
                tells you how many people finished what you wrote, not just how many clicked on it.
              </HeroLead>

              <Actions>
                <Button size="lg" onClick={() => navigate(startHref)}>
                  {startLabel} <ArrowRight />
                </Button>
                <Button size="lg" variant="secondary" onClick={() => navigate('/search')}>
                  Browse stories
                </Button>
              </Actions>
            </div>

            <HeroAside>
              <AsideStat>
                <b>{totalPosts}</b>
                <span>stories published so far</span>
              </AsideStat>
              <AsideStat>
                <b>{categories.length}</b>
                <span>topics, from code to cooking</span>
              </AsideStat>
              <AsideStat style={{ borderBottom: 'none' }}>
                <b>Free</b>
                <span>no card, nothing to set up</span>
              </AsideStat>
            </HeroAside>
          </HeroGrid>

          <HeroTopics>
            <TopicMarquee topics={categories.map((category) => category.name)} />
          </HeroTopics>
        </Hero>
      </Shell>

      <Shell>
        {/* The argument */}
        <Section id="read">
          <Statement>
            <div>
              <Eyebrow>The number nobody shows you</Eyebrow>
              <BigStatement>
                1,240 opened it.
                <br />
                180 finished.
              </BigStatement>
              <Lead>
                A view only means the page loaded. It says nothing about whether anyone stayed to
                the end. BlogHub records both, so you can tell the difference between someone
                glancing at your work and someone actually reading it.
              </Lead>
            </div>
            <ReadGapIllustration />
          </Statement>
        </Section>

        {/* Breadth — the thing a first-time visitor most needs to grasp */}
        <Section>
          <Eyebrow>Every subject</Eyebrow>
          <H2>One platform, any topic</H2>
          <Lead>
            Someone writing about databases and someone writing about cooking both belong here. You
            can write across as many topics as you like, and a single post can sit in more than one
            of them.
          </Lead>

          <div style={{ marginTop: 32 }}>
            <TopicGrid categories={categories} onSelect={() => navigate('/search')} />
          </div>
        </Section>

        {/* Product depth */}
        <Section>
          <Row>
            <div>
              <Eyebrow>Analytics</Eyebrow>
              <RowTitle>Numbers that mean something</RowTitle>
              <RowText>
                Every post gets its own views, reads and read-through rate, plus a ranking of which
                pieces did best. If you run the site, you get the same picture across every author.
              </RowText>
            </div>
            <AnalyticsMockup />
          </Row>

          <Row>
            <div>
              <Eyebrow>Control</Eyebrow>
              <RowTitle>Publish on your terms</RowTitle>
              <RowText>
                Keep a piece to yourself while you work on it, share it as an unlisted link, or put
                it on the public feed. You can move between the three whenever you want, and nothing
                is one-way.
              </RowText>
            </div>
            <Surface $tone="low" $radius="xl" $padding="2xl">
              <VisibilityFlow />
            </Surface>
          </Row>

          <Row>
            <div>
              <Eyebrow>Community</Eyebrow>
              <RowTitle>Replies that go somewhere</RowTitle>
              <RowText>
                Replies nest under the comment they answer, so a conversation actually reads like
                one. Readers can follow the writers they like and come back for the next piece.
              </RowText>
            </div>
            <Surface $tone="low" $radius="xl" $padding="2xl">
              <CommentThread />
            </Surface>
          </Row>
        </Section>

        {/* Everything, in one place */}
        <Section>
          <Eyebrow>Everything in the box</Eyebrow>
          <H2>The whole platform</H2>
          <Lead>
            Here is everything the platform does today. A few things are still being built, and
            those are marked so you know what you are getting.
          </Lead>

          <div style={{ marginTop: 32 }}>
            <FeatureGrid />
          </div>
        </Section>

        {/* Who it is for */}
        <Section>
          <Eyebrow>Who it&apos;s for</Eyebrow>
          <H2>Two ways to use BlogHub</H2>
          <Lead>Most people end up doing a bit of both.</Lead>

          <div style={{ marginTop: 32 }}>
            <Two>
              <AudiencePanel $tone="low" $radius="xl" $padding="2xl">
                <PenLine size={22} />
                <AudienceTitle>If you write</AudienceTitle>
                <List>
                  <li>Draft in Markdown with a live preview</li>
                  <li>Publish, unlist or keep private</li>
                  <li>See views, reads and read-through rate per post</li>
                  <li>Build a following and reply in threads</li>
                </List>
                <Button variant="tonal" onClick={() => navigate(startHref)}>
                  {startLabel}
                </Button>
              </AudiencePanel>

              <AudiencePanel $tone="low" $radius="xl" $padding="2xl">
                <BarChart3 size={22} />
                <AudienceTitle>If you read</AudienceTitle>
                <List>
                  <li>A feed of long-form work, filtered by topic</li>
                  <li>Follow the writers worth following</li>
                  <li>Reply in threads, not a flat comment box</li>
                  <li>No algorithm deciding what you see</li>
                </List>
                <Button variant="tonal" onClick={() => navigate('/search')}>
                  Browse stories
                </Button>
              </AudiencePanel>
            </Two>
          </div>
        </Section>

        {/* Proof */}
        <Section>
          <FeedHead>
            <div>
              <Eyebrow>Published on BlogHub</Eyebrow>
              <H2>Recent work</H2>
            </div>
            <Button variant="ghost" onClick={() => navigate('/search')}>
              Browse all <ArrowRight />
            </Button>
          </FeedHead>

          <Topics>
            {categories.slice(0, 8).map((category) => (
              <Chip key={category._id} size="sm" onClick={() => navigate('/search')}>
                {category.name}
              </Chip>
            ))}
          </Topics>

          <Feed>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </Feed>

          <Centre>
            <Button variant="secondary" onClick={() => navigate('/search')}>
              See all {totalPosts} stories
            </Button>
          </Centre>
        </Section>

        <Section>
          <Cta $tone="accent" $radius="3xl" $padding="none">
            <CtaTitle>Write something worth finishing</CtaTitle>
            <Lead style={{ margin: '24px auto 0' }}>
              Make an account, open the editor and publish. You can work out the rest later.
            </Lead>
            <CentredActions>
              <Button size="lg" onClick={() => navigate(startHref)}>
                {startLabel} <ArrowRight />
              </Button>
            </CentredActions>
          </Cta>
        </Section>
      </Shell>
    </Page>
  );
}
