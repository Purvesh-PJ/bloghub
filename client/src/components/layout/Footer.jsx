import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.bgPrimary};
  margin-top: auto;
  transition: background-color ${({ theme }) => theme.transitions.normal};
`;

const FooterContent = styled.div`
  max-width: ${({ theme }) => theme.layout.maxContentWidth};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
`;

const FooterTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
`;

const BrandSection = styled.div``;

const BrandName = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: ${({ theme }) => theme.letterSpacing.tight};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const BrandTagline = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const LinksContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xxl};
`;

const LinkGroup = styled.div``;

const LinkGroupTitle = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const LinkList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FooterLink = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
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
  gap: ${({ theme }) => theme.spacing.lg};
`;

const LegalLink = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
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
              <LinkList>
                <FooterLink to="/">Home</FooterLink>
                <FooterLink to="/search">Explore</FooterLink>
                <FooterLink to="/write">Write</FooterLink>
              </LinkList>
            </LinkGroup>
            <LinkGroup>
              <LinkGroupTitle>Account</LinkGroupTitle>
              <LinkList>
                <FooterLink to="/profile">Profile</FooterLink>
                <FooterLink to="/settings">Settings</FooterLink>
                <FooterLink to="/my-posts">My Posts</FooterLink>
              </LinkList>
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
