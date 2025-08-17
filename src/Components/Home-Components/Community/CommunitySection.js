import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { 
  FaUser, FaFileAlt, FaFolder, FaComment, 
  FaTwitter, FaLinkedinIn, FaGlobe, FaArrowRight 
} from 'react-icons/fa';

const CommunityContainer = styled.section`
  margin: 2rem 0;
`;

const CommunityLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const TopAuthorsSection = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }
  
  a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #4f46e5;
    font-size: 0.875rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s ease;
    
    svg {
      transition: transform 0.2s ease;
    }
    
    &:hover {
      color: #3730a3;
      
      svg {
        transform: translateX(3px);
      }
    }
  }
`;

const AuthorList = styled.div`
  padding: 1rem;
`;

const AuthorCard = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  text-decoration: none;
  color: #1e293b;
  border-radius: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f8fafc;
    transform: translateX(5px);
  }
`;

const AuthorAvatar = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 3px solid white;
  
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
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
  }
`;

const AuthorBadge = styled.span`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 22px;
  height: 22px;
  background: ${props => props.topContributor ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' : '#e2e8f0'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  font-size: 10px;
  color: ${props => props.topContributor ? 'white' : '#64748b'};
`;

const AuthorInfo = styled.div`
  flex: 1;
`;

const AuthorName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AuthorMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: #64748b;
`;

const AuthorPosts = styled.span`
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

const AuthorSocial = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SocialIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #f1f5f9;
  color: #64748b;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #4f46e5;
    color: white;
    transform: translateY(-2px);
  }
`;

const StatsSection = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background-color: #f1f5f9;
`;

const StatCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  background-color: white;
  overflow: hidden;
  transition: all 0.3s ease;
  z-index: 1;
  
  &:hover {
    transform: translateY(-5px);
    
    .stat-icon {
      transform: scale(1.1);
    }
  }
`;

const StatIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: ${props => props.bgColor || 'linear-gradient(135deg, #4f46e5, #3b82f6)'};
  color: white;
  border-radius: 12px;
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 12px ${props => props.shadowColor || 'rgba(79, 70, 229, 0.2)'};
`;

const StatValue = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  background: ${props => props.gradient || 'linear-gradient(135deg, #1e293b, #334155)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StatLabel = styled.span`
  font-size: 0.95rem;
  color: #64748b;
  text-align: center;
  font-weight: 500;
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #64748b;
  font-size: 1.125rem;
  padding: 3rem 1.5rem;
`;

const defaultAvatar = "https://via.placeholder.com/60";

const CommunitySection = ({ authors = [], stats = {} }) => {
  // Stats configuration with colors and gradients
  const statsConfig = [
    {
      icon: <FaFileAlt />,
      label: "Total Posts",
      value: stats.totalPosts || 0,
      bgColor: "linear-gradient(135deg, #4f46e5, #3b82f6)",
      shadowColor: "rgba(79, 70, 229, 0.2)",
      gradient: "linear-gradient(135deg, #4f46e5, #3b82f6)"
    },
    {
      icon: <FaUser />,
      label: "Community Members",
      value: stats.totalUsers || 0,
      bgColor: "linear-gradient(135deg, #ec4899, #f472b6)",
      shadowColor: "rgba(236, 72, 153, 0.2)",
      gradient: "linear-gradient(135deg, #ec4899, #f472b6)"
    },
    {
      icon: <FaFolder />,
      label: "Categories",
      value: stats.totalCategories || 0,
      bgColor: "linear-gradient(135deg, #10b981, #34d399)",
      shadowColor: "rgba(16, 185, 129, 0.2)",
      gradient: "linear-gradient(135deg, #10b981, #34d399)"
    },
    {
      icon: <FaComment />,
      label: "Comments",
      value: stats.totalComments || 0,
      bgColor: "linear-gradient(135deg, #f59e0b, #fbbf24)",
      shadowColor: "rgba(245, 158, 11, 0.2)",
      gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)"
    }
  ];

  return (
    <CommunityContainer>
      <CommunityLayout>
        <TopAuthorsSection>
          <SectionHeader>
            <h3>Top Contributors</h3>
            <Link to="/authors">
              View all <FaArrowRight />
            </Link>
          </SectionHeader>
          
          <AuthorList>
            {authors.length > 0 ? (
              authors.map((author, index) => (
                <AuthorCard key={author._id || author.id} to={`/author/${author._id || author.id}`}>
                  <AuthorAvatar>
                    <img src={author.profileImage || defaultAvatar} alt={author.username} />
                    <AuthorBadge topContributor={index < 3}>
                      {index < 3 ? (index + 1) : ''}
                    </AuthorBadge>
                  </AuthorAvatar>
                  
                  <AuthorInfo>
                    <AuthorName>
                      {author.username}
                      {index === 0 && (
                        <span style={{ 
                          fontSize: '0.75rem', 
                          color: '#f59e0b', 
                          backgroundColor: '#fef3c7', 
                          padding: '0.15rem 0.5rem', 
                          borderRadius: '20px' 
                        }}>
                          Top Author
                        </span>
                      )}
                    </AuthorName>
                    
                    <AuthorMeta>
                      <AuthorPosts>
                        <FaFileAlt />
                        {author.postCount || 0} {author.postCount === 1 ? 'post' : 'posts'}
                      </AuthorPosts>
                      
                      <AuthorSocial>
                        {author.social?.twitter && (
                          <SocialIcon href={author.social.twitter} target="_blank" rel="noopener noreferrer">
                            <FaTwitter size={12} />
                          </SocialIcon>
                        )}
                        {author.social?.linkedin && (
                          <SocialIcon href={author.social.linkedin} target="_blank" rel="noopener noreferrer">
                            <FaLinkedinIn size={12} />
                          </SocialIcon>
                        )}
                        {author.social?.website && (
                          <SocialIcon href={author.social.website} target="_blank" rel="noopener noreferrer">
                            <FaGlobe size={12} />
                          </SocialIcon>
                        )}
                      </AuthorSocial>
                    </AuthorMeta>
                  </AuthorInfo>
                </AuthorCard>
              ))
            ) : (
              <EmptyMessage>No authors to display</EmptyMessage>
            )}
          </AuthorList>
        </TopAuthorsSection>
        
        <StatsSection>
          <SectionHeader>
            <h3>Platform Stats</h3>
          </SectionHeader>
          
          <StatsGrid>
            {statsConfig.map((stat, index) => (
              <StatCard key={index}>
                <StatIconContainer 
                  bgColor={stat.bgColor} 
                  shadowColor={stat.shadowColor}
                  className="stat-icon"
                >
                  {stat.icon}
                </StatIconContainer>
                <StatValue gradient={stat.gradient}>
                  {stat.value.toLocaleString()}
                </StatValue>
                <StatLabel>{stat.label}</StatLabel>
              </StatCard>
            ))}
          </StatsGrid>
        </StatsSection>
      </CommunityLayout>
    </CommunityContainer>
  );
};

export default CommunitySection;