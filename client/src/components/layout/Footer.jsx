import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Github, PenLine, Compass, Heart } from 'lucide-react';
import { useTags } from '../../hooks/useTags';
import { text, media, interactive } from '../../styles/theme/mixins';
import { BrandMark } from '../ui';

/**
 * Footer — high-end editorial footer with ambient watermark,
 * aligned gutters, and purposeful community discovery.
 */

/** How many topics the discovery column shows. */
const TOPIC_COUNT = 6;

const Wrapper = styled.footer`
  position: relative;
  overflow: hidden;
  margin-top: ${({ theme }) => theme.spacing['4xl']};
  padding: ${({ theme }) => theme.spacing['3xl']} 0 ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  background: ${({ theme }) =>
    theme.mode === 'light' ? 'rgba(248, 250, 252, 0.4)' : 'rgba(7, 11, 19, 0.4)'};
`;

const WatermarkText = styled.div`
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: clamp(70px, 14vw, 160px);
  font-weight: 900;
  letter-spacing: -0.05em;
  color: ${({ theme }) =>
    theme.mode === 'light' ? 'rgba(15, 23, 42, 0.03)' : 'rgba(255, 255, 255, 0.02)'};
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
  z-index: 0;
`;

const Container = styled.div`
  position: relative;
  z-index: 1;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.xl};
  width: 100%;

  ${media.down('md')`
    padding: 0 ${({ theme }) => theme.spacing.lg};
  `}
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: ${({ theme }) => theme.spacing['3xl']};
  align-items: start;

  ${media.down('lg')`
    grid-template-columns: 1.2fr 1fr;
    gap: ${({ theme }) => theme.spacing['2xl']};
  `}

  ${media.down('sm')`
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.xl};
  `}
`;

const BrandBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  max-width: 440px;
`;

const BrandHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const BrandName = styled.span`
  ${text('md', 'bold')}
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 10px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.accentContainer};
  color: ${({ theme }) => theme.colors.accentText};
  ${text('xs', 'semibold')}

  span.dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.successSolid};
  }
`;

const Tagline = styled.p`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.65;
`;

const NavCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ColTitle = styled.h4`
  ${text('xs', 'semibold')}
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const ColLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FooterNavLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  ${text('sm', 'medium')}
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};
  width: fit-content;
  ${interactive}

  svg {
    width: 15px;
    height: 15px;
    color: ${({ theme }) => theme.colors.accentSolid};
    transition: transform ${({ theme }) => theme.transitions.fast};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.accentText};
    transform: translateX(2px);

    svg {
      transform: scale(1.1);
    }
  }
`;

const FooterExternalLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  ${text('sm', 'medium')}
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};
  width: fit-content;
  ${interactive}

  svg {
    width: 15px;
    height: 15px;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.accentText};
    transform: translateX(2px);
  }
`;

const TopicHashtags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const TopicTag = styled(Link)`
  ${text('xs', 'medium')}
  color: ${({ theme }) => theme.colors.textMuted};
  text-decoration: none;
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  border: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  transition: all ${({ theme }) => theme.transitions.fast};
  ${interactive}

  &:hover {
    color: ${({ theme }) => theme.colors.accentText};
    background: ${({ theme }) => theme.colors.accentContainer};
    border-color: ${({ theme }) => theme.colors.accentLine};
    transform: translateY(-1px);
  }
`;

const BottomBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing['2xl']};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  flex-wrap: wrap;
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};

  span.built-with {
    display: inline-flex;
    align-items: center;
    gap: 4px;

    svg {
      width: 13px;
      height: 13px;
      color: ${({ theme }) => theme.colors.dangerSolid};
      fill: ${({ theme }) => theme.colors.dangerSolid};
    }
  }
`;

export function Footer() {
  /*
    Shared with the landing page, search and the editor through one hook, so the footer costs
    no extra request on most pages. Only topics with something published belong under a
    heading that calls them popular; when there are none the column is left out rather than
    shown empty.
  */
  const { tags } = useTags({ withPostsOnly: true });
  const topics = tags.slice(0, TOPIC_COUNT);

  return (
    <Wrapper>
      <WatermarkText>bloghub</WatermarkText>

      <Container>
        <MainGrid>
          {/* Brand Identity & Mission */}
          <BrandBlock>
            <BrandHeader>
              <BrandMark letter="B" />
              <BrandName>BlogHub</BrandName>
              <StatusPill>
                <span className="dot" /> Open Source
              </StatusPill>
            </BrandHeader>

            <Tagline>
              A distraction-free publishing space for writers, thinkers, and curious minds. Pure
              Markdown canvas, true read attention metrics, and zero ads.
            </Tagline>
          </BrandBlock>

          {/* Quick Discover Pathways */}
          <NavCol>
            <ColTitle>Explore</ColTitle>
            <ColLinks>
              <FooterNavLink to="/search">
                <Compass /> Discover Stories
              </FooterNavLink>
              <FooterNavLink to="/write">
                <PenLine /> Write an Article
              </FooterNavLink>
              <FooterExternalLink
                href="https://github.com/Purvesh-PJ/bloghub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github /> GitHub Repository
              </FooterExternalLink>
            </ColLinks>
          </NavCol>

          {/*
            Popular Community Topics.

            These were six hardcoded hashtags — #technology, #design, #ai and so on — each a
            real link into the search page. On any site that had not happened to use those
            exact words they led to an empty result, under a heading claiming they were
            popular. They come from the tag endpoint now, which already reports a published
            post count per tag and sorts by it, and the column is omitted entirely rather
            than shown empty when nothing qualifies.
          */}
          {topics.length > 0 && (
            <NavCol>
              <ColTitle>Popular Topics</ColTitle>
              <TopicHashtags>
                {topics.map((topic) => (
                  <TopicTag
                    key={topic._id ?? topic.name}
                    to={`/search?topic=${encodeURIComponent(topic.name)}`}
                  >
                    #{topic.name}
                  </TopicTag>
                ))}
              </TopicHashtags>
            </NavCol>
          )}
        </MainGrid>

        <BottomBar>
          <span>© {new Date().getFullYear()} BlogHub · All stories belong to their authors</span>
          <span className="built-with">
            Crafted with <Heart /> for open web publishing
          </span>
        </BottomBar>
      </Container>
    </Wrapper>
  );
}
