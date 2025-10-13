import {
  ParentContainer,
  EditorWrapper,
  PostButtonWrapper,
  SendMessageIcon,
  CommentEditor,
  CommentHeader,
  LoginPrompt,
  CharacterCount,
  AnimatedButton,
} from './PostComment.styles';
import { postUserComments } from '../../../../shared/services/commentApi';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { FiAlertCircle } from 'react-icons/fi';
import { Alert } from '../../../../components/ui/primitives';
import { BiErrorCircle } from 'react-icons/bi';

const PostComment = () => {
  const { isAuthenticated } = useAuth();
  const [submit, setSubmit] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { _id } = useParams();
  const user = JSON.parse(localStorage.getItem('userData'));

  const maxLength = 1000;

  const data = {
    userId: user && user?.user?.id,
    postId: _id,
    message,
  };

  const handlePostComment = (event) => {
    const text = event.target.value;
    if (text.length <= maxLength) {
      setMessage(text);
      setError('');
    } else {
      setError(`Your comment is too long. Maximum ${maxLength} characters allowed.`);
    }
  };

  const submitPostComment = async () => {
    if (!isAuthenticated) {
      setError('Please login to post a comment.');
      return;
    }

    if (!message.trim()) {
      setError('Please enter a comment.');
      return;
    }

    try {
      setSubmit(true);
      setError('');
      await postUserComments(data);
      setMessage('');
    } catch (error) {
      console.log(error);
      setError('Failed to post your comment. Please try again.');
    } finally {
      setSubmit(false);
    }
  };

  return (
    <ParentContainer>
      <CommentHeader>
        <h3>Post a Comment</h3>
        {!isAuthenticated && (
          <LoginPrompt>
            <FiAlertCircle />
            <span>Please login to post a comment</span>
          </LoginPrompt>
        )}
      </CommentHeader>

      <EditorWrapper>
        <CommentEditor
          value={message}
          onChange={handlePostComment}
          placeholder="What are your thoughts on this post?"
          disabled={!isAuthenticated}
        />

        {error && (
          <Alert $variant="error" style={{ marginTop: '0.5rem' }}>
            <Alert.Icon>
              <BiErrorCircle size={20} />
            </Alert.Icon>
            <Alert.Content>{error}</Alert.Content>
          </Alert>
        )}

        <CharacterCount $exceeds={message.length > maxLength * 0.9}>
          {message.length} / {maxLength}
        </CharacterCount>
      </EditorWrapper>

      <PostButtonWrapper>
        <AnimatedButton
          type="button"
          disabled={submit || !message.trim() || !isAuthenticated}
          $isLoading={submit}
          onClick={submitPostComment}
        >
          {!submit ? (
            <>
              Post Comment
              <SendMessageIcon />
            </>
          ) : (
            'Posting...'
          )}
        </AnimatedButton>
      </PostButtonWrapper>
    </ParentContainer>
  );
};

export default PostComment;
