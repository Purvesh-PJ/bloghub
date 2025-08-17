import styled, { keyframes } from 'styled-components';
import IconShare from '@mui/icons-material/Share';
import IconReadMore from '@mui/icons-material/ReadMore';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const fadeInScale = keyframes`
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
`;

export const Container = styled.div`
  position : relative;
  border-radius : 2rem; 
  width : 100%;
  min-height : 500px;
  box-sizing : border-box;
  border : 1px solid #e4e4e7;
`;

export const SlideWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction : row;
  justify-content: center;
  flex: 1 0 100%;
  top: 0;
  left: 0;
  right : 0;
  bottom : 0;
  transition: opacity 0.8s ease-in-out;
  gap : 10px;
  // margin : 10px;
`;

export const ImageSection = styled.div`
  min-width : 50%;
  min-height : 100%;
  box-sizing : border-box;
  // border-radius : 10px;
  // border : 1px solid gray;
`;

export const Image = styled.img`
  width : 100%;
  height : 100%;
  border-radius : 2rem 0rem 0rem 2rem;
`;

export const DataSection = styled.div`
  display : flex;
  flex-direction : column;
  justify-content : space-between; 
  padding : 1.2rem;
  min-width : 40%;
  min-height : 100%;
  border-radius : 10px;
  box-sizing : border-box;
  // border : 1px solid gray;
`;

export const DataWrapper = styled.div`
  // margin-top : auto;
  // margin-bottom : auto;
  // border : 1px solid gray;
`;

export const TitleWrapper  = styled.div`
`;

export const DescriptionWrapper = styled.div`
`;

export const ParagraphWrapper = styled.div`
  // max-height: calc(4em * 1.2); /* Set the height of three lines (adjust the multiplier as needed) */
  // overflow: hidden;
  // display: -webkit-box;
  // -webkit-line-clamp: 4; /* Number of lines to show */
  // -webkit-box-orient: vertical;
  // border : 1px solid gray;
  // // margin-top : auto;
  // //margin-bottom : auto;
`;

export const BlogCardDetailsWrapper = styled.div`
  display : flex;
  flex-direction : column;
  margin-right : auto;
  font-size : 0.80rem;
  padding : 0.30rem;
`;

export const Title = styled.h1`
  font-size : 1.8rem;
`;

export const Description = styled.h3`
  font-size : 1rem;
  color : #2C3E50;
`;

export const Paragraph = styled.p`
  max-height: calc(3em * 1.8); 
  overflow: hidden;
  font-size : 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3; 
  -webkit-box-orient: vertical;
`;

export const ButtonsWrapper = styled.div`
  display : flex;
  justify-content : center;
  align-items : center;
  gap : 1rem;
  padding : 0.20rem;
  min-width : 200px;
  border-radius : 1rem;
  margin-left : auto;
  // border : 1px solid gray;
  z-index : 1;
`;

export const LearnMoreButton = styled.button`
  display : flex;
  flex-direction : row;
  justify-content : center;
  align-items : center;
  border-radius : 5rem;
  gap : 15px;
  width : 150px;
  border : none;
  background-color : #17202A;
  color : white;
  box-shadow: 5px 5px 8px rgba(0, 0, 0, 0.2);
  &:hover {
    background-color : white;
    color : black;
  }
`;

export const ReadMoreText = styled.h4`
`; 

export const ReadMoreIcon = styled(IconReadMore)`
`;

export const ShareIcon = styled(IconShare)`
  // font-size : 2rem;
  // color : white;
  // padding : 0.50rem;
  // border-radius : 5rem;
  // background-color : #17202A ;
  // box-shadow: 5px 5px 8px rgba(0, 0, 0, 0.2);
  // &:hover{
  //   background-color : white;
  //   color : black;
  //   box-shadow: 5px 5px 8px rgba(0, 0, 0, 0.2);
  // }
`;

export const PostDateAndTime = styled.time`
  color: #797D7F;
`;

export const PublishedByText = styled.span`
  color: #797D7F;
`;

export const HeroContainer = styled.section`
  position: relative;
  height: 100vh;
  min-height: 700px;
  width: 100%;
  overflow: hidden;
  background-color: #f8fafc;
  
  @media (max-width: 768px) {
    height: auto;
    min-height: 100vh;
  }
