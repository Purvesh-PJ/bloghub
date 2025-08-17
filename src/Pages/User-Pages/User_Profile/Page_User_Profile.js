import { Container } from './Page_User_Profile-Style';
import { Outlet } from 'react-router-dom';
import { MainContainer  } from '../../Admin-Pages/Admin_Add_Posts/Page_AdminAddPosts-Style';


const Page_User_Profile = () => {


    return ( 
        <Container>
            <MainContainer>
                <Outlet/>
            </MainContainer>
        </Container>
    );
};
 
export default Page_User_Profile;   