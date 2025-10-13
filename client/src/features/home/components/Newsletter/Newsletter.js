import React, { useState } from 'react';
import styled from 'styled-components';
import { FaArrowRight, FaCheck } from 'react-icons/fa';
import { Alert } from '../../../../components/ui/primitives';

const NewsletterContainer = styled.section`
  margin-top: 2rem;
  // background: linear-gradient(135deg, #4f46e5 0%, #2563eb 100%);
  border-radius: 0.75rem;
  padding: 3rem 2rem;
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
    z-index: 0;
  }
`;

const NewsletterContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 600px;
  margin: 0 auto;
`;

const NewsletterTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const NewsletterDescription = styled.p`
  font-size: 1.125rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const NewsletterForm = styled.form`
  display: flex;
  max-width: 500px;
  margin: 0 auto;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 9999px 0 0 9999px;
  font-size: 1rem;
  outline: none;

  @media (max-width: 640px) {
    border-radius: 9999px;
  }
`;

const NewsletterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: #1e293b;
  color: white;
  font-weight: 600;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 0 9999px 9999px 0;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #0f172a;
  }

  @media (max-width: 640px) {
    border-radius: 9999px;
  }
`;

// SuccessMessage migrated to Alert primitive

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Here you would typically send this to your API
      console.log(`Subscribing email: ${email}`);
      setIsSubmitted(true);
      setEmail('');
    }
  };

  return (
    <NewsletterContainer>
      <NewsletterContent>
        <NewsletterTitle>Subscribe to Our Newsletter</NewsletterTitle>
        <NewsletterDescription>
          Stay updated with the latest articles, trends, and insights delivered straight to your
          inbox.
        </NewsletterDescription>

        {!isSubmitted ? (
          <NewsletterForm onSubmit={handleSubmit}>
            <NewsletterInput
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <NewsletterButton type="submit">
              Subscribe
              <FaArrowRight />
            </NewsletterButton>
          </NewsletterForm>
        ) : (
          <Alert $variant="success" style={{ marginTop: '1rem' }}>
            <Alert.Icon>
              <FaCheck />
            </Alert.Icon>
            <Alert.Content>Thank you for subscribing! Check your email to confirm.</Alert.Content>
          </Alert>
        )}
      </NewsletterContent>
    </NewsletterContainer>
  );
};

export default Newsletter;
