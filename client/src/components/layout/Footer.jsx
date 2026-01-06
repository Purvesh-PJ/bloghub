import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.bgPrimary};
  margin-top: auto;
  transition: background-color ${({ theme }) => theme.transitions.normal},
              border-color ${({ theme }) => theme.transitions.normal};
`;

const FooterContent = styled.div`
  max-width: ${({ theme }) => theme.layout.maxContentWidth};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
`;

const FooterTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
`;

const BrandSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const BrandName = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.accent};
`;

const BrandTagline = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const LinksContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xxl};
`;

const LinkGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const LinkGroupTitle = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const FooterLink = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    color: ${({ theme }) => theme.colors.textLink};
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => theme.spacing.lg} 0;
`;

const FooterBottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const Copyright = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const LegalLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const LegalLink = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    color: ${({ theme }) => theme.colors.textLink};
  }
`;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <FooterWrapper>
      <FooterContent>
        <FooterTop>
          <BrandSection>
            <BrandName>BlogHub</BrandName>
            <BrandTagline>Share your stories with the world</BrandTagline>
          </BrandSection>

          <LinksContainer>
            <LinkGroup>
              <LinkGroupTitle>Platform</LinkGroupTitle>
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/search">Explore</FooterLink>
              <FooterLink to="/write">Write</FooterLink>
            </LinkGroup>
            <LinkGroup>
              <LinkGroupTitle>Account</LinkGroupTitle>
              <FooterLink to="/profile">Profile</FooterLink>
              <FooterLink to="/settings">Settings</FooterLink>
              <FooterLink to="/my-posts">My Posts</FooterLink>
            </LinkGroup>
          </LinksContainer>
        </FooterTop>

        <Divider />

        <FooterBottom>
          <Copyright>© {currentYear} BlogHub. All rights reserved.</Copyright>
          <LegalLinks>
            <LegalLink>Privacy</LegalLink>
            <LegalLink>Terms</LegalLink>
          </LegalLinks>
        </FooterBottom>
      </FooterContent>
    </FooterWrapper>
  );
}
