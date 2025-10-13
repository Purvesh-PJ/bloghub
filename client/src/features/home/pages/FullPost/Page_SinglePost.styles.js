import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { spin, fadeIn } from '../../../../components/common/theme/animations';
import { Paper } from '../../../../components/ui/primitives';
import { breakpoint } from '../../../../components/common/theme/breakpoints';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.palette.grey[50]};
  min-width: 50%;
  min-height: 400px;
  gap: ${({ theme }) => theme.spacing(5)};
  padding: ${({ theme }) => theme.spacing(5)};
  max-width: 1440px;
  margin: 0 auto;

  ${breakpoint.down('desktop')} {
    padding: ${({ theme }) => theme.spacing(4)};
    gap: ${({ theme }) => theme.spacing(4)};
  }

  ${breakpoint.down('tablet')} {
    flex-direction: column;
  }
`;

export const MainContainer = styled(Paper)`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};
  padding: ${({ theme }) => theme.spacing(8)};
  max-width: 800px;
  margin: 0 auto;

  ${breakpoint.down('tablet')} {
    padding: ${({ theme }) => theme.spacing(5)};
  }
`;

export const LeftContainer = styled.div`
  padding: 0;
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};

  ${breakpoint.down('tablet')} {
    width: 100%;
    order: 2;
  }
`;

export const RightContainer = styled.div`
  padding: 0;
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};

  .bookmark-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${({ theme }) => theme.spacing(2)};
    padding: ${({ theme }) => theme.spacing(3)};
    background-color: ${({ theme }) => theme.palette.background.surface};
    border: ${({ theme }) => theme.borderWidth.thin} solid ${({ theme }) => theme.palette.grey[200]};
    border-radius: ${({ theme }) => theme.radii.lg};
    font-weight: ${({ theme }) => theme.typography.weight.medium};
    color: ${({ theme }) => theme.palette.text.secondary};
    cursor: pointer;
    transition: all ${({ theme }) => theme.motion.duration.fast};
    box-shadow: ${({ theme }) => theme.shadows.sm};

    &:hover {
      background-color: ${({ theme }) => theme.palette.grey[50]};
      transform: translateY(-2px);
    }

    svg {
      font-size: 1.25rem;
      color: ${({ theme }) => theme.palette.primary.main};
    }
  }

  ${breakpoint.down('tablet')} {
    width: 100%;
    order: 3;
  }
`;

export const RelatedPostsSection = styled(Paper)`
  position: sticky;
  top: 4rem;
  padding: ${({ theme }) => theme.spacing(5)};
  animation: ${fadeIn} 0.4s ease-out;

  .placeholder-text {
    color: ${({ theme }) => theme.palette.text.muted};
    font-size: ${({ theme }) => theme.typography.size.sm};
    text-align: center;
    margin-top: ${({ theme }) => theme.spacing(8)};
    font-style: italic;
  }
`;

export const TableOfContentsWrapper = styled(Paper)`
  position: sticky;
  top: 4rem;
  padding: ${({ theme }) => theme.spacing(5)};
  animation: ${fadeIn} 0.3s ease-out;
`;

export const PopularTagsWrapper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(5)};
  animation: ${fadeIn} 0.5s ease-out;
`;

export const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-top: ${({ theme }) => theme.spacing(3)};
`;

export const TagLink = styled(Link)`
  background-color: ${({ theme }) => theme.palette.grey[100]};
  color: ${({ theme }) => theme.palette.primary.main};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  padding: ${({ theme }) => theme.spacing(1.5)} ${({ theme }) => theme.spacing(3)};
  border-radius: ${({ theme }) => theme.radii.pill};
  text-decoration: none;
  transition: all ${({ theme }) => theme.motion.duration.fast};

  &:hover {
    background-color: ${({ theme }) => theme.palette.primary.light};
    color: ${({ theme }) => theme.palette.primary.dark};
    transform: translateY(-2px);
  }
`;

export const PostTitle = styled.h3`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.size.lg};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.palette.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing(4)} 0;
  padding-bottom: ${({ theme }) => theme.spacing(2)};
  border-bottom: ${({ theme }) => theme.borderWidth.medium} solid
    ${({ theme }) => theme.palette.grey[200]};
`;

export const ReadingProgress = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  background-color: ${({ theme }) => theme.palette.primary.main};
  z-index: 1000;
  transition: width ${({ theme }) => theme.motion.duration.normal};
`;

