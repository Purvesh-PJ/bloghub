import { 
    CommentsContainer, 
    CommentsHeader, 
    CommentsCount, 
    CommentsList,
    NoCommentsMessage,
    CommentSorter,
    SortLabel,
    SortSelect,
    CommentPagination,
    PageButton,
    FilterContainer,
    FilterButton,
    SearchContainer,
    SearchInput,
    SearchIcon,
    ControlsWrapper,
    LoadMoreButton,
    CommentHeaderTabs,
    CommentTab,
    LoadingSpinner
} from './DisplayComments-Style';
import CommentCard from "./CommentCard";
import { useState, useEffect } from 'react';
import { FaRegComment, FaSearch, FaFilter, FaStar, FaSpinner } from 'react-icons/fa';
import { useAuth } from "../../../context/AuthContext";

const DisplayComments = ({ comments, postUserId }) => {
    const { isAuthenticated, user } = useAuth();
    const [sortOrder, setSortOrder] = useState('newest');
    const [activeFilter, setActiveFilter] = useState('all');
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
            filteredComments = filteredComments.filter(comment => 
                comment.user._id === postUserId
            );
        } else if (activeTab === 'mine' && currentUserId) {
            filteredComments = filteredComments.filter(comment => 
                comment.user._id === currentUserId
            );
        }
        
        // Apply text search
        if (searchTerm.trim()) {
            filteredComments = filteredComments.filter(comment =>
                comment.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                comment.user.username.toLowerCase().includes(searchTerm.toLowerCase())
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
    }, [comments, sortOrder, searchTerm, currentPage, commentsPerPage, activeTab, postUserId, currentUserId]);
    
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
        setCurrentPage(prev => prev + 1);
    };
    
    const handleReplyVisibility = (commentId, isVisible) => {
        setExpandedReplies(prev => ({
            ...prev,
            [commentId]: isVisible
        }));
    };
    
    // Calculate total pages
    const totalComments = comments?.length || 0;
    const hasMoreComments = currentPage * commentsPerPage < totalComments;
    
    // Calculate tabs data
    const authorComments = comments?.filter(comment => comment.user._id === postUserId)?.length || 0;
    const myComments = currentUserId ? (comments?.filter(comment => comment.user._id === currentUserId)?.length || 0) : 0;

    return ( 
        <CommentsContainer>
            <CommentsHeader>
                <CommentsCount>
                    <FaRegComment />
                    <span>{totalComments} Comments</span>
                </CommentsCount>
                
                <CommentHeaderTabs>
                    <CommentTab 
                        active={activeTab === 'all'} 
                        onClick={() => handleTabChange('all')}
                    >
                        All ({totalComments})
                    </CommentTab>
                    <CommentTab 
                        active={activeTab === 'author'} 
                        onClick={() => handleTabChange('author')}
                    >
                        Author ({authorComments})
                    </CommentTab>
                    {isAuthenticated && (
                        <CommentTab 
                            active={activeTab === 'mine'} 
                            onClick={() => handleTabChange('mine')}
                        >
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
                    <LoadingSpinner>
                        <FaSpinner />
                        <span>Loading comments...</span>
                    </LoadingSpinner>
                ) : visibleComments.length > 0 ? (
                    <>
                        {visibleComments.map(comment => (
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
                            <LoadMoreButton onClick={handleLoadMore}>
                                Load More Comments
                            </LoadMoreButton>
                        )}
                    </>
                ) : (
                    <NoCommentsMessage>
                        {searchTerm ? (
                            <p>No comments match your search. Try different keywords.</p>
                        ) : activeTab !== 'all' ? (
                            <p>No {activeTab === 'author' ? 'author' : 'personal'} comments in this thread.</p>
                        ) : (
                            <p>No comments yet. Be the first to share your thoughts!</p>
                        )}
                    </NoCommentsMessage>
                )}
            </CommentsList>
        </CommentsContainer>
    );
};
 
export default DisplayComments;

