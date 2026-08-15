import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { ArrowRight, PenLine, BookOpen } from 'lucide-react';

import { postService } from '../services/postService';
import { categoryService } from '../services/categoryService';
import { useAuth } from '../context/AuthContext';
import { Button, Chip, Loading } from '../components/ui';
import { PostCard } from '../components/posts/PostCard';
import { VisibilityFlow, CommentThread } from '../components/marketing/Illustrations';
import { AnalyticsMockup } from '../components/marketing/Mockups';
import { FeatureGrid } from '../components/marketing/FeatureGrid';
import { TopicMarquee, TopicGrid } from '../components/marketing/Topics';
import {
  FullBleed,
  Inverted,
  Column,
  Numbered,
  Kicker,
  Headline,
  Body,
  Split,
} from '../components/layout/Editorial';
import { display, text, label as labelStyle, media } from '../styles/theme/mixins';

/**
 * Landing page.
 *
 * Built as an argument rather than a feature list: the platform's one genuine difference is
 * that it separates a view from a read, so the page opens with that gap and everything else
 * follows from it.
 *
 * The composition matters as much as the copy. The previous version put every section in
 * the same centred 1200px column with the same heading-then-content shape, which reads as
 * monotonous however good each section is on its own. This one changes ground as you scroll
 * — the gap and the closing call are full-width inverted bands, the topic marquee runs edge
 * to edge, the three product sections are numbered and alternate sides, and the feed leads
 * with one large story rather than a uniform grid.
 */

/* ── Page ────────────────────────────────────────────────────────────────── */

const Page = styled.div`
  /* Full-bleed bands are 100vw wide; clip stops that becoming a horizontal scrollbar. */
  overflow-x: clip;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['6xl']};
  padding-bottom: ${({ theme }) => theme.spacing['5xl']};

  ${media.down('md')`gap: ${({ theme }) => theme.spacing['4xl']};`}
`;

/* ── Hero ────────────────────────────────────────────────────────────────── */

const Hero = styled.header`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: min(78vh, 720px);
  padding: ${({ theme }) => theme.spacing['4xl']} 0 ${({ theme }) => theme.spacing['2xl']};

  ${media.down('md')`
    min-height: 0;
    padding: ${({ theme }) => theme.spacing['3xl']} 0;
  `}
`;

const HeroTitle = styled.h1`
  ${display('2xl')}
  color: ${({ theme }) => theme.colors.textPrimary};
  max-width: 13ch;

  em {
    font-style: normal;
    color: ${({ theme }) => theme.colors.accentText};
  }

  ${media.down('lg')`font-size: ${({ theme }) => theme.display.xl[0]};`}
  ${media.down('md')`font-size: ${({ theme }) => theme.display.lg[0]};`}
  ${media.down('sm')`font-size: ${({ theme }) => theme.display.md[0]};`}
`;

/*
  The lead and the actions sit in the right half, below the headline's baseline rather than
  beside it. It reads as a caption to the headline instead of a second column competing with
  it, and it leaves the left side genuinely empty — which is what makes the type feel large.
*/
const HeroFoot = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing['2xl']};
  align-items: end;
  margin-top: ${({ theme }) => theme.spacing['2xl']};

  ${media.down('md')`grid-template-columns: 1fr;`}
`;

const HeroLead = styled.p`
  ${text('xl')}
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 42ch;
  grid-column: 2;

  ${media.down('md')`grid-column: 1;`}
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  grid-column: 2;

  ${media.down('md')`grid-column: 1;`}
`;

const HeroBottom = styled.div`
  grid-column: 2;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};

  ${media.down('md')`grid-column: 1;`}
`;

/* ── The gap — an inverted band ──────────────────────────────────────────── */

const GapGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing['4xl']};
  align-items: center;

  ${media.down('md')`grid-template-columns: 1fr;`}
`;

const Figures = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Figure = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FigureValue = styled.span`
  ${display('xl')}
  color: ${({ theme, $accent }) => ($accent ? theme.colors.accentSolid : 'inherit')};
  font-variant-numeric: tabular-nums;
  line-height: 1;

  ${media.down('md')`font-size: ${({ theme }) => theme.display.lg[0]};`}
`;

const FigureLabel = styled.span`
  ${labelStyle('md')}
  opacity: 0.6;
`;

/* A bar drawn on the inverted ground, so it needs its own track colour. */
const GapBar = styled.div`
  height: 8px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.alphaSoft};
  overflow: hidden;
  margin-top: ${({ theme }) => theme.spacing.sm};

  span {
    display: block;
    height: 100%;
    width: ${({ $percent }) => $percent}%;
    background: ${({ theme }) => theme.colors.accentSolid};
    border-radius: inherit;
  }
`;

