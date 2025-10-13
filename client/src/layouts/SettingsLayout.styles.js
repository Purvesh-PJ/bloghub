import styled from 'styled-components';
import { Flex as BaseFlex, Paper as BasePaper } from '../components/ui/primitives';

export const Container = styled(BaseFlex)`
  flex-direction: row;
  width: 100%;
  height: 100%;
  min-height: 600px;
  background-color: ${({ theme }) => theme.palette.background.default};
  border-radius: ${({ theme }) => theme.radii.xl};
  border: ${({ theme }) => theme.borderWidth.thin} solid ${({ theme }) => theme.palette.divider};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  overflow: hidden;
  box-sizing: border-box;
  transition: box-shadow ${({ theme }) => theme.motion.duration.normal}
    ${({ theme }) => theme.motion.easing.standard};

  &:focus-within {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    border-radius: ${({ theme }) => theme.radii.lg};
  }
`;

export const SidePanelWrapper = styled(BasePaper)`
  width: 280px;
  min-width: 280px;
  flex-shrink: 0;
  background: ${({ theme }) => theme.palette.background.surface};
  border-right: ${({ theme }) => theme.borderWidth.thin} solid
    ${({ theme }) => theme.palette.divider};
  position: sticky;
  top: 0;
  height: 100%;
  max-height: 100%;
  padding: 0;
  box-shadow: none;
  border-radius: 0;
  overflow-y: auto;
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
    position: static;
    width: 100%;
    min-width: 100%;
    height: auto;
    max-height: 200px;
    border-right: none;
    border-bottom: ${({ theme }) => theme.borderWidth.thin} solid
      ${({ theme }) => theme.palette.divider};
  }
`;

export const MainPanelWrapper = styled(BasePaper)`
  flex: 1;
  padding: ${({ theme }) => theme.spacing(8)};
  background-color: ${({ theme }) => theme.palette.background.default};
  overflow-y: auto;
  box-shadow: none;
  border-radius: 0;
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

  @media (max-width: 1024px) {
    padding: ${({ theme }) => theme.spacing(6)};
  }

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing(4)};
  }
`;

export const SettingsHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(6)};
  padding-bottom: ${({ theme }) => theme.spacing(4)};
  border-bottom: ${({ theme }) => theme.borderWidth.thin} solid
    ${({ theme }) => theme.palette.divider};
  transition: border-color ${({ theme }) => theme.motion.duration.fast}
    ${({ theme }) => theme.motion.easing.standard};
`;

export const SettingsTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.size.h2};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: ${({ theme }) => theme.palette.text.primary};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  letter-spacing: -0.02em;
`;

export const SettingsDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.size.md};
  color: ${({ theme }) => theme.palette.text.secondary};
  margin: ${({ theme }) => theme.spacing(2)} 0 0 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  max-width: 600px;
`;
