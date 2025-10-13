import { useState, useEffect, useCallback } from 'react';
import { getSinglePost } from '../services/postApi.js';

const useFetchSinglePost = (postId, shouldFetchAutomatically = true) => {
  const [postUser, setPostUser] = useState(null);
  const [postData, setPostData] = useState(null);
  const [postCategories, setpostCategories] = useState([]);
  const [postComments, setPostComments] = useState(null);
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState(null);

  const fetchPost = useCallback(async () => {
    setPostLoading(true);
    try {
      const response = await getSinglePost(postId);
      setPostUser(response.data.data.user._id);
      setPostData(response.data.data);
      setpostCategories(response.data.data.categories.map((cat) => cat.name));
      setPostComments(response.data.data.comments);
      return response;
    } catch (error) {
      console.log(error);
      if (error.response) {
        switch (error.response.status) {
          case 404:
            setPostError('The post you are looking for does not exist.');
            break;
          case 500:
            setPostError('Server error occurred. Please try again later.');
            break;
          default:
            setPostError('An unexpected error occurred. Please try again.');
        }
      } else if (error.request) {
        setPostError('Unable to connect to the server. Please check your internet connection.');
      } else {
        setPostError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setPostLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (shouldFetchAutomatically) {
      fetchPost();
    }
  }, [fetchPost, shouldFetchAutomatically]);

  // console.log(postData);

  return {
    fetchPost,
    setPostData,
    postUser,
    postData,
    postCategories,
    postComments,
    postLoading,
    postError,
  };
};

export default useFetchSinglePost;
