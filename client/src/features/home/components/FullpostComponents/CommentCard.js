import {
  Container,
  Comment,
  ReplyComment,
  CommentHeader,
  Extendericon,
  Paragraph,
  ProfileNameContainer,
  Username,
  RepliedToUseContainer,
  RepliedToUsername,
  TimeStamp,
  Imagecont,
  Image,
  ButtonsContainer,
  RepliesCount,
  CommentReplyForm,
  CommentReplyHolder,
  Textarea,
  Status,
  UserBadge,
  ReplyIcon,
  ActionButton,
  CommentActions,
  CommentVoting,
  VoteButton,
  VoteCount,
  RepliesContainer,
  RepliesHeader,
  AvatarStatus,
  CancelButton,
  ReplyToggleButton,
  EditMenu,
  MenuButton,
  MenuDropdown,
  MenuOption,
  CharLimit,
  CommentMeta,
  EmojiSelector,
  EmojiButton,
  ReactionBar,
} from './CommentCard.styles';
import defaultProfile from '../../../../resources/images/default_Images/defaultProfileImage.jpg';
import MultiUseBtn from '@/shared/components/Button/MultiUseButton';
import { BsFillReplyFill, BsThreeDots } from 'react-icons/bs';
import {
  FaRegSmile,
  FaHeart,
  FaRegLaugh,
  FaRegSadTear,
  FaRegThumbsUp,
  FaRegThumbsDown,
} from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { postUserReplyComments } from '../../../../shared/services/commentApi';
import { formatDistanceToNow } from 'date-fns';

