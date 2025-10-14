import styled from 'styled-components';

// Search input wrapper
export const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: ${({ $width }) => $width || '100%'};
  max-width: ${({ $maxWidth }) => $maxWidth || 'none'};
`;

// Search input field
export const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme, $size }) => {
    if ($size === 'sm')
      return `${theme.spacing(2)} ${theme.spacing(3)} ${theme.spacing(2)} ${theme.spacing(10)}`;
    if ($size === 'lg')
      return `${theme.spacing(4)} ${theme.spacing(5)} ${theme.spacing(4)} ${theme.spacing(12)}`;
    return `${theme.spacing(3)} ${theme.spacing(4)} ${theme.spacing(3)} ${theme.spacing(11)}`;
  }};
  padding-right: ${({ $clearable, theme }) => ($clearable ? theme.spacing(10) : 'initial')};
  font-size: ${({ theme, $size }) => {
    if ($size === 'sm') return theme.typography.size.sm;
    if ($size === 'lg') return theme.typography.size.lg;
    return theme.typography.size.md;
  }};
  color: ${({ theme }) => theme.palette.text.primary};
  background: ${({ theme }) => theme.palette.background.surface};
  border: ${({ theme }) => theme.borderWidth.thin} solid ${({ theme }) => theme.palette.grey[300]};
  border-radius: ${({ theme }) => theme.radii.lg};
  transition: all ${({ theme }) => theme.motion.duration.fast};

  &::placeholder {
    color: ${({ theme }) => theme.palette.text.muted};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.palette.primary.main};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.palette.primary.main}1A;
  }

  &:disabled {
    background: ${({ theme }) => theme.palette.grey[100]};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

// Search icon
export const SearchIcon = styled.span`
  position: absolute;
  left: ${({ theme, $size }) => {
    if ($size === 'sm') return theme.spacing(3);
    if ($size === 'lg') return theme.spacing(4);
    return theme.spacing(3);
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.palette.text.muted};
  font-size: ${({ $size }) => {
    if ($size === 'sm') return '16px';
    if ($size === 'lg') return '24px';
    return '20px';
  }};
  pointer-events: none;
`;

// Clear button
export const SearchClearButton = styled.button`
  position: absolute;
  right: ${({ theme }) => theme.spacing(2)};
  display: ${({ $visible }) => ($visible ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.spacing(6)};
  height: ${({ theme }) => theme.spacing(6)};
  padding: 0;
  color: ${({ theme }) => theme.palette.text.muted};
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.motion.duration.fast};

  &:hover {
    color: ${({ theme }) => theme.palette.text.primary};
    background: ${({ theme }) => theme.palette.grey[100]};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.palette.primary.main};
    outline-offset: 1px;
  }
`;

// Search results count
export const SearchResultsCount = styled.span`
  position: absolute;
  right: ${({ theme, $clearable }) => ($clearable ? theme.spacing(9) : theme.spacing(3))};
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: ${({ theme }) => theme.palette.text.muted};
  pointer-events: none;
`;

// Compose SearchInput with sub-components
SearchInput.Wrapper = SearchInputWrapper;
SearchInput.Icon = SearchIcon;
SearchInput.Clear = SearchClearButton;
SearchInput.ResultsCount = SearchResultsCount;

export default SearchInput;