export const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  width: 100%;
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.md};
  gap: ${({ theme }) => theme.spacing(4)};

  .loading-icon {
    font-size: 2.5rem;
    animation: ${spin} 1s linear infinite;
    color: ${({ theme }) => theme.palette.primary.main};
  }
`;

export const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  width: 100%;
  color: ${({ theme }) => theme.palette.error.main};
  font-size: ${({ theme }) => theme.typography.size.md};
  gap: ${({ theme }) => theme.spacing(4)};

  svg {
    font-size: 3rem;
  }

  p {
    max-width: 500px;
    text-align: center;
  }
`;

export const BackToTopButton = styled.button`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing(7.5)};
  right: ${({ theme }) => theme.spacing(7.5)};
  width: 50px;
  height: 50px;
  border-radius: ${({ theme }) => theme.radii.full};
  background-color: ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.common.white};
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  transition: all ${({ theme }) => theme.motion.duration.fast};
  z-index: 100;
  animation: ${fadeIn} 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.palette.primary.dark};
    transform: translateY(-4px);
  }

  svg {
    font-size: 24px;
  }

  ${breakpoint.down('tablet')} {
    bottom: ${({ theme }) => theme.spacing(5)};
    right: ${({ theme }) => theme.spacing(5)};
    width: 40px;
    height: 40px;
  }
`;

export const AuthorProfileCard = styled.div`
  display: flex;
  gap: 20px;
  background-color: #f8fafc;
  border-radius: 12px;
  padding: 24px;
  border-top: 4px solid #3b82f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .author-info {
    flex: 1;

    h3 {
      font-size: 0.875rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 4px 0;
    }

    h4 {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: #1e293b;
    }

    p {
      font-size: 0.9375rem;
      color: #475569;
      margin: 0 0 16px 0;
      line-height: 1.5;
    }

    .view-profile {
      display: inline-block;
      font-size: 0.875rem;
      font-weight: 500;
      color: #3b82f6;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: center;
    text-align: center;

    img {
      margin-bottom: 8px;
    }
  }
`;

export const SubscriptionBox = styled.div`
  background-color: #eff6ff;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #bfdbfe;
  animation: ${fadeIn} 0.6s ease-out;

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e40af;
    margin: 0 0 8px 0;
  }

  p {
    font-size: 0.9375rem;
    color: #3b82f6;
    margin: 0 0 16px 0;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 12px;

    input {
      padding: 12px;
      border-radius: 6px;
      border: 1px solid #bfdbfe;
      font-size: 0.875rem;

      &:focus {
        outline: none;
        border-color: #3b82f6;
      }
    }

    button {
      padding: 12px;
      background-color: #3b82f6;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background-color: #2563eb;
      }
    }
  }

  small {
    display: block;
    font-size: 0.75rem;
    color: #64748b;
  }
`;

export const PostNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: ${({ theme }) => theme.borderWidth.thin} solid
    ${({ theme }) => theme.palette.grey[200]};
  border-bottom: ${({ theme }) => theme.borderWidth.thin} solid
    ${({ theme }) => theme.palette.grey[200]};
  padding: ${({ theme }) => theme.spacing(5)} 0;
  margin: 0;

  a {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing(3)};
    max-width: 45%;
    text-decoration: none;
    color: ${({ theme }) => theme.palette.text.secondary};
    transition: all ${({ theme }) => theme.motion.duration.fast};
    padding: ${({ theme }) => theme.spacing(2)};
    border-radius: ${({ theme }) => theme.radii.lg};

    &:hover {
      background-color: ${({ theme }) => theme.palette.grey[50]};
      color: ${({ theme }) => theme.palette.primary.main};
    }

    svg {
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    div {
      overflow: hidden;
    }

    span {
      display: block;
      font-size: ${({ theme }) => theme.typography.size.xs};
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: ${({ theme }) => theme.spacing(1)};
    }

    p {
      font-weight: ${({ theme }) => theme.typography.weight.medium};
      font-size: ${({ theme }) => theme.typography.size.md};
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .prev-post {
    margin-right: auto;
  }

  .next-post {
    margin-left: auto;
    text-align: right;
  }

  ${breakpoint.down('mobile')} {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing(4)};

    a {
      max-width: 100%;
    }
  }
`;
