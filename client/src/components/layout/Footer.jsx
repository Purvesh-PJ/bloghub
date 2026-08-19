import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Github, PenLine, Compass } from 'lucide-react';
import { text, media, interactive } from '../../styles/theme/mixins';
import { BrandMark } from '../ui';

/**
 * Footer — clean, minimalist, and perfectly aligned with the top nav.
 */

const Wrapper = styled.footer`
  margin-top: ${({ theme }) => theme.spacing['4xl']};
  padding: ${({ theme }) => theme.spacing['2xl']} 0 ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  background: transparent;
`;

const Container = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.xl};
  width: 100%;

  ${media.down('md')`
    padding: 0 ${({ theme }) => theme.spacing.lg};
  `}
`;

const MainRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;

  ${media.down('md')`
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.lg};
  `}
`;

const BrandSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 380px;
`;

const Logo = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  ${text('md', 'bold')}
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-decoration: none;
  transition: opacity ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 0.85;
  }
`;

const Tagline = styled.p`
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;

  ${media.down('sm')`
    gap: ${({ theme }) => theme.spacing.md};
  `}
`;

const FooterLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  ${text('sm', 'medium')}
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};
  ${interactive}

  &:hover {
    color: ${({ theme }) => theme.colors.accentText};
  }

  svg {
    width: 15px;
    height: 15px;
    color: ${({ theme }) => theme.colors.accentSolid};
  }
`;

const ExternalLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  ${text('sm', 'medium')}
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};
  ${interactive}

  &:hover {
    color: ${({ theme }) => theme.colors.accentText};
  }

  svg {
    width: 15px;
    height: 15px;
  }
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  flex-wrap: wrap;
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};
`;

export function Footer() {
  return (
    <Wrapper>
      <Container>
        <MainRow>
          <BrandSection>
            <Logo to="/">
              <BrandMark letter="B" />
              BlogHub
            </Logo>
            <Tagline>
              A distraction-free publishing space for thoughtful ideas, open writing, and genuine perspectives.
            </Tagline>
          </BrandSection>

          <NavLinks>
            <FooterLink to="/search">
              <Compass /> Explore Stories
            </FooterLink>

            <FooterLink to="/write">
              <PenLine /> Write a Story
            </FooterLink>

            <ExternalLink
              href="https://github.com/Purvesh-PJ/bloghub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github /> GitHub
            </ExternalLink>
          </NavLinks>
        </MainRow>

        <BottomRow>
          <span>© {new Date().getFullYear()} BlogHub · Open Publishing Platform</span>
          <span>Crafted with Markdown & Precision</span>
        </BottomRow>
      </Container>
    </Wrapper>
  );
}
