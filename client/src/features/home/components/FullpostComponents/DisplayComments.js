import {
  CommentsContainer,
  CommentsHeader,
  CommentsCount,
  CommentsList,
  CommentSorter,
  SortLabel,
  SortSelect,
  SearchContainer,
  SearchInput,
  SearchIcon,
  ControlsWrapper,
  LoadMoreButton,
  CommentHeaderTabs,
  CommentTab,
} from './DisplayComments.styles';
import CommentCard from './CommentCard';
import { useState, useEffect } from 'react';
import { FaRegComment } from 'react-icons/fa';
import { BiMessageSquareDetail } from 'react-icons/bi';
import { useAuth } from '../../../../context/AuthContext';
import { EmptyState, Skeleton, IconWrapper } from '../../../../components/ui/primitives';

const DisplayComments = ({ comments, postUserId }) => {
  const { isAuthenticated, user } = useAuth();
  const [sortOrder, setSortOrder] = useState('newest');
  // const [activeFilter, setActiveFilter] = useState('all'); // Removed - not used currently
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [commentsPerPage] = useState(5);
  const [visibleComments, setVisibleComments] = useState([]);
  const [expandedReplies, setExpandedReplies] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Get current user ID
  const currentUserId = user?.user?.id;

  // Process and filter comments
  useEffect(() => {
    if (!comments) return;

    setIsLoading(true);

    // Filter comments based on activeFilter and searchTerm
    let filteredComments = [...comments];

    // Apply active tab filter
    if (activeTab === 'author') {
      filteredComments = filteredComments.filter((comment) => comment.user._id === postUserId);
    } else if (activeTab === 'mine' && currentUserId) {
      filteredComments = filteredComments.filter((comment) => comment.user._id === currentUserId);
    }

    // Apply text search
    if (searchTerm.trim()) {
      filteredComments = filteredComments.filter(
        (comment) =>
          comment.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          comment.user.username.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Sort comments
    filteredComments.sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt);
      } else if (sortOrder === 'oldest') {
        return new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt);
      } else if (sortOrder === 'most-replies') {
        return (b.replyCount || 0) - (a.replyCount || 0);
      }
      return 0;
    });

    // Pagination or load more logic
    const indexOfLastComment = currentPage * commentsPerPage;
    const currentComments = filteredComments.slice(0, indexOfLastComment);

    setVisibleComments(currentComments);
    setTimeout(() => setIsLoading(false), 300); // Small delay for loading state
  }, [
    comments,
    sortOrder,
    searchTerm,
    currentPage,
    commentsPerPage,
    activeTab,
    postUserId,
    currentUserId,
  ]);

  // Handle various user interactions
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1); // Reset to first page on sort change
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page on tab change
  };

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handleReplyVisibility = (commentId, isVisible) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: isVisible,
    }));
  };

  // Calculate total pages
  const totalComments = comments?.length || 0;
  const hasMoreComments = currentPage * commentsPerPage < totalComments;

  // Calculate tabs data
  const authorComments =
    comments?.filter((comment) => comment.user._id === postUserId)?.length || 0;
  const myComments = currentUserId
    ? comments?.filter((comment) => comment.user._id === currentUserId)?.length || 0
    : 0;

  return (
    <CommentsContainer>
      <CommentsHeader>
        <CommentsCount>
          <IconWrapper $size="md">
            <FaRegComment />
          </IconWrapper>
          <span>{totalComments} Comments</span>
        </CommentsCount>

        <CommentHeaderTabs>
          <CommentTab active={activeTab === 'all'} onClick={() => handleTabChange('all')}>
            All ({totalComments})
          </CommentTab>
          <CommentTab active={activeTab === 'author'} onClick={() => handleTabChange('author')}>
            Author ({authorComments})
          </CommentTab>
          {isAuthenticated && (
            <CommentTab active={activeTab === 'mine'} onClick={() => handleTabChange('mine')}>
              My Comments ({myComments})
            </CommentTab>
          )}
        </CommentHeaderTabs>

        <ControlsWrapper>
          <SearchContainer>
            <SearchIcon />
            <SearchInput
              placeholder="Search comments..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </SearchContainer>

          <CommentSorter>
            <SortLabel>Sort:</SortLabel>
            <SortSelect value={sortOrder} onChange={handleSortChange}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="most-replies">Most Replies</option>
            </SortSelect>
          </CommentSorter>
        </ControlsWrapper>
      </CommentsHeader>

      <CommentsList isLoading={isLoading}>
        {isLoading ? (
          <div style={{ padding: '2rem 0' }}>
            <Skeleton.Card />
            <Skeleton.Card style={{ marginTop: '1rem' }} />
            <Skeleton.Card style={{ marginTop: '1rem' }} />
          </div>
        ) : visibleComments.length > 0 ? (
          <>
            {visibleComments.map((comment) => (
              <CommentCard
                key={comment._id}
                comment={comment}
                postUserId={postUserId}
                parentUsername={comment.user.username}
                onReplyVisibilityChange={(isVisible) =>
                  handleReplyVisibility(comment._id, isVisible)
                }
                isExpanded={expandedReplies[comment._id]}
              />
            ))}

            {hasMoreComments && (
              <LoadMoreButton onClick={handleLoadMore}>Load More Comments</LoadMoreButton>
            )}
          </>
        ) : (
          <EmptyState>
            <EmptyState.Icon $size="64px">
              <BiMessageSquareDetail />
            </EmptyState.Icon>
            <EmptyState.Title>
              {searchTerm
                ? 'No matching comments'
                : activeTab !== 'all'
                  ? `No ${activeTab === 'author' ? 'author' : 'personal'} comments`
                  : 'No comments yet'}
            </EmptyState.Title>
            <EmptyState.Description>
              {searchTerm
                ? 'Try different keywords or clear your search'
                : activeTab !== 'all'
                  ? 'There are no comments from this user in this thread'
                  : 'Be the first to share your thoughts on this post!'}
            </EmptyState.Description>
          </EmptyState>
        )}
      </CommentsList>
    </CommentsContainer>
  );
};

export default DisplayComments;
