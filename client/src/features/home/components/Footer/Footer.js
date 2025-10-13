import {
  Container,
  FooterContent,
  FooterTop,
  FooterSection,
  FooterTitle,
  FooterLink,
  FooterLinkList,
  FooterBottom,
  Copyright,
  SocialLinks,
  SocialLink,
  Logo,
  LogoText,
  Description,
} from './Footer.styles';
import { FaGithub, FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Container>
      <FooterContent>
        <FooterTop>
          <FooterSection>
            <Logo>
              <LogoText>GeekyQuantum</LogoText>
            </Logo>
            <Description>
              A modern blogging platform for sharing your thoughts, stories, and ideas with the
              world.
            </Description>
            <SocialLinks>
              <SocialLink
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <FaGithub />
              </SocialLink>
              <SocialLink
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <FaTwitter />
              </SocialLink>
              <SocialLink
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </SocialLink>
              <SocialLink
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <FaYoutube />
              </SocialLink>
            </SocialLinks>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Product</FooterTitle>
            <FooterLinkList>
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/posts">All Posts</FooterLink>
              <FooterLink to="/categories">Categories</FooterLink>
              <FooterLink to="/tags">Tags</FooterLink>
            </FooterLinkList>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Resources</FooterTitle>
            <FooterLinkList>
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
              <FooterLink to="/faq">FAQ</FooterLink>
              <FooterLink to="/help">Help Center</FooterLink>
            </FooterLinkList>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Legal</FooterTitle>
            <FooterLinkList>
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/terms">Terms of Service</FooterLink>
              <FooterLink to="/cookies">Cookie Policy</FooterLink>
              <FooterLink to="/guidelines">Community Guidelines</FooterLink>
            </FooterLinkList>
          </FooterSection>
        </FooterTop>

        <FooterBottom>
          <Copyright>&copy; {currentYear} GeekyQuantum. All rights reserved.</Copyright>
        </FooterBottom>
      </FooterContent>
    </Container>
  );
};
