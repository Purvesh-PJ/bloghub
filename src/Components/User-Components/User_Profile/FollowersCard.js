import { Container, CardTitle, Small } from './FollowersCard-Style';
import { useAuth } from '../../../context/AuthContext';


const FollowersCard = () => {

    const { user } = useAuth();

    return (
        <Container>
            <CardTitle>Followers</CardTitle>
            <Small>{user?.profile?.followersCount} followers</Small>
        </Container>
    )
};

export default FollowersCard;