import styled, { keyframes } from 'styled-components';
import { fadeIn } from '../../../../components/common/theme/animations';
import { breakpoint } from '../../../../components/common/theme/breakpoints';

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

export const HeroContainer = styled.section`
  position: relative;
  height: 100vh;
  min-height: 700px;
  width: 100%;
  overflow: hidden;
  background-color: ${({ theme }) => theme.palette.background.default};

  ${breakpoint.down('tablet')} {
    height: auto;
    min-height: 100vh;
  }
`;

export const HeroSplit = styled.div`
  display: flex;
  height: 100%;
  width: 100%;

  ${breakpoint.down('desktop')} {
    flex-direction: column;
  }
`;

export const ContentSide = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(20)};
  position: relative;
  z-index: 2;

  ${breakpoint.down('desktop')} {
    padding: ${({ theme }) => theme.spacing(16)};
  }

  ${breakpoint.down('tablet')} {
    padding: ${({ theme }) => theme.spacing(12)} ${({ theme }) => theme.spacing(8)};
    order: 2;
  }
`;

export const ImageSide = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  background: ${({ theme }) =>
    `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`};

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
    background: linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(59, 130, 246, 0.2));
    z-index: 1;
  }

  ${breakpoint.down('tablet')} {
    min-height: 50vh;
    order: 1;
  }
`;

export const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${({ theme }) => theme.motion.duration.slow};
  filter: brightness(0.9) contrast(1.1);
  transform: ${({ $scale = 1, $tx = 0, $ty = 0 }) =>
    `scale(${$scale}) translate(${$tx}px, ${$ty}px)`};
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

  ${breakpoint.down('tablet')} {
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
  border: ${({ theme }) => theme.borderWidth.thin} solid rgba(226, 232, 240, 0.8);
  border-radius: ${({ theme }) => theme.radii.pill};
  padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(5)};
  margin-bottom: ${({ theme }) => theme.spacing(8)};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.palette.primary.main};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  animation: ${fadeIn} 0.6s ease-out;

  .dot {
    margin: 0 ${({ theme }) => theme.spacing(2)};
    color: #a5b4fc;
  }

  span:last-child {
    color: ${({ theme }) => theme.palette.primary.main};
  }
`;

export const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: ${({ theme }) => theme.typography.weight.extrabold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  margin-bottom: ${({ theme }) => theme.spacing(6)};
  color: ${({ theme }) => theme.palette.text.primary};
  animation: ${fadeIn} 0.8s ease-out;
  letter-spacing: -0.03em;

  ${breakpoint.down('desktop')} {
    font-size: 3.5rem;
  }
  ${breakpoint.down('tablet')} {
    font-size: 2.75rem;
  }
  ${breakpoint.down('mobile')} {
    font-size: 2.25rem;
  }
`;

export const HighlightedText = styled.span`
  position: relative;
  color: ${({ theme }) => theme.palette.primary.main};
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
  font-size: ${({ theme }) => theme.typography.size.xl};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  margin-bottom: ${({ theme }) => theme.spacing(10)};
  color: ${({ theme }) => theme.palette.text.secondary};
  max-width: 550px;
  animation: ${fadeIn} 1s ease-out;

  ${breakpoint.down('tablet')} {
    font-size: ${({ theme }) => theme.typography.size.lg};
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(4)};
  margin-bottom: ${({ theme }) => theme.spacing(12)};
  animation: ${fadeIn} 1.2s ease-out;

  ${breakpoint.down('mobile')} {
    flex-direction: column;
    width: 100%;
  }
`;

export const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(2)};
  background: ${({ theme }) =>
    `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.info.main})`};
  color: ${({ theme }) => theme.palette.primary.contrastText};
  font-size: ${({ theme }) => theme.typography.size.md};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(8)};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.motion.duration.normal};
  box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4);
    background: ${({ theme }) =>
      `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.info.dark})`};
  }

  &:active {
    transform: translateY(-1px);
  }

  ${breakpoint.down('mobile')} {
    width: 100%;
  }
`;

export const SecondaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(2)};
  background: ${({ theme }) => theme.palette.background.surface};
  color: ${({ theme }) => theme.palette.primary.main};
  font-size: ${({ theme }) => theme.typography.size.md};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(8)};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: ${({ theme }) => theme.borderWidth.thin} solid ${({ theme }) => theme.palette.grey[200]};
  cursor: pointer;
  transition: all ${({ theme }) => theme.motion.duration.normal};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadows.md};
    border-color: ${({ theme }) => theme.palette.grey[300]};
  }

  &:active {
    transform: translateY(-1px);
  }

  ${breakpoint.down('mobile')} {
    width: 100%;
  }
`;

export const TagCloud = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(3)};
  max-width: 500px;
  animation: ${fadeIn} 1.4s ease-out;
`;

export const Tag = styled.span`
  display: inline-block;
  background: ${({ theme }) => theme.palette.grey[100]};
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  padding: ${({ theme }) => theme.spacing(1.4)} ${({ theme }) => theme.spacing(3)};
  border-radius: ${({ theme }) => theme.radii.pill};
  animation: ${fadeInScale} 0.5s ease-out forwards;
  transform-origin: center;
  opacity: ${({ $opacity }) => ($opacity === undefined ? 1 : $opacity)};
  animation-delay: ${({ $delay }) => ($delay ? $delay : '0s')};

  &:hover {
    background: ${({ theme }) => theme.palette.grey[200]};
    color: ${({ theme }) => theme.palette.text.primary};
  }
`;

export const ScrollIndicator = styled.div`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing(8)};
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  cursor: pointer;
  z-index: 10;
  animation: ${float} 2s ease-in-out infinite;

  span {
    opacity: 0.8;
  }
  svg {
    font-size: ${({ theme }) => theme.typography.size.md};
  }

  &:hover {
    color: ${({ theme }) => theme.palette.primary.main};
  }

  ${breakpoint.down('tablet')} {
    bottom: ${({ theme }) => theme.spacing(4)};
  }
`;
