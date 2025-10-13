import {
  Container,
  ProfileImage,
  DropdownMenu,
  DropdownItem,
  ListLabel,
  ListIcons,
} from './UserSignedIn.styles';
import { useNavigate } from 'react-router-dom';
import defaultProfileImage from '../../resources/images/default_Images/defaultProfileImage.jpg';
import UserSignedDropdownData from '../../../data/UserSignedDropdownData';

const UserSignedIn = ({ isOpen, toggle }) => {
  const navigate = useNavigate();

  return (
    <Container>
      <ProfileImage src={defaultProfileImage} onClick={toggle} isOpen={isOpen} />
      {isOpen && (
        <DropdownMenu>
          {UserSignedDropdownData &&
            UserSignedDropdownData?.map((listItem, index) => (
              <DropdownItem key={index} onClick={() => navigate(listItem.location)}>
                <>
                  <ListIcons>{listItem.icon}</ListIcons>
                  <ListLabel>{listItem.label}</ListLabel>
                </>
              </DropdownItem>
            ))}
        </DropdownMenu>
      )}
    </Container>
  );
};

export default UserSignedIn;
