import { Container, MainContainer } from './Page_AdminAddPosts.styles';
import AddPosts from 'features/posts/components/AddPosts/AddPosts';

const Page_AdminAddPosts = () => {
  return (
    <Container>
      <MainContainer>
        <AddPosts isEditing={false} />
      </MainContainer>
    </Container>
  );
};

export default Page_AdminAddPosts;
