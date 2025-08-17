import { Container } from './Page_UsersDataManagement-Style';
import { MainContainer} from '../../Admin-Pages/Admin_Add_Posts/Page_AdminAddPosts-Style';
import { Outlet } from 'react-router-dom';


const Page_UsersDataManagement = () => {

  return (
    <Container> 
      <MainContainer>
        <Outlet/>
      </MainContainer> 
    </Container>
  )
};

export default Page_UsersDataManagement;