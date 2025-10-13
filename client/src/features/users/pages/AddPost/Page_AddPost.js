import { Container } from './Page_AddPost.styles';
import { MainContainer } from '../../../dashboard/pages/AddPosts/Page_AdminAddPosts.styles';
import AddPosts from 'features/posts/components/AddPosts/AddPosts';

const Page_AddPost = () => {
  return (
    <Container>
      <MainContainer>
        <AddPosts isEditing={false} />
      </MainContainer>
    </Container>
  );
};

export default Page_AddPost;
