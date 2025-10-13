import styled from 'styled-components';
import { Flex as BaseFlex, Paper as BasePaper } from '../components/ui/primitives';

export const Container = styled(BaseFlex)`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: ${({ theme }) => theme.palette.background.default};
`;

export const ChildContainer = styled(BaseFlex)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: auto;
  flex: 1;
  overflow: hidden;
  width: 100%;
`;

export const TopNav = styled(BasePaper)`
  position: sticky;
  top: 0;
  height: 60px;
  z-index: ${({ theme }) => theme.zIndex.navbar};
  background-color: ${({ theme }) => theme.palette.background.surface};
  border-bottom: ${({ theme }) => theme.borderWidth.thin} solid
    ${({ theme }) => theme.palette.divider};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border-radius: 0;
  padding: 0;
  transition: box-shadow ${({ theme }) => theme.motion.duration.normal}
    ${({ theme }) => theme.motion.easing.standard};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

export const SidePanelWrapper = styled(BasePaper)`
  border-right: ${({ theme }) => theme.borderWidth.thin} solid
    ${({ theme }) => theme.palette.divider};
  width: 280px;
  min-width: 280px;
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.palette.background.surface};
  height: calc(100vh - 60px);
  overflow-y: auto;
  box-shadow: none;
  border-radius: 0;
  padding: 0;
  transition: all ${({ theme }) => theme.motion.duration.normal}
    ${({ theme }) => theme.motion.easing.standard};

  /* Custom scrollbar */
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.palette.grey[300]}
    ${({ theme }) => theme.palette.background.surface};

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.palette.background.surface};
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.palette.grey[300]};
    border-radius: ${({ theme }) => theme.radii.pill};
    transition: background-color ${({ theme }) => theme.motion.duration.fast}
      ${({ theme }) => theme.motion.easing.standard};
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => theme.palette.grey[400]};
  }

  @media (max-width: 1024px) {
    width: 240px;
    min-width: 240px;
  }

  @media (max-width: 768px) {
    position: fixed;
    top: 60px;
    left: 0;
    bottom: 0;
    width: 280px;
    z-index: ${({ theme }) => theme.zIndex.sidebar};
    transform: translateX(${(props) => (props.isMobile ? '0' : '-100%')});
    box-shadow: ${(props) => (props.isMobile ? props.theme.shadows.lg : 'none')};
    border-right: ${(props) => (props.isMobile ? props.theme.borderWidth.thin : 'none')} solid
      ${({ theme }) => theme.palette.divider};
  }
`;

export const MainContentWrapper = styled(BasePaper)`
  flex: 1;
  background-color: ${({ theme }) => theme.palette.background.default};
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
  overflow-y: auto;
  box-shadow: none;
  border-radius: 0;
  padding: 0;
  position: relative;

  /* Custom scrollbar */
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.palette.grey[300]}
    ${({ theme }) => theme.palette.background.default};

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.palette.background.default};
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.palette.grey[300]};
    border-radius: ${({ theme }) => theme.radii.pill};
    transition: background-color ${({ theme }) => theme.motion.duration.fast}
      ${({ theme }) => theme.motion.easing.standard};
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => theme.palette.grey[400]};
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const TopBarWrapper = styled(BasePaper)`
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) =>
    theme.mode === 'dark' ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.85)'};
  min-height: 60px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: ${({ theme }) => theme.zIndex.popover};
  border-bottom: ${({ theme }) => theme.borderWidth.thin} solid
    ${({ theme }) => theme.palette.divider};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border-radius: 0;
  padding: ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(4)}`};
  transition: all ${({ theme }) => theme.motion.duration.normal}
    ${({ theme }) => theme.motion.easing.standard};

  @media (max-width: 768px) {
    padding: ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(3)}`};
  }
`;

export const TopBarContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(4)};
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(4)};
`;

export const PageTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.palette.text.primary};
`;

export const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.palette.background.subtle};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(4)};
  max-width: 300px;
  transition: all ${({ theme }) => theme.motion.duration.normal}
    ${({ theme }) => theme.motion.easing.standard};

  &:focus-within {
    background-color: ${({ theme }) => theme.palette.background.surface};
    box-shadow: ${({ theme }) => theme.shadows.md};
    outline: 2px solid ${({ theme }) => theme.palette.primary.main};
    outline-offset: 1px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const SearchInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  font-size: ${({ theme }) => theme.typography.size.sm};
  margin-left: ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.palette.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};

  &::placeholder {
    color: ${({ theme }) => theme.palette.text.muted};
  }

  &:focus {
    outline: none;
  }
`;

export const MobileToggle = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

export const BreadcrumbContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.palette.text.secondary};
`;

export const BreadcrumbItem = styled.span`
  color: ${({ theme }) => theme.palette.text.secondary};
  transition: color ${({ theme }) => theme.motion.duration.fast}
    ${({ theme }) => theme.motion.easing.standard};

  &:not(:last-child)::after {
    content: '/';
    margin: 0 ${({ theme }) => theme.spacing(2)};
    color: ${({ theme }) => theme.palette.grey[400]};
  }

  &:last-child {
    color: ${({ theme }) => theme.palette.text.primary};
    font-weight: ${({ theme }) => theme.typography.weight.medium};
  }

  &:hover {
    color: ${({ theme }) => theme.palette.primary.main};
  }
`;

/* Mobile sidebar backdrop overlay */
export const MobileBackdrop = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${(props) => (props.$isOpen ? 'block' : 'none')};
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${({ theme }) =>
      theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.4)'};
    z-index: ${({ theme }) => theme.zIndex.sidebar - 1};
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    animation: fadeIn ${({ theme }) => theme.motion.duration.normal}
      ${({ theme }) => theme.motion.easing.standard};
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
