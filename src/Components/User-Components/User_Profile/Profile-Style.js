import styled from "styled-components";

// Main Layout
export const ProfilePage = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  // max-width: 1000px;
  margin: 0 auto;
  padding: 0.50rem;
  background: white;
  border-radius: 16px;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

// Card Components
export const ProfileCard = styled.div`
  // box-shadow: 0 4px 20px rgba(0, 0, 0, 0.07);
  overflow: hidden;
  width: 100%;
`;

export const ProfileHeader = styled.div`
  padding: 1rem;
  margin : 1rem;
  // background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  background-color: oklch(0.985 0.002 247.839);
  display: flex;
  gap: 2rem;
  // align-items: center;
  border-radius: 0.80rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

export const ProfileImageWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  border: 4px solid white;
  
  @media (max-width: 768px) {
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
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const ProfileStatus = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  border : 1px solid #f1f1f1;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
  
  svg {
    color: #6366f1;
  }
`;

export const ProfileBio = styled.p`
  font-size: 0.75rem;
  color: #475569;
  line-height: 1.6;
  margin-bottom: 0;
  font-style: italic;
  position: relative;
  
  &::before {
    content: '"';
    position: absolute;
    left: -0.5rem;
    top: -0.5rem;
    font-size: 1.5rem;
    color: #6366f1;
    opacity: 0.2;
  }
`;

export const ProfileContent = styled.div`
  padding: 0 2rem 2rem;
`;

export const SectionTitle = styled.h2`
  font-size: 0.75rem;
  font-weight: 500;
  color: #1e293b;
  margin: 0rem 0 0.80rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: #6366f1;
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
  // background: ${props => `${props.color}10`};
  display: flex;
  align-items: center;
  justify-content: center;
  // margin: 0 auto 0.5rem;
  
  svg {
    color: ${props => props.color};
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
  gap: 0.50rem;
`;

export const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 0.50rem;
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
  margin : 0.25rem;
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
  font-size: 0.70rem;
  color: oklch(0.551 0.027 264.364);
  margin-top: 0.20rem;
`;

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #64748b;
  font-size: 1.1rem;
`;