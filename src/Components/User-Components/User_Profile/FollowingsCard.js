import { Container, CardTitle, Small } from './FollowersCard-Style';
import { useAuth } from '../../../context/AuthContext';


const FollowingsCard = () => {

    const { user } = useAuth();

    return (
        <Container>
            <CardTitle>Following</CardTitle>
            <Small>{user?.profile?.followingsCount} following</Small>
        </Container>
    )
};

export default FollowingsCard;