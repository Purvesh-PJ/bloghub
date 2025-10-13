import { Container } from './Page_User_Profile.styles';
import { Outlet } from 'react-router-dom';
import { MainContainer } from '../../../dashboard/pages/AddPosts/Page_AdminAddPosts.styles';

const Page_User_Profile = () => {
  return (
    <Container>
      <MainContainer>
        <Outlet />
      </MainContainer>
    </Container>
  );
};

export default Page_User_Profile;