const GapNote = styled.p`
  ${text('lg')}
  opacity: 0.75;
  max-width: 46ch;
`;

/* ── Sections ────────────────────────────────────────────────────────────── */

const Shell = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['5xl']};

  ${media.down('md')`
    padding: 0 ${({ theme }) => theme.spacing.lg};
    gap: ${({ theme }) => theme.spacing['3xl']};
  `}
`;

const Visual = styled.div`
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  padding: ${({ theme }) => theme.spacing['2xl']};
`;

/* ── Feed — one lead story, then the rest ────────────────────────────────── */

const FeedHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 2px solid ${({ theme }) => theme.colors.textPrimary};
`;

const Rest = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.xl};

  ${media.down('lg')`grid-template-columns: repeat(2, 1fr);`}
  ${media.down('sm')`grid-template-columns: 1fr;`}
`;

const Topics = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

/* ── Audiences — two columns divided by a rule, not two cards ────────────── */

const Audiences = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing['3xl']};

  ${media.down('md')`grid-template-columns: 1fr;`}
`;

const Audience = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: flex-start;
  padding-top: ${({ theme }) => theme.spacing.xl};
  border-top: 2px solid ${({ theme }) => theme.colors.textPrimary};

  svg {
    width: 22px;
    height: 22px;
    color: ${({ theme }) => theme.colors.accentText};
  }
`;

const AudienceTitle = styled.h3`
  ${display('sm')}
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const List = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  li {
    ${text('md')}
    color: ${({ theme }) => theme.colors.textSecondary};
    padding-left: ${({ theme }) => theme.spacing.lg};
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0.62em;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: ${({ theme }) => theme.colors.accentSolid};
    }
  }
`;

/* ── Closing band ────────────────────────────────────────────────────────── */

const CtaTitle = styled.h2`
  ${display('lg')}
  max-width: 16ch;

  ${media.down('md')`font-size: ${({ theme }) => theme.display.md[0]};`}
`;

const CtaRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing['2xl']};
  flex-wrap: wrap;
`;

