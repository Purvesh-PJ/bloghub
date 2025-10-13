import { Container } from './DisplayPost.styles';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSinglePost } from '../../../../shared/services/postApi';
import parse from 'html-react-parser';
import { Alert, Skeleton, Card, Stack } from '../../../../components/ui/primitives';
import { BiErrorCircle } from 'react-icons/bi';

const DisplayPost = () => {
  const { _id } = useParams();
  const [singlePost, setSinglePost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getSinglePost(_id);
        setSinglePost(response.data.data);
      } catch (error) {
        if (error.response) {
          setError(`Server Error: ${error.response.status}`);
        } else if (error.request) {
          setError('Network Error: No response from server');
        } else {
          setError(`Client Error: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [_id]);

  return (
    <Container>
      {loading && (
        <Stack $gap={4}>
          <Skeleton.Text $lines={1} style={{ height: '2.5rem', width: '70%' }} />
          <Skeleton.Card />
          <Skeleton.Text $lines={8} />
        </Stack>
      )}

      {error && (
        <Alert $variant="error">
          <Alert.Icon>
            <BiErrorCircle size={24} />
          </Alert.Icon>
          <Alert.Content>
            <strong>Failed to load post</strong>
            <div>{error}</div>
          </Alert.Content>
        </Alert>
      )}

      {!loading && !error && singlePost && (
        <Card $p={8}>
          <Stack $gap={4}>
            <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '700', lineHeight: '1.2' }}>
              {singlePost.title}
            </h1>
            <div style={{ lineHeight: '1.8', fontSize: '1.05rem' }}>
              {parse(singlePost.content || '')}
            </div>
          </Stack>
        </Card>
      )}
    </Container>
  );
};

export default DisplayPost;
