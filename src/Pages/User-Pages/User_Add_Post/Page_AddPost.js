import { Container } from './Page_AddPost-Style';
import { MainContainer } from '../../Admin-Pages/Admin_Add_Posts/Page_AdminAddPosts-Style';
import AddPosts from '../../../Components/Global-Components/AddPosts';

const Page_AddPost = () => {

    return (
        <Container>
            <MainContainer>
                <AddPosts isEditing={false} />
            </MainContainer> 
        </Container>
    )
};

export default Page_AddPost;