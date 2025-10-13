import styled from 'styled-components';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { AiFillSetting } from 'react-icons/ai';
import { BiLogOut } from 'react-icons/bi';
import { Paper, Avatar as UiAvatar } from '../../../../components/ui/primitives';

export const ParentContainer = styled(Paper)`
  width: 200px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background-color: ${({ theme }) => theme.palette.background.surface};
  position: relative;
  display: inline-block;
  padding: ${({ theme }) => theme.spacing(1.25)};
  z-index: 100;
  border: ${({ theme }) => theme.borderWidth.thin} solid ${({ theme }) => theme.palette.grey[200]};
`;

export const ChildContainerOne = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ChildContainerTwo = styled(Paper)`
  position: absolute;
  top: 48px;
  left: ${({ theme }) => theme.spacing(2.5)};
  right: ${({ theme }) => theme.spacing(2.5)};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  display: ${(props) => (props.isClicked ? 'block' : 'none')};
  z-index: 100;
`;

export const ListWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing(0.75)};
  background-color: ${({ theme }) => theme.palette.background.surface};
  border-radius: ${({ theme }) => theme.radii.md};
  z-index: 100;
`;

export const ProfileImage = styled(UiAvatar)`
  width: 30px;
  height: 30px;
  border: ${({ theme }) => theme.borderWidth.thin} solid ${({ theme }) => theme.palette.grey[200]};
  border-radius: ${({ theme }) => theme.radii.full};
  background-color: ${({ theme }) => theme.palette.grey[50]};
  object-fit: cover;
`;

export const ProfileName = styled.p`
  font-size: ${({ theme }) => theme.typography.size.sm};
  margin: 0;
  padding: 0;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

export const ArrowDropIcon = styled(RiArrowDropDownLine)`
  font-size: 25px;
  color: ${({ theme }) => theme.palette.grey[600]};
`;

export const List = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

export const ListItem = styled.li`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing(5)};
  align-items: center;
  border-radius: ${({ theme }) => theme.radii.md};
  padding-left: ${({ theme }) => theme.spacing(5)};
  padding-top: ${({ theme }) => theme.spacing(2)};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.motion.duration.fast};

  &:hover {
    background-color: ${({ theme }) => theme.palette.grey[100]};
  }
`;

export const SettingsIcon = styled(AiFillSetting)`
  color: ${({ theme }) => theme.palette.text.secondary};
`;

export const LogoutIcon = styled(BiLogOut)`
  color: ${({ theme }) => theme.palette.text.secondary};
`;

export const ListTypo = styled.p`
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.sm};
  user-select: none;
  margin: 0;
`;

export const DropOptionsButton = styled.button`
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.palette.grey[100]};
  border: none;
  border-radius: ${({ theme }) => theme.radii.pill};
  color: ${({ theme }) => theme.palette.text.primary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.motion.duration.fast};

  &:hover {
    background-color: ${({ theme }) => theme.palette.primary.light};

    ${ArrowDropIcon} {
      color: ${({ theme }) => theme.palette.primary.main};
    }
  }
`;

export const Divider = styled.hr`
  border-top: ${({ theme }) => theme.borderWidth.thin} solid
    ${({ theme }) => theme.palette.grey[200]};
  margin-left: ${({ theme }) => theme.spacing(4)};
  margin-right: ${({ theme }) => theme.spacing(4)};
  margin-top: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;
