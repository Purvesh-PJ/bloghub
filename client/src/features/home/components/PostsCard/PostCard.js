import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaRegClock, FaRegComment } from 'react-icons/fa';

const Card = styled.article`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.palette.background.surface || '#fff'};
  border: 1px solid ${({ theme }) => theme.palette.divider || '#e5e7eb'};
  border-radius: 12px;
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  }
`;

const Cover = styled.div`
  height: 180px;
  background: #f3f4f6;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const Content = styled.div`
  padding: 1rem;
`;

const Title = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: ${({ theme }) => theme.palette.text.primary};

  a {
    color: inherit;
    text-decoration: none;
  }
`;

const Excerpt = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.palette.text.secondary};
  margin: 0 0 0.75rem 0;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.palette.text.muted};
`;

export default function ArticleCard({ data = {}, index }) {
  const defaultImage =
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1600&auto=format&fit=crop';

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <Card data-index={index}>
      <Cover>
        <img src={data.imageURL || defaultImage} alt={data.title || 'Post cover'} />
      </Cover>
      <Content>
        <Title>
          <Link to={`/post/${data._id}`}>{data.title || 'Untitled Post'}</Link>
        </Title>
        <Excerpt>
          {data.excerpt ||
            (data.content ? `${data.content.substring(0, 120)}...` : 'No description provided.')}
        </Excerpt>
        <Meta>
          <span>
            <FaRegClock /> {formatDate(data.createdAt)}
          </span>
          <span>
            <FaRegComment /> {data.commentCount || 0}
          </span>
        </Meta>
      </Content>
    </Card>
  );
}
