import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HeroContainer,
  HeroSplit,
  ContentSide,
  ImageSide,
  HeroImage,
  HeroTitle,
  HeroSubtitle,
  HighlightedText,
  ButtonGroup,
  PrimaryButton,
  SecondaryButton,
  ScrollIndicator,
  AnimatedShape,
  ShapeContainer,
  TagCloud,
  Tag,
  FeaturedBadge,
} from './HeroSection.styles';
import { FaPen, FaSearch, FaArrowDown, FaBookOpen } from 'react-icons/fa';
import { useAuth } from '../../../../context/AuthContext';

// Modern hero image
const heroImage =
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';

const HeroSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Popular tags for the tag cloud
  const tags = [
    'Technology',
    'Design',
    'Travel',
    'Food',
    'Health',
    'Science',
    'Business',
    'Art',
    'Photography',
    'Music',
  ];

  // Handle mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      setMousePosition({ x, y });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Handle CTA button clicks
  const handlePrimaryClick = () => {
    if (isAuthenticated) {
      navigate('/create-post');
    } else {
      navigate('/signup');
    }
  };

  const handleSecondaryClick = () => {
    navigate('/explore');
  };

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <HeroContainer ref={containerRef}>
      <HeroSplit>
        <ContentSide>
          <FeaturedBadge>
            <span>Wordsmith</span>
            <span className="dot">•</span>
            <span>Blog Platform</span>
          </FeaturedBadge>

          <HeroTitle>
            Where <HighlightedText>ideas</HighlightedText> come to life through words
          </HeroTitle>

          <HeroSubtitle>
            Join our community of passionate writers and curious readers. Discover stories that
            inspire, inform, and entertain.
          </HeroSubtitle>

          <ButtonGroup>
            <PrimaryButton onClick={handlePrimaryClick}>
              {isAuthenticated ? (
                <>
                  <FaPen /> Start Writing
                </>
              ) : (
                <>
                  <FaBookOpen /> Join Wordsmith
                </>
              )}
            </PrimaryButton>
            <SecondaryButton onClick={handleSecondaryClick}>
              <FaSearch /> Explore Content
            </SecondaryButton>
          </ButtonGroup>

          <TagCloud>
            {tags.map((tag, index) => (
              <Tag key={index} delay={`${index * 0.1}s`} opacity={Math.random() * 0.5 + 0.5}>
                {tag}
              </Tag>
            ))}
          </TagCloud>
        </ContentSide>

        <ImageSide>
          <HeroImage
            src={heroImage}
            alt="Hero"
            scale={1.1}
            tx={mousePosition.x * -20}
            ty={mousePosition.y * -20}
          />

          <ShapeContainer>
            <AnimatedShape
              className="circle"
              style={{
                top: '15%',
                left: '10%',
                transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`,
              }}
            />
            <AnimatedShape
              className="square"
              style={{
                top: '60%',
                right: '15%',
                transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px) rotate(${scrollY * 0.05}deg)`,
              }}
            />
            <AnimatedShape
              className="triangle"
              style={{
                bottom: '20%',
                left: '20%',
                transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 15}px)`,
              }}
            />
            <AnimatedShape
              className="donut"
              style={{
                top: '30%',
                right: '25%',
                transform: `translate(${mousePosition.x * -25}px, ${mousePosition.y * -25}px) rotate(${scrollY * 0.08}deg)`,
              }}
            />
          </ShapeContainer>
        </ImageSide>
      </HeroSplit>

      <ScrollIndicator onClick={handleScrollDown}>
        <span>Scroll Down</span>
        <FaArrowDown />
      </ScrollIndicator>
    </HeroContainer>
  );
};

export default HeroSection;
