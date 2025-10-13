import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Paper } from '../../../../components/ui/primitives';
import { breakpoint } from '../../../../components/common/theme/breakpoints';

export const CommunityContainer = styled.section`
  margin: ${({ theme }) => theme.spacing(8)} 0;
`;

export const CommunityLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing(8)};

  ${breakpoint.down('desktop')} {
    grid-template-columns: 1fr;
  }
`;

export const TopAuthorsSection = styled(Paper)`
  overflow: hidden;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing(6)};
  border-bottom: ${({ theme }) => theme.borderWidth.thin} solid
    ${({ theme }) => theme.palette.grey[100]};

  h3 {
    font-size: ${({ theme }) => theme.typography.size.xl};
    font-weight: ${({ theme }) => theme.typography.weight.bold};
    color: ${({ theme }) => theme.palette.text.primary};
    margin: 0;
  }

  a {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing(2)};
    color: ${({ theme }) => theme.palette.primary.main};
    font-size: ${({ theme }) => theme.typography.size.sm};
    font-weight: ${({ theme }) => theme.typography.weight.semibold};
    text-decoration: none;
    transition: all ${({ theme }) => theme.motion.duration.fast};

    svg {
      transition: transform ${({ theme }) => theme.motion.duration.fast};
    }

    &:hover {
      color: ${({ theme }) => theme.palette.primary.dark};

      svg {
        transform: translateX(3px);
      }
    }
  }
`;

export const AuthorList = styled.div`
  padding: ${({ theme }) => theme.spacing(4)};
`;

export const AuthorCard = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(4)};
  text-decoration: none;
  color: ${({ theme }) => theme.palette.text.primary};
  border-radius: ${({ theme }) => theme.radii.lg};
  transition: all ${({ theme }) => theme.motion.duration.fast};

  &:hover {
    background-color: ${({ theme }) => theme.palette.grey[50]};
    transform: translateX(5px);
  }
`;

export const AuthorAvatar = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.radii.full};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 3px solid ${({ theme }) => theme.palette.background.surface};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: ${({ theme }) => theme.radii.full};
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
  }
`;

export const AuthorBadge = styled.span`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 22px;
  height: 22px;
  background: ${(props) =>
    props.$topContributor
      ? 'linear-gradient(135deg, #f59e0b, #fbbf24)'
      : props.theme.palette.grey[200]};
  border-radius: ${({ theme }) => theme.radii.full};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${({ theme }) => theme.palette.background.surface};
  font-size: 10px;
  color: ${(props) =>
    props.$topContributor ? props.theme.palette.common.white : props.theme.palette.text.secondary};
`;

export const AuthorInfo = styled.div`
  flex: 1;
`;

export const AuthorName = styled.h3`
  font-size: ${({ theme }) => theme.typography.size.lg};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  margin: 0 0 ${({ theme }) => theme.spacing(1)} 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const AuthorMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(4)};
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.palette.text.secondary};
`;

export const AuthorPosts = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1.4)};
`;

export const AuthorSocial = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const SocialIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => theme.radii.full};
  background-color: ${({ theme }) => theme.palette.grey[100]};
  color: ${({ theme }) => theme.palette.text.secondary};
  transition: all ${({ theme }) => theme.motion.duration.fast};

  &:hover {
    background-color: ${({ theme }) => theme.palette.primary.main};
    color: ${({ theme }) => theme.palette.common.white};
    transform: translateY(-2px);
  }
`;

export const StatsSection = styled(Paper)`
  overflow: hidden;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background-color: ${({ theme }) => theme.palette.grey[100]};
`;

export const StatCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(8)} ${({ theme }) => theme.spacing(6)};
  background-color: ${({ theme }) => theme.palette.background.surface};
  overflow: hidden;
  transition: all ${({ theme }) => theme.motion.duration.normal};
  z-index: 1;

  &:hover {
    transform: translateY(-5px);

    .stat-icon {
      transform: scale(1.1);
    }
  }
`;

export const StatIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: ${(props) => props.$bgColor || 'linear-gradient(135deg, #4f46e5, #3b82f6)'};
  color: ${({ theme }) => theme.palette.common.white};
  border-radius: ${({ theme }) => theme.radii.lg};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  transition: transform ${({ theme }) => theme.motion.duration.normal};
  box-shadow: 0 4px 12px ${(props) => props.$shadowColor || 'rgba(79, 70, 229, 0.2)'};
`;

export const StatValue = styled.h3`
  font-size: ${({ theme }) => theme.typography.size.h1};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  margin: 0 0 ${({ theme }) => theme.spacing(2)} 0;
  background: ${(props) => props.$gradient || 'linear-gradient(135deg, #1e293b, #334155)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const StatLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.size.md};
  color: ${({ theme }) => theme.palette.text.secondary};
  text-align: center;
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`;

export const EmptyMessage = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.lg};
  padding: ${({ theme }) => theme.spacing(12)} ${({ theme }) => theme.spacing(6)};
`;

export const TopAuthorBadge = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: #f59e0b;
  background-color: #fef3c7;
  padding: ${({ theme }) => theme.spacing(0.6)} ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => theme.radii.pill};
`;
