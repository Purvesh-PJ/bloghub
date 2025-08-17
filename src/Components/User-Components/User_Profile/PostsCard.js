import { Container, CardTitle, Small } from './FollowersCard-Style';
import { useAuth } from '../../../context/AuthContext';

const PostsCard = () => {

    const { user } = useAuth();

    return (
        <Container>
            <CardTitle>Posts</CardTitle>
            <Small>{user?.profile?.postCount} posts</Small>
        </Container>
    )
};

export default PostsCard;