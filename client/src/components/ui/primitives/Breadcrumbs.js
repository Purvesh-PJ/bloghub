import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Breadcrumbs container
export const Breadcrumbs = styled.nav`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(2)};
  font-size: ${({ $size, theme }) => {
    if ($size === 'sm') return theme.typography.size.xs;
    if ($size === 'lg') return theme.typography.size.md;
    return theme.typography.size.sm;
  }};
  color: ${({ theme }) => theme.palette.text.secondary};
`;

// Breadcrumb separator (defined before it's referenced)
export const BreadcrumbSeparator = styled.span`
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.palette.text.muted};
  user-select: none;
  flex-shrink: 0;
`;

// Breadcrumb item
export const BreadcrumbItem = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  color: ${({ $active, theme }) =>
    $active ? theme.palette.text.primary : theme.palette.text.secondary};
  font-weight: ${({ $active, theme }) =>
    $active ? theme.typography.weight.medium : theme.typography.weight.regular};

  &:last-child {
    ${BreadcrumbSeparator} {
      display: none;
    }
  }
`;

// Breadcrumb link
export const BreadcrumbLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  transition: color ${({ theme }) => theme.motion.duration.fast};

  &:hover {
    color: ${({ theme }) => theme.palette.primary.main};
    text-decoration: underline;
  }

  &:focus-visible {
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.radii.sm};
  }
`;

// Breadcrumb icon wrapper
export const BreadcrumbIcon = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 1em;
`;

// Compose Breadcrumbs with sub-components
Breadcrumbs.Item = BreadcrumbItem;
Breadcrumbs.Link = BreadcrumbLink;
Breadcrumbs.Separator = BreadcrumbSeparator;
Breadcrumbs.Icon = BreadcrumbIcon;

export default Breadcrumbs;
