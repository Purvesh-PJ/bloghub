import styled from 'styled-components';
import { Paper as UiPaper } from '../../../ui/primitives';

export const Container = styled.div`
  position: relative;
  // display: inline-block;
  // border : 1px solid gray;
`;

export const ProfileImage = styled.img`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  cursor: pointer;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  margin-left: auto;
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;

  ${(props) => props.isOpen && `box-shadow: ${props.theme.palette.primary.light} 0px 0px 0px 3px;`}

  &:hover {
    box-shadow: ${({ theme }) => theme.palette.primary.light} 0px 0px 0px 3px;
  }
`;

export const DropdownMenu = styled(UiPaper)`
  position: absolute;
  right: 0;
  top: 50px;
  background-color: ${({ theme }) => theme.palette.background.surface};
  border: ${({ theme }) => theme.borderWidth.thin} solid ${({ theme }) => theme.palette.divider};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  z-index: 1000;
  // border : 1px solid gray;
  border-radius: ${({ theme }) => theme.radii.lg};
  color: ${({ theme }) => theme.palette.text.primary};
  padding: ${({ theme }) => theme.spacing(2)};
`;

export const DropdownItem = styled.div`
  padding: ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(4)}`};
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  // border : 1px solid gray;
  font-size: ${({ theme }) => theme.typography.size.sm};
  transition: background-color 0.2s ease;
  &:hover {
    background-color: ${({ theme }) => theme.palette.background.subtle};
    border-radius: ${({ theme }) => theme.radii.md};
  }
  & > svg {
    margin-right: 8px;
  }
`;

export const ListLabel = styled.div`
  display: flex;
  // justify-content : center;
  // align-items : center;
  // border : 1px solid gray;
  height: 100%;
  // width : 100%;
`;

export const ListIcons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  // border : 1px solid gray;
  height: 100%;
`;
