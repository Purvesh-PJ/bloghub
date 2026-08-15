import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { text, label as labelStyle, media, interactive } from '../../styles/theme/mixins';

/**
 * Footer.
 *
 * Sits on a raised tone so the page visibly ends, rather than fading into the same grey as
 * the content above it.
 */

const Wrapper = styled.footer`
  margin-top: ${({ theme }) => theme.spacing['3xl']};
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.xl}
    ${({ theme }) => theme.spacing['2xl']};
  background: transparent;
  border-top: none;
`;

const Inner = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
`;

const Top = styled.div`
  display: grid;
  grid-template-columns: 1.6fr repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing['3xl']};

  ${media.down('lg')`grid-template-columns: 1fr 1fr;`}
  ${media.down('sm')`grid-template-columns: 1fr;`}
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: flex-start;
  max-width: 320px;
`;

const Logo = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  ${text('lg', 'semibold')}
  letter-spacing: ${({ theme }) => theme.tracking.tight};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Mark = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: linear-gradient(135deg, #0284c7 0%, #38bdf8 100%);
  color: #ffffff;
  font-size: 16px;
  font-weight: 800;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.4);
`;

const Blurb = styled.p`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Socials = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Social = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.surfaceContainer};
  color: ${({ theme }) => theme.colors.textSecondary};
  ${interactive}

  &:hover {
    background: ${({ theme }) => theme.colors.accentContainer};
    color: ${({ theme }) => theme.colors.accentText};
  }

  svg {
    width: 17px;
    height: 17px;
  }
`;

const Column = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ColumnTitle = styled.h3`
  ${labelStyle('sm')}
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const FooterLink = styled(Link)`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textSecondary};
  width: fit-content;
  ${interactive}

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
  margin-top: ${({ theme }) => theme.spacing['3xl']};
  padding-top: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textMuted};
`;

const BottomLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { to: '/', label: 'Home' },
      { to: '/search', label: 'Explore' },
      { to: '/write', label: 'Write' },
    ],
  },
  {
    title: 'Account',
    links: [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/write', label: 'New story' },
      { to: '/settings', label: 'Settings' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { to: '/search', label: 'Browse topics' },
      { to: '/register', label: 'Create account' },
      { to: '/login', label: 'Sign in' },
    ],
  },
];

export function Footer() {
  return (
    <Wrapper>
      <Inner>
        <Top>
          <Brand>
            <Logo to="/">
              <Mark>B</Mark>
              BlogHub
            </Logo>
            <Blurb>
              A writing platform for people with something to say. Markdown in, a clean article out.
            </Blurb>
            <Socials>
              <Social href="https://github.com/Purvesh-PJ" aria-label="GitHub">
                <Github />
              </Social>
              <Social href="https://twitter.com" aria-label="Twitter">
                <Twitter />
              </Social>
              <Social href="https://linkedin.com" aria-label="LinkedIn">
                <Linkedin />
              </Social>
            </Socials>
          </Brand>

          {COLUMNS.map((column) => (
            <Column key={column.title}>
              <ColumnTitle>{column.title}</ColumnTitle>
              {column.links.map((link) => (
                <FooterLink key={link.label} to={link.to}>
                  {link.label}
                </FooterLink>
              ))}
            </Column>
          ))}
        </Top>

        <Bottom>
          <span>© {new Date().getFullYear()} BlogHub</span>
          <BottomLinks>
            <FooterLink to="/">Privacy</FooterLink>
            <FooterLink to="/">Terms</FooterLink>
          </BottomLinks>
        </Bottom>
      </Inner>
    </Wrapper>
  );
}
