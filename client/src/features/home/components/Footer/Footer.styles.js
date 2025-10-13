import styled from 'styled-components';
import { Link } from 'react-router-dom';
import breakpoints from '../../../../components/common/theme/breakpoints';

export const Container = styled.footer`
  border-top: ${({ theme }) => theme.borderWidth.thin} solid ${({ theme }) => theme.palette.divider};
  background-color: ${({ theme }) => theme.palette.background.surface};
  margin-top: auto;
`;

export const FooterContent = styled.div`
  max-width: ${breakpoints.xl};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing(12)} ${({ theme }) => theme.spacing(6)};

  @media (max-width: ${breakpoints.desktop}) {
    padding: ${({ theme }) => theme.spacing(10)} ${({ theme }) => theme.spacing(4)};
  }

  @media (max-width: ${breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing(8)} ${({ theme }) => theme.spacing(3)};
  }
`;

export const FooterTop = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: ${({ theme }) => theme.spacing(8)};
  margin-bottom: ${({ theme }) => theme.spacing(8)};

  @media (max-width: ${breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing(6)};
  }

  @media (max-width: ${breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing(6)};
  }
`;

export const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const Logo = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

export const LogoText = styled.h2`
  font-size: ${({ theme }) => theme.typography.size.h3};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  background: linear-gradient(
    135deg,
    ${(p) => p.theme.palette.primary.main} 0%,
    ${(p) => p.theme.palette.secondary.main} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -0.02em;
`;

export const Description = styled.p`
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.sm};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  margin: 0;
  max-width: 320px;
`;

export const FooterTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.size.md};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.palette.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing(2)} 0;
`;

export const FooterLinkList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.sm};
  text-decoration: none;
  transition: color ${({ theme }) => theme.motion.duration.fast}
    ${({ theme }) => theme.motion.easing.standard};

  &:hover {
    color: ${({ theme }) => theme.palette.primary.main};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.palette.primary.main};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.radii.sm};
  }
`;

export const SocialLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

export const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.spacing(10)};
  height: ${({ theme }) => theme.spacing(10)};
  border-radius: ${({ theme }) => theme.radii.lg};
  background-color: ${({ theme }) => theme.palette.background.subtle};
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xl};
  text-decoration: none;
  transition: all ${({ theme }) => theme.motion.duration.fast}
    ${({ theme }) => theme.motion.easing.standard};

  &:hover {
    background-color: ${({ theme }) => theme.palette.primary.main};
    color: ${({ theme }) => theme.palette.primary.contrastText};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.palette.primary.main};
    outline-offset: 2px;
  }
`;

export const FooterBottom = styled.div`
  padding-top: ${({ theme }) => theme.spacing(6)};
  border-top: ${({ theme }) => theme.borderWidth.thin} solid ${({ theme }) => theme.palette.divider};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(4)};

  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: column;
    text-align: center;
  }
`;

export const Copyright = styled.p`
  color: ${({ theme }) => theme.palette.text.muted};
  font-size: ${({ theme }) => theme.typography.size.sm};
  margin: 0;
`;