`;

export const HeroSplit = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

export const ContentSide = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 5rem;
  position: relative;
  z-index: 2;
  
  @media (max-width: 1200px) {
    padding: 4rem;
  }
  
  @media (max-width: 768px) {
    padding: 3rem 2rem;
    order: 2;
  }
`;

export const ImageSide = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #4f46e5, #3b82f6);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease-out;
    filter: brightness(0.9) contrast(1.1);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(79, 70, 229, 0.2),
      rgba(59, 130, 246, 0.2)
    );
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    min-height: 50vh;
    order: 1;
  }
`;

export const ShapeContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  pointer-events: none;
`;

export const AnimatedShape = styled.div`
  position: absolute;
  z-index: 2;
  transition: transform 0.3s ease-out;
  
  &.circle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(5px);
    animation: ${float} 6s ease-in-out infinite;
  }
  
  &.square {
    width: 80px;
    height: 80px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    transform-origin: center;
    animation: ${rotate} 15s linear infinite;
  }
  
  &.triangle {
    width: 0;
    height: 0;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-bottom: 86px solid rgba(255, 255, 255, 0.12);
    filter: blur(1px);
    animation: ${float} 8s ease-in-out infinite;
    animation-delay: 2s;
  }
  
  &.donut {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 15px solid rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(5px);
    animation: ${rotate} 20s linear infinite reverse;
  }
  
  @media (max-width: 768px) {
    &.circle {
      width: 80px;
      height: 80px;
    }
    
    &.square {
      width: 60px;
      height: 60px;
    }
    
    &.triangle {
      border-left: 35px solid transparent;
      border-right: 35px solid transparent;
      border-bottom: 60px solid rgba(255, 255, 255, 0.12);
    }
    
    &.donut {
      width: 70px;
      height: 70px;
      border-width: 10px;
    }
  }
`;

export const FeaturedBadge = styled.div`
  display: inline-flex;
  align-items: center;
  background: linear-gradient(to right, #f8fafc, #f1f5f9);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 30px;
  padding: 0.5rem 1.25rem;
  margin-bottom: 2rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #4f46e5;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.6s ease-out;
  
  .dot {
    margin: 0 0.5rem;
    color: #a5b4fc;
  }
  
  span:last-child {
    color: #6366f1;
  }
`;

export const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  color: #1e293b;
  animation: ${fadeIn} 0.8s ease-out;
  letter-spacing: -0.03em;
  
  @media (max-width: 1200px) {
    font-size: 3.5rem;
  }
  
  @media (max-width: 768px) {
    font-size: 2.75rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2.25rem;
  }
`;

export const HighlightedText = styled.span`
  position: relative;
  color: #4f46e5;
  font-weight: 900;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 5px;
    left: 0;
    width: 100%;
    height: 8px;
    background: linear-gradient(90deg, #a5b4fc, #818cf8);
    border-radius: 4px;
    z-index: -1;
    opacity: 0.5;
  }
`;

export const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  line-height: 1.7;
  margin-bottom: 2.5rem;
  color: #64748b;
  max-width: 550px;
  animation: ${fadeIn} 1s ease-out;
  
  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
  animation: ${fadeIn} 1.2s ease-out;
  
  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
  }
`;

export const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #4f46e5, #3b82f6);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  padding: 1rem 2rem;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4);
    background: linear-gradient(135deg, #4338ca, #2563eb);
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  @media (max-width: 480px) {
    width: 100%;
  }
`;

export const SecondaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: white;
  color: #4f46e5;
  font-size: 1rem;
  font-weight: 600;
  padding: 1rem 2rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
    border-color: #cbd5e1;
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  @media (max-width: 480px) {
    width: 100%;
  }
`;

export const TagCloud = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  max-width: 500px;
  animation: ${fadeIn} 1.4s ease-out;
`;

export const Tag = styled.span`
  display: inline-block;
  background: #f1f5f9;
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  animation: ${fadeInScale} 0.5s ease-out forwards;
  transform-origin: center;
  
  &:hover {
    background: #e2e8f0;
    color: #475569;
  }
`;

export const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  z-index: 10;
  animation: ${float} 2s ease-in-out infinite;
  
  span {
    opacity: 0.8;
  }
  
  svg {
    font-size: 1rem;
  }
  
  &:hover {
    color: #4f46e5;
  }
  
  @media (max-width: 768px) {
    bottom: 1rem;
  }
`;
