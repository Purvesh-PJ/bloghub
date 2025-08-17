import { Container, MainContainer } from './Page_AdminAddPosts-Style';
import AddPosts from '../../../Components/Global-Components/AddPosts';

const Page_AdminAddPosts = () => {
    
    return (
        <Container>
            <MainContainer>
                <AddPosts isEditing={false} />
            </MainContainer>
        </Container>
    )
};

export default Page_AdminAddPosts;