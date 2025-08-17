import { ParentWrapper } from './Page_EditBlogPost-Style';
import AddPost from '../../../Components/Global-Components/AddPosts';

const Page_EditBlogPost = ({blogs}) => {
    return (
        <>
            <ParentWrapper>
                <AddPost isEditing = {true} blogs={blogs}/>
            </ParentWrapper>
        </>
    )
}

export default Page_EditBlogPost;