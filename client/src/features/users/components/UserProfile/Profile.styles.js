import styled from 'styled-components';
import { Paper } from '../../../../components/ui/primitives';
import { breakpoint } from '../../../../components/common/theme/breakpoints';

// Main Layout
export const ProfilePage = styled(Paper)`
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing(2)};

  ${breakpoint.down('tablet')} {
    padding: ${({ theme }) => theme.spacing(4)};
  }
`;

// Card Components
export const ProfileCard = styled.div`
  overflow: hidden;
  width: 100%;
`;

export const ProfileHeader = styled.div`
  padding: ${({ theme }) => theme.spacing(4)};
  margin: ${({ theme }) => theme.spacing(4)};
  background-color: ${({ theme }) => theme.palette.grey[50]};
  display: flex;
  gap: ${({ theme }) => theme.spacing(8)};
  border-radius: ${({ theme }) => theme.radii.lg};

  ${breakpoint.down('tablet')} {
    flex-direction: column;
    text-align: center;
  }
`;

export const ProfileImageWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: ${({ theme }) => theme.radii.full};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.md};
  flex-shrink: 0;
  border: 4px solid ${({ theme }) => theme.palette.background.surface};

  ${breakpoint.down('tablet')} {
    width: 100px;
    height: 100px;
  }
`;

export const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const ProfileMain = styled.div`
  flex: 1;
`;

export const ProfileName = styled.h1`
  font-size: ${({ theme }) => theme.typography.size.lg};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: ${({ theme }) => theme.palette.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing(2)};

  ${breakpoint.down('tablet')} {
    font-size: ${({ theme }) => theme.typography.size.xl};
  }
`;

export const ProfileStatus = styled.div`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.palette.text.secondary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  border: ${({ theme }) => theme.borderWidth.thin} solid ${({ theme }) => theme.palette.grey[100]};

  ${breakpoint.down('tablet')} {
    justify-content: center;
  }

  svg {
    color: ${({ theme }) => theme.palette.primary.main};
  }
`;

export const ProfileBio = styled.p`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.palette.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  margin-bottom: 0;
  font-style: italic;
  position: relative;

  &::before {
    content: '"';
    position: absolute;
    left: ${({ theme }) => theme.spacing(-2)};
    top: ${({ theme }) => theme.spacing(-2)};
    font-size: ${({ theme }) => theme.typography.size.xl};
    color: ${({ theme }) => theme.palette.primary.main};
    opacity: 0.2;
  }
`;

export const ProfileContent = styled.div`
  padding: 0 ${({ theme }) => theme.spacing(8)} ${({ theme }) => theme.spacing(8)};
`;

export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  color: ${({ theme }) => theme.palette.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing(3.2)};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
  border-bottom: ${({ theme }) => theme.borderWidth.thin} solid
    ${({ theme }) => theme.palette.grey[100]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};

  svg {
    color: ${({ theme }) => theme.palette.primary.main};
  }
`;

export const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const DetailItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #f1f5f9;
  transition: all 0.2s ease;

  &:hover {
    border-color: #e0e7ff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
`;

export const DetailIcon = styled.div`
  display: flex;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  // background: #eef2ff;
  // align-items: center;
  justify-content: center;
  margin-right: 0.25rem;

  svg {
    color: oklch(0.446 0.043 257.281);
    font-size: 1rem;
  }
`;

export const DetailInfo = styled.div`
  flex: 1;
`;

export const DetailLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: oklch(0.278 0.033 256.848);
  // text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const DetailValue = styled.div`
  font-size: 0.75rem;
  color: oklch(0.551 0.027 264.364);
  font-weight: 500;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const StatCard = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  // justify-content: space-around;
  padding: 0.1rem;
  background: #f8fafc;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #f1f5f9;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border-color: #e0e7ff;
  }
`;

export const StatIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  // background: ${(props) => `${props.color}10`};
  display: flex;
  align-items: center;
  justify-content: center;
  // margin: 0 auto 0.5rem;

  svg {
    color: ${(props) => props.color};
    font-size: 1rem;
  }
`;

export const StatValue = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  color: #1e293b;
`;

export const StatLabel = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  // margin-top: 0.25rem;
`;

export const InterestsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

export const InterestTag = styled.span`
  padding: 0.5rem 1rem;
  background: #f8fafc;
  color: oklch(0.279 0.041 260.031);
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;

  &:before {
    content: '#';
    color: oklch(0.279 0.041 260.031);
    font-weight: 500;
    margin-right: 0.25rem;
  }

  &:hover {
    cursor: pointer;
    // background: oklch(0.967 0.003 264.542);
    // border-color: oklch(0.967 0.003 264.542);
    transform: translateY(-2px);
  }
`;

export const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #f1f5f9;
  transition: all 0.2s ease;

  &:hover {
    transform: translateX(3px);
    border-color: #e0e7ff;
  }
`;

export const ActivityIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  // background: #eef2ff;
  display: flex;
  // align-items: center;
  justify-content: center;
  margin: 0.25rem;
  flex-shrink: 0;

  svg {
    color: oklch(0.279 0.041 260.031);
    font-size: 0.75rem;
  }
`;

export const ActivityContent = styled.div`
  flex: 1;
`;

export const ActivityTitle = styled.div`
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 0.25rem;
  font-size: 0.75rem;
`;

export const ActivityDescription = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.5;
`;

export const ActivityDate = styled.div`
  font-size: 0.7rem;
  color: oklch(0.551 0.027 264.364);
  margin-top: 0.2rem;
`;

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #64748b;
  font-size: 1.1rem;
`;
