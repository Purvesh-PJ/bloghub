import styled from 'styled-components';

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: ${(p) => p.theme.spacing(4.5)};
  height: ${(p) => p.theme.spacing(4.5)};
  accent-color: ${(p) => p.theme.palette.primary.main};
`;

export const Radio = styled.input.attrs({ type: 'radio' })`
  width: ${(p) => p.theme.spacing(4.5)};
  height: ${(p) => p.theme.spacing(4.5)};
  accent-color: ${(p) => p.theme.palette.primary.main};
`;

export const Switch = styled.input.attrs({ type: 'checkbox' })`
  appearance: none;
  width: ${(p) => p.theme.spacing(11)};
  height: ${(p) => p.theme.spacing(6)};
  border-radius: 9999px;
  background: ${(p) => (p.checked ? p.theme.palette.primary.main : p.theme.palette.grey[300])};
  position: relative;
  transition: background 120ms ease;
  &:after {
    content: '';
    position: absolute;
    top: ${(p) => p.theme.spacing(0.75)};
    left: ${(p) => (p.checked ? p.theme.spacing(6) : p.theme.spacing(0.75))};
    width: ${(p) => p.theme.spacing(4.5)};
    height: ${(p) => p.theme.spacing(4.5)};
    border-radius: 50%;
    background: #fff;
    transition: left 120ms ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
`;