const CommentCard = ({
  comment,
  postUserId,
  parentUsername,
  onReplyVisibilityChange,
  isExpanded,
  nestingLevel = 0,
}) => {
  const { isAuthenticated } = useAuth();
  const user = JSON.parse(localStorage.getItem('userData'));

  const [showReplies, setShowReplies] = useState(isExpanded || false);
  const [openReplyFormId, setOpenReplyFormId] = useState(null);
  const [data, setData] = useState({
    userId: user && user.user && user.user.id,
    repliedCommentId: '',
    message: '',
  });

  const [isExtended, setIsExtended] = useState(true);
  const [isContentLong, setIsContentLong] = useState(false);
  const [voteCount, setVoteCount] = useState(comment.votes || 0);
  const [userVote, setUserVote] = useState(null);
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const paragraphRef = useRef(null);
  const menuRef = useRef(null);

  const isAuthorComment = postUserId === comment.user._id;
  const isCurrentLoggedUserComment = user?.user?.id === comment.user._id;

  // Max nesting level before showing "View replies" button
  const MAX_NESTING_LEVEL = 3;

  useEffect(() => {
    if (paragraphRef.current) {
      const lineHeight = parseFloat(getComputedStyle(paragraphRef.current).lineHeight);
      const height = paragraphRef.current.offsetHeight;
      setIsContentLong(height / lineHeight > 3);
    }

    // Close menu when clicking outside
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowEditMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [comment.message]);

  // Notify parent component when replies visibility changes
  useEffect(() => {
    if (onReplyVisibilityChange) {
      onReplyVisibilityChange(showReplies);
    }
  }, [showReplies, onReplyVisibilityChange]);

  // Set initial showReplies based on prop
  useEffect(() => {
    if (isExpanded !== undefined && isExpanded !== showReplies) {
      setShowReplies(isExpanded);
    }
  }, [isExpanded]);

  const handleReplyClick = (id) => {
    setOpenReplyFormId(openReplyFormId === id ? null : id);
  };

  const handleShowReplies = (id) => {
    setShowReplies(!showReplies);
  };

  const handleReplyComment = (event, id) => {
    const input = event.target.value;
    // Limit input to 1000 characters
    if (input.length <= 1000) {
      setData({ ...data, repliedCommentId: id, message: input });
    }
  };

  const handleCommentExtend = () => {
    setIsExtended(!isExtended);
  };

  const handleVote = (direction) => {
    if (!isAuthenticated) return;

    if (userVote === direction) {
      // Undo vote
      setVoteCount(voteCount + (direction === 'up' ? -1 : 1));
      setUserVote(null);
    } else {
      // Apply new vote (and remove previous vote if any)
      let change = direction === 'up' ? 1 : -1;
      if (userVote) {
        // If changing vote direction, need to adjust by 2
        change = direction === 'up' ? 2 : -2;
      }
      setVoteCount(voteCount + change);
      setUserVote(direction);
    }

    // Here you would call your API to save the vote
  };

  const handleAddReaction = (emoji) => {
    // Add reaction logic here
    console.log(`Added ${emoji} reaction`);
    setShowEmojiSelector(false);
  };

  const submitReplyComments = async () => {
    if (isAuthenticated) {
      if (!data.message) {
        alert('Please enter a reply');
        return;
      }

      try {
        setOpenReplyFormId(null); // Close the form
        const response = await postUserReplyComments(data);
        setData({ ...data, message: '' });
        // You would typically update the UI to show the new reply here
        // This might involve re-fetching comments or updating state locally
      } catch (error) {
        console.error('Error posting reply:', error);
      }
    } else {
      alert('Please login to reply to comments');
    }
  };

  const formattedDate = formatDistanceToNow(new Date(comment.date), { addSuffix: true });

  // Calculate remaining character count
  const remainingChars = 1000 - (data.message?.length || 0);
  const isNearLimit = remainingChars < 100;

  return (
    <Container nestingLevel={nestingLevel}>
      <Comment>
        <Imagecont>
          <Image src={comment.user.profileImage || defaultProfile} alt="Profile" />
          {isAuthorComment && <AvatarStatus>Author</AvatarStatus>}
        </Imagecont>

        <CommentHeader>
          <CommentMeta>
            <ProfileNameContainer>
              <Username isAuthorComment={isAuthorComment}>
                {comment.user.username}
                {isAuthorComment && <UserBadge isAuthor>Author</UserBadge>}
                {isCurrentLoggedUserComment && <UserBadge>You</UserBadge>}
              </Username>
              <RepliedToUseContainer>
                {parentUsername && (
                  <RepliedToUsername>
                    replied to <span>@{parentUsername}</span>
                  </RepliedToUsername>
                )}
              </RepliedToUseContainer>
            </ProfileNameContainer>

            <Status>
              <TimeStamp>{formattedDate}</TimeStamp>
              <RepliesCount visible={comment.replyCount > 0}>
                {`${comment.replyCount} ${comment.replyCount === 1 ? 'reply' : 'replies'}`}
              </RepliesCount>
            </Status>
          </CommentMeta>

          <Paragraph
            ref={paragraphRef}
            onClick={handleCommentExtend}
            isExtended={isExtended}
            isExpandable={isContentLong}
          >
            {comment.message}
            {isContentLong && <Extendericon isExtended={isExtended} />}
          </Paragraph>

          <CommentActions>
            <CommentVoting>
              <VoteButton
                onClick={() => handleVote('up')}
                active={userVote === 'up'}
                direction="up"
              >
                <FaRegThumbsUp />
              </VoteButton>
              <VoteCount positive={voteCount > 0} negative={voteCount < 0}>
                {Math.abs(voteCount)}
              </VoteCount>
              <VoteButton
                onClick={() => handleVote('down')}
                active={userVote === 'down'}
                direction="down"
              >
                <FaRegThumbsDown />
              </VoteButton>
            </CommentVoting>

            <ButtonsContainer>
              {!isCurrentLoggedUserComment && (
                <ActionButton
                  onClick={() => handleReplyClick(comment._id)}
                  active={openReplyFormId === comment._id}
                >
                  <ReplyIcon />
                  <span>{openReplyFormId === comment._id ? 'Cancel' : 'Reply'}</span>
                </ActionButton>
              )}

              <ActionButton onClick={() => setShowEmojiSelector(!showEmojiSelector)}>
                <FaRegSmile />
                <span>React</span>
              </ActionButton>

              {showEmojiSelector && (
                <EmojiSelector>
                  <EmojiButton onClick={() => handleAddReaction('like')}>
                    <FaRegThumbsUp />
                  </EmojiButton>
                  <EmojiButton onClick={() => handleAddReaction('love')}>
                    <FaHeart />
                  </EmojiButton>
                  <EmojiButton onClick={() => handleAddReaction('laugh')}>
                    <FaRegLaugh />
                  </EmojiButton>
                  <EmojiButton onClick={() => handleAddReaction('sad')}>
                    <FaRegSadTear />
                  </EmojiButton>
                </EmojiSelector>
              )}

              {comment.replyCount > 0 && (
                <ReplyToggleButton
                  onClick={() => handleShowReplies(comment._id)}
                  active={showReplies}
                >
                  {showReplies ? 'Hide Replies' : 'Show Replies'}
                </ReplyToggleButton>
              )}

              {isCurrentLoggedUserComment && (
                <div ref={menuRef} style={{ position: 'relative' }}>
                  <MenuButton onClick={() => setShowEditMenu(!showEditMenu)}>
                    <BsThreeDots />
                  </MenuButton>

                  {showEditMenu && (
                    <MenuDropdown>
                      <MenuOption>Edit Comment</MenuOption>
                      <MenuOption isDelete>Delete Comment</MenuOption>
                    </MenuDropdown>
                  )}
                </div>
              )}
            </ButtonsContainer>
          </CommentActions>

          {/* Add a sample reaction bar for demonstration */}
          <ReactionBar visible={true}>
            <EmojiButton small count="3">
              <FaRegThumbsUp />
            </EmojiButton>
            <EmojiButton small count="1">
              <FaHeart />
            </EmojiButton>
          </ReactionBar>
        </CommentHeader>
      </Comment>

      <CommentReplyForm visible={openReplyFormId === comment._id}>
        {openReplyFormId === comment._id && (
          <CommentReplyHolder>
            <Textarea
              onChange={(e) => {
                handleReplyComment(e, comment._id);
              }}
              placeholder={`@${comment.user.username}`}
              value={data.message}
            />
            <CharLimit isNearLimit={isNearLimit}>{remainingChars} characters left</CharLimit>
            <div className="button-group">
              <CancelButton onClick={() => setOpenReplyFormId(null)}>Cancel</CancelButton>
              <MultiUseBtn
                size="sm"
                color="#334155"
                btnText={`Reply to ${comment.user.username}`}
                onClick={submitReplyComments}
                disabled={!data.message.trim()}
              />
            </div>
          </CommentReplyHolder>
        )}
      </CommentReplyForm>

      {showReplies && comment.replies && comment.replies.length > 0 && (
        <ReplyComment>
          {nestingLevel < MAX_NESTING_LEVEL ? (
            // If not at max nesting level, show replies normally
            comment.replies.map((reply) => (
              <CommentCard
                key={reply._id}
                comment={reply}
                postUserId={postUserId}
                parentUsername={comment.user.username}
                nestingLevel={nestingLevel + 1}
              />
            ))
          ) : (
            // If at max nesting, show a link to view the thread
            <RepliesContainer>
              <RepliesHeader>
                <span>Conversation continued ({comment.replies.length} more replies)</span>
                <a href={`/comment/${comment._id}`}>View full thread</a>
              </RepliesHeader>
            </RepliesContainer>
          )}
        </ReplyComment>
      )}
    </Container>
  );
};

export default CommentCard;
