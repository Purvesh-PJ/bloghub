import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
  background: ${({ theme }) => theme.colors.bgSecondary};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.lg};
`;

const TopSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xxl};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr 1fr;
    gap: ${({ theme }) => theme.spacing.xl};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const BrandSection = styled.div``;

const Logo = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.radii.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: 14px;
`;

const Tagline = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  max-width: 300px;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SocialLink = styled.a`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.accent};
    border-color: ${({ theme }) => theme.colors.accent};
    color: white;
    transform: translateY(-2px);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const LinkSection = styled.div``;

const LinkTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const LinkList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FooterLink = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const ExternalLink = styled.a`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const BottomSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Copyright = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  gap: 4px;
  
  svg {
    width: 14px;
    height: 14px;
    color: ${({ theme }) => theme.colors.error};
  }
`;

const LegalLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const LegalLink = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  
  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <FooterWrapper>
      <FooterContent>
        <TopSection>
          <BrandSection>
            <Logo to="/">
              <LogoIcon>B</LogoIcon>
              BlogHub
            </Logo>
            <Tagline>
              A modern platform for writers and readers. Share your stories, discover new ideas, and connect with a community of thinkers.
            </Tagline>
            <SocialLinks>
              <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter />
              </SocialLink>
              <SocialLink href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github />
              </SocialLink>
              <SocialLink href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Linkedin />
              </SocialLink>
            </SocialLinks>
          </BrandSection>

          <LinkSection>
            <LinkTitle>Platform</LinkTitle>
            <LinkList>
              <li><FooterLink to="/">Home</FooterLink></li>
              <li><FooterLink to="/search">Explore</FooterLink></li>
              <li><FooterLink to="/write">Write</FooterLink></li>
            </LinkList>
          </LinkSection>

          <LinkSection>
            <LinkTitle>Account</LinkTitle>
            <LinkList>
              <li><FooterLink to="/profile">Profile</FooterLink></li>
              <li><FooterLink to="/settings">Settings</FooterLink></li>
              <li><FooterLink to="/my-posts">My Stories</FooterLink></li>
              <li><FooterLink to="/analytics">Analytics</FooterLink></li>
            </LinkList>
          </LinkSection>

          <LinkSection>
            <LinkTitle>Resources</LinkTitle>
            <LinkList>
              <li><ExternalLink href="#">Help Center</ExternalLink></li>
              <li><ExternalLink href="#">Writing Guide</ExternalLink></li>
              <li><ExternalLink href="#">API Docs</ExternalLink></li>
              <li><ExternalLink href="#">Status</ExternalLink></li>
            </LinkList>
          </LinkSection>
        </TopSection>

        <Divider />

        <BottomSection>
          <Copyright>
            © {currentYear} BlogHub. Made with <Heart /> for writers everywhere.
          </Copyright>
          <LegalLinks>
            <LegalLink to="/privacy">Privacy Policy</LegalLink>
            <LegalLink to="/terms">Terms of Service</LegalLink>
          </LegalLinks>
        </BottomSection>
      </FooterContent>
    </FooterWrapper>
  );
}
