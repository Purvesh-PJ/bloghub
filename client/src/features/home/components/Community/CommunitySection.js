import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaUser,
  FaFileAlt,
  FaFolder,
  FaComment,
  FaTwitter,
  FaLinkedinIn,
  FaGlobe,
  FaArrowRight,
} from 'react-icons/fa';
import {
  CommunityContainer,
  CommunityLayout,
  TopAuthorsSection,
  SectionHeader,
  AuthorList,
  AuthorCard,
  AuthorAvatar,
  AuthorBadge,
  AuthorInfo,
  AuthorName,
  AuthorMeta,
  AuthorPosts,
  AuthorSocial,
  SocialIcon,
  StatsSection,
  StatsGrid,
  StatCard,
  StatIconContainer,
  StatValue,
  StatLabel,
  EmptyMessage,
  TopAuthorBadge,
} from './CommunitySection.styles';

const defaultAvatar = 'https://via.placeholder.com/60';

const CommunitySection = ({ authors = [], stats = {} }) => {
  // Stats configuration with colors and gradients
  const statsConfig = [
    {
      icon: <FaFileAlt />,
      label: 'Total Posts',
      value: stats.totalPosts || 0,
      bgColor: 'linear-gradient(135deg, #4f46e5, #3b82f6)',
      shadowColor: 'rgba(79, 70, 229, 0.2)',
      gradient: 'linear-gradient(135deg, #4f46e5, #3b82f6)',
    },
    {
      icon: <FaUser />,
      label: 'Community Members',
      value: stats.totalUsers || 0,
      bgColor: 'linear-gradient(135deg, #ec4899, #f472b6)',
      shadowColor: 'rgba(236, 72, 153, 0.2)',
      gradient: 'linear-gradient(135deg, #ec4899, #f472b6)',
    },
    {
      icon: <FaFolder />,
      label: 'Categories',
      value: stats.totalCategories || 0,
      bgColor: 'linear-gradient(135deg, #10b981, #34d399)',
      shadowColor: 'rgba(16, 185, 129, 0.2)',
      gradient: 'linear-gradient(135deg, #10b981, #34d399)',
    },
    {
      icon: <FaComment />,
      label: 'Comments',
      value: stats.totalComments || 0,
      bgColor: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
      shadowColor: 'rgba(245, 158, 11, 0.2)',
      gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    },
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
                    <AuthorBadge $topContributor={index < 3}>
                      {index < 3 ? index + 1 : ''}
                    </AuthorBadge>
                  </AuthorAvatar>

                  <AuthorInfo>
                    <AuthorName>
                      {author.username}
                      {index === 0 && <TopAuthorBadge>Top Author</TopAuthorBadge>}
                    </AuthorName>

                    <AuthorMeta>
                      <AuthorPosts>
                        <FaFileAlt />
                        {author.postCount || 0} {author.postCount === 1 ? 'post' : 'posts'}
                      </AuthorPosts>

                      <AuthorSocial>
                        {author.social?.twitter && (
                          <SocialIcon
                            href={author.social.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FaTwitter size={12} />
                          </SocialIcon>
                        )}
                        {author.social?.linkedin && (
                          <SocialIcon
                            href={author.social.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FaLinkedinIn size={12} />
                          </SocialIcon>
                        )}
                        {author.social?.website && (
                          <SocialIcon
                            href={author.social.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
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
                  $bgColor={stat.bgColor}
                  $shadowColor={stat.shadowColor}
                  className="stat-icon"
                >
                  {stat.icon}
                </StatIconContainer>
                <StatValue $gradient={stat.gradient}>{stat.value.toLocaleString()}</StatValue>
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
