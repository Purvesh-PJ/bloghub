import { ParentWrapper } from './Page_EditBlogPost.styles';
import AddPost from 'features/posts/components/AddPosts/AddPosts';

const Page_EditBlogPost = ({ blogs }) => {
  return (
    <>
      <ParentWrapper>
        <AddPost isEditing={true} blogs={blogs} />
      </ParentWrapper>
    </>
  );
};

export default Page_EditBlogPost;
