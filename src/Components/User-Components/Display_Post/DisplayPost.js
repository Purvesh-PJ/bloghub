import { Container, Article, Title, Content } from './DisplayPost-Style';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSinglePost } from '../../../services/postApi';
import parse from 'html-react-parser';

const DisplayPost = () => {

    const { _id } = useParams();
    const [singlePost, setSinglePost ] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        ;( async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getSinglePost(_id);
                setSinglePost(response.data.data);
            } 
            catch (error) {
                if(error.response){
                    setError(`Server Error: ${error.response.status}`);
                }
                else if (error.request) {
                    setError('Network Error: No response from server');
                }
                else {
                    setError(`Client Error: ${error.message}`);
                } 
            }
            finally {
                setLoading(false);
            }
        })();
    },[_id]);

    return ( 
        <Container>
            {
                loading && <div>Loading...</div>
            }
            {
                error && error
            }
            {
                !loading && !error && (
                    <Article>
                      <Title>{singlePost?.title}</Title>
                      <Content>{parse(singlePost?.content || '')}</Content>
                    </Article>
                )
            }
        </Container>
    );
}
 
export default DisplayPost;