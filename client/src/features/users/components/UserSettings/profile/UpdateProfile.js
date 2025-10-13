import { Form, FormContainer, Divider, FormHeading, UserImage } from './UpdateProfile.styles';
import { Alert, Skeleton, Stack } from '../../../../../components/ui/primitives';
import { BiErrorCircle } from 'react-icons/bi';
import { useEffect, useState } from 'react';
import MultiUseButton from '@/shared/components/Button/MultiUseButton';
import defaultProfile from '../../../../../resources/images/default_Images/defaultProfileImage.jpg';
import InputField from '@/shared/components/Input/InputField';
import useUserActions from '../../../../../shared/hooks/useUserActions';

const UpdateProfile = () => {
  const [data, setData] = useState({
    image: '',
    username: '',
    email: '',
    bio: '',
  });

  const { user, setUserWithProfile, getUserLoading, updateUserLoading, getUserError } =
    useUserActions(true);

  useEffect(() => {
    if (user) {
      setData({
        image: user.image || '',
        username: user.username || '',
        email: user.email || '',
        bio: user.profile.bio || '',
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    console.log(value);
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const updateUserProfile = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('image', data.image);
    formData.append('username', data.username);
    formData.append('email', data.email);
    formData.append('bio', data.bio);

    const Success = await setUserWithProfile(formData);

    if (Success) {
      alert('Profile updated succesfull');
    }
  };

  // console.log(user);
  // console.log(data);
  // console.log(imgto64);

  return (
    <Form onSubmit={updateUserProfile}>
      <FormHeading>Update profile</FormHeading>
      <Divider />
      {getUserError && (
        <Alert $variant="error">
          <Alert.Icon>
            <BiErrorCircle size={24} />
          </Alert.Icon>
          <Alert.Content>
            <strong>Error Loading Profile</strong>
            <div>{getUserError}</div>
          </Alert.Content>
        </Alert>
      )}
      {!getUserError && getUserLoading && (
        <Stack $gap={3}>
          <Skeleton.Text
            $lines={1}
            style={{ height: '100px', width: '100px', borderRadius: '50%' }}
          />
          <Skeleton.Text $lines={2} />
          <Skeleton.Card style={{ height: '60px' }} />
          <Skeleton.Card style={{ height: '60px' }} />
        </Stack>
      )}
      {!getUserLoading && !getUserError && (
        <FormContainer>
          <UserImage
            style={{ margin: '1%' }}
            src={data.image ? URL.createObjectURL(data.image) : defaultProfile}
          />

          <InputField
            name="image"
            label="image"
            type="file"
            placeholder="image"
            onChange={(e) => {
              handleInputChange('image', e.target.files[0]);
            }}
            accept="image/png, image/jpeg"
            // value={data.image.name}
            // multiple
            style={{ flex: '1 1 300px', margin: '1%' }}
          />

          <InputField
            name="userName"
            label="username"
            type="text"
            placeholder="username"
            onChange={(e) => {
              handleInputChange('username', e.target.value);
            }}
            value={data.username}
            direction="column"
            style={{ flex: '1 1 200px', margin: '1%' }}
          />

          <InputField
            name="email"
            label="email"
            type="text"
            placeholder="email"
            onChange={(e) => {
              handleInputChange('email', e.target.value);
            }}
            value={data.email}
            direction="row"
            style={{ flex: '1 1 300px', margin: '1%' }}
          />

          <InputField
            textArea
            name="bio"
            label="bio"
            type="text"
            placeholder="bio"
            onChange={(e) => {
              handleInputChange('bio', e.target.value);
            }}
            value={data.bio}
            textAreaResize="vertical"
            style={{ flex: '1 1 100%', margin: '1%' }}
          />

          <MultiUseButton
            type="submit"
            filled={true}
            fillColor="#2563eb"
            txtColor="white"
            btnText={updateUserLoading ? 'Submitting...' : 'Update Profile'}
            style={{ marginLeft: 'auto', marginRight: '1%' }}
          />
        </FormContainer>
      )}
    </Form>
  );
};

export default UpdateProfile;