export function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { data: postsResponse, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => postService.getPosts({ limit: 7 }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
  });

  if (isLoading) return <Loading text="Loading…" />;

  const posts = postsResponse?.data ?? [];
  const categories = categoriesData?.data ?? [];
  const totalPosts = postsResponse?.pagination?.total ?? posts.length;

  const [lead, ...rest] = posts;
  const startHref = isAuthenticated ? '/write' : '/register';
  const startLabel = isAuthenticated ? 'Open the editor' : 'Start writing';

  return (
    <Page>
      <Shell>
        <Hero>
          <HeroTitle>
            Publish your writing. <em>Find out if it landed.</em>
          </HeroTitle>

          <HeroFoot>
            <HeroBottom>
              <HeroLead>
                An editor that keeps out of your way, and the one number most platforms will not
                show you: how many people actually reached the end.
              </HeroLead>
              <Actions>
                <Button size="lg" onClick={() => navigate(startHref)}>
                  {startLabel} <ArrowRight />
                </Button>
                <Button size="lg" variant="secondary" onClick={() => navigate('/search')}>
                  Browse stories
                </Button>
              </Actions>
            </HeroBottom>
          </HeroFoot>
        </Hero>
      </Shell>

      <FullBleed>
        <TopicMarquee topics={categories.map((category) => category.name)} />
      </FullBleed>

      {/* The argument, on inverted ground */}
      <Inverted id="read">
        <Column>
          <GapGrid>
            <div>
              <Kicker>The number nobody shows you</Kicker>
              <Figures style={{ marginTop: 24 }}>
                <div>
                  <Figure>
                    <FigureValue>1,240</FigureValue>
                    <FigureLabel>opened it</FigureLabel>
                  </Figure>
                  <GapBar $percent={100} aria-hidden="true">
                    <span />
                  </GapBar>
                </div>
                <div>
                  <Figure>
                    <FigureValue $accent>180</FigureValue>
                    <FigureLabel>finished it</FigureLabel>
                  </Figure>
                  <GapBar $percent={14.5} aria-hidden="true">
                    <span />
                  </GapBar>
                </div>
              </Figures>
            </div>

            <GapNote>
              A view only means the page loaded. It says nothing about whether anyone stayed to the
              end. BlogHub records both, so you can tell the difference between someone glancing at
              your work and someone actually reading it.
            </GapNote>
          </GapGrid>
        </Column>
      </Inverted>

      <Shell>
        {/* Product, as a numbered sequence */}
        <Numbered n={1} rule={false}>
          <Kicker>Analytics</Kicker>
          <Headline>Numbers that mean something</Headline>
          <Split>
            <Body>
              Every post gets its own views, reads and read-through rate, plus a ranking of which
              pieces did best. If you run the site, you get the same picture across every author.
            </Body>
            <Visual>
              <AnalyticsMockup />
            </Visual>
          </Split>
        </Numbered>

        <Numbered n={2}>
          <Kicker>Control</Kicker>
          <Headline>Publish on your terms</Headline>
          <Split $flip>
            <Visual>
              <VisibilityFlow />
            </Visual>
            <Body>
              Keep a piece to yourself while you work on it, share it as an unlisted link, or put it
              on the public feed. You can move between the three whenever you want, and nothing is
              one-way.
            </Body>
          </Split>
        </Numbered>

        <Numbered n={3}>
          <Kicker>Community</Kicker>
          <Headline>Replies that go somewhere</Headline>
          <Split>
            <Body>
              Replies nest under the comment they answer, so a conversation actually reads like one.
              Readers can follow the writers they like and come back for the next piece.
            </Body>
            <Visual>
              <CommentThread />
            </Visual>
          </Split>
        </Numbered>
      </Shell>

      {/* Breadth — full width, because the point is how much there is */}
      <FullBleed style={{ background: 'transparent' }}>
        <Column>
          <Kicker>Every subject</Kicker>
          <Headline style={{ marginTop: 8, marginBottom: 24 }}>One platform, any topic</Headline>
          <TopicGrid categories={categories} onSelect={() => navigate('/search')} />
        </Column>
      </FullBleed>

      <Shell>
        {/* The feed, led by one story */}
        <section>
          <FeedHead>
            <Headline as="h2" style={{ maxWidth: 'none' }}>
              Recent work
            </Headline>
            <Button variant="ghost" onClick={() => navigate('/search')}>
              All {totalPosts} stories <ArrowRight />
            </Button>
          </FeedHead>

          <Topics style={{ margin: '24px 0 32px' }}>
            {categories.slice(0, 8).map((category) => (
              <Chip key={category._id} size="sm" onClick={() => navigate('/search')}>
                {category.name}
              </Chip>
            ))}
          </Topics>

          {lead && <PostCard post={lead} />}

          <Rest style={{ marginTop: 32 }}>
            {rest.map((post) => (
              <PostCard key={post._id} post={post} layout="stacked" />
            ))}
          </Rest>
        </section>

        {/* Everything it does */}
        <section>
          <Kicker>Everything in the box</Kicker>
          <Headline style={{ margin: '8px 0 16px' }}>The whole platform</Headline>
          <Body style={{ marginBottom: 40 }}>
            Here is everything the platform does today. A few things are still being built, and
            those are marked so you know what you are getting.
          </Body>
          <FeatureGrid />
        </section>

        {/* Two audiences, divided by rules rather than boxed */}
        <section>
          <Kicker>Who it&apos;s for</Kicker>
          <Headline style={{ margin: '8px 0 40px' }}>Two ways to use BlogHub</Headline>

          <Audiences>
            <Audience>
              <PenLine />
              <AudienceTitle>If you write</AudienceTitle>
              <List>
                <li>Draft in Markdown with a live preview</li>
                <li>Publish, unlist or keep private</li>
                <li>See views, reads and read-through rate per post</li>
                <li>Build a following and reply in threads</li>
              </List>
              <Button variant="secondary" onClick={() => navigate(startHref)}>
                {startLabel}
              </Button>
            </Audience>

            <Audience>
              <BookOpen />
              <AudienceTitle>If you read</AudienceTitle>
              <List>
                <li>A feed of long-form work, filtered by topic</li>
                <li>Follow the writers worth following</li>
                <li>Reply in threads, not a flat comment box</li>
                <li>No algorithm deciding what you see</li>
              </List>
              <Button variant="secondary" onClick={() => navigate('/search')}>
                Browse stories
              </Button>
            </Audience>
          </Audiences>
        </section>
      </Shell>

      <Inverted>
        <Column>
          <CtaRow>
            <CtaTitle>Write something worth finishing.</CtaTitle>
            <Button size="lg" variant="secondary" onClick={() => navigate(startHref)}>
              {startLabel} <ArrowRight />
            </Button>
          </CtaRow>
        </Column>
      </Inverted>
    </Page>
  );
}
