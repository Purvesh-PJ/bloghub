import { Container, ProfileImage, Username } from './PostAuthor.styles';
import MultiUseButton from '@/shared/components/Button/MultiUseButton';
import defaultProfile from '../../../../resources/images/default_Images/defaultProfileImage.jpg';
import { follow, unfollow, isFollowing } from '../../../../shared/services/userApi';
import { useEffect, useState } from 'react';

const PostAuthor = (props) => {
  const { authorId, authorName } = props;
  const [isFollowed, setIsFollowing] = useState(false);

  useEffect(() => {
    const checkFollowingStatus = async () => {
      try {
        const response = await isFollowing(authorId);
        setIsFollowing(response.data.isFollowing);
        console.log(response);
      } catch (error) {
        // console.error('Error fetching follow status:', error);
        throw new Error('Error fetching follow status:', error);
      }
    };
    checkFollowingStatus();
  }, [authorId]);

  const handleFollowOrUnfollow = async () => {
    try {
      let response;

      if (isFollowed) {
        response = await unfollow(authorId);
      } else {
        response = await follow(authorId);
      }
      // console.log(response);

      if (response.data.success) {
        setIsFollowing(!isFollowed);
      }
    } catch (error) {
      // console.error('Error toggling follow status:', error);
      throw new Error(error);
    }
  };

  return (
    <Container>
      <ProfileImage src={defaultProfile} />
      <Username>{authorName}</Username>
      <MultiUseButton
        outlined
        btnText={isFollowed ? 'Unfollow' : 'Follow'}
        size="sm"
        onClick={handleFollowOrUnfollow}
      />
    </Container>
  );
};

export default PostAuthor;
