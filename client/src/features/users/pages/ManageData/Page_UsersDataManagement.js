import { Container } from './Page_UsersDataManagement.styles';
import { MainContainer } from '../../../dashboard/pages/AddPosts/Page_AdminAddPosts.styles';
import { Outlet } from 'react-router-dom';

const Page_UsersDataManagement = () => {
  return (
    <Container>
      <MainContainer>
        <Outlet />
      </MainContainer>
    </Container>
  );
};

export default Page_UsersDataManagement;
