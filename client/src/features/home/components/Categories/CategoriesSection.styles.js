import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { breakpoint } from '../../../../components/common/theme/breakpoints';

export const CategoriesContainer = styled.section`
  margin: ${({ theme }) => theme.spacing(8)} 0;
`;

export const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing(6)};

  ${breakpoint.down('tablet')} {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: ${({ theme }) => theme.spacing(4)};
  }
`;

export const CategoryCard = styled(Link)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(8)} ${({ theme }) => theme.spacing(6)};
  border-radius: ${({ theme }) => theme.radii.xl};
  text-decoration: none;
  color: ${({ theme }) => theme.palette.common.white};
  text-align: center;
  overflow: hidden;
  transition: all ${({ theme }) => theme.motion.duration.normal};
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${(props) => props.$gradient || 'linear-gradient(135deg, #4f46e5, #3b82f6)'};
    z-index: -1;
    transition: transform ${({ theme }) => theme.motion.duration.normal};
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${({ theme }) => theme.shadows.xl};

    &::before {
      transform: scale(1.1);
    }

    .icon-container {
      transform: translateY(-5px);
    }
  }
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.radii.full};
  margin-bottom: ${({ theme }) => theme.spacing(5)};
  backdrop-filter: blur(5px);
  transition: transform ${({ theme }) => theme.motion.duration.normal};

  svg {
    font-size: 2rem;
  }
`;

export const CategoryName = styled.h3`
  font-size: ${({ theme }) => theme.typography.size.xl};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  letter-spacing: 0.01em;
`;

export const CategoryCount = styled.span`
  font-size: ${({ theme }) => theme.typography.size.sm};
  opacity: 0.9;
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`;

export const EmptyMessage = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.lg};
  padding: ${({ theme }) => theme.spacing(12)};
  background: ${({ theme }) => theme.palette.grey[50]};
  border-radius: ${({ theme }) => theme.radii.xl};
  border: ${({ theme }) => theme.borderWidth.thin} dashed ${({ theme }) => theme.palette.grey[200]};
  width: 100%;
  grid-column: 1 / -1;
`;
