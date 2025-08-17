import { 
  Container, 
  Article, 
  Content, 
  ArticleBody, 
  TitleAndTopicWrapper, 
  Header, 
  CoverImage, 
  PostImage, 
  Title, 
  ButtonShare, 
  IconShare,
  PostFooter,
  LikeButton,
  LikeIcon,
  ViewWrapper,
  ViewIcon,
  Divider,
  TagsContainer,
  Tag,
  ShareOptions,
  SocialButton,
  PostMeta,
  MetaItem,
  MetaDot,
  FontSizeControls,
  FontButton,
  TextOptionsWrapper,
  PrintButton,
  FloatingShareContainer
} from './Post-Style';
import ReactHtmlParser, { convertNodeToElement } from 'react-html-parser';
import PostAuthor from '../Home_Fullpost_Components/PostAuthor';
import { useState, useEffect } from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaLink, FaRegClock, FaCalendarAlt, FaPrint, FaShareAlt } from 'react-icons/fa';
import { BiMinus, BiPlus } from 'react-icons/bi';
import { formatDistanceToNow } from 'date-fns';

// Add this function before your Post component
const sanitizeContent = (content) => {
    if (!content) return '';
    
    // Replace multiple consecutive <br> tags with a single one
    content = content.replace(/(<br\s*\/?>){2,}/gi, '<br/>');
    
    // Replace non-breaking spaces that might cause extra spacing
    content = content.replace(/&nbsp;&nbsp;/g, ' ');
    
    // Handle div with only <br> inside (common in some WYSIWYG editors)
    content = content.replace(/<div><br><\/div>/g, '<div class="spacer-small"></div>');
    
    return content;
};

export const Post = ({ blogs }) => {
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(blogs?.likes || 0);
    const [fontSize, setFontSize] = useState(18); // Base font size in pixels
    const [showFloatingShare, setShowFloatingShare] = useState(false);
    
    // Calculate estimated reading time
    const getReadingTime = (content) => {
        if (!content) return '0 min read';
        
        // Strip HTML tags
        const text = content.replace(/<[^>]*>/g, '');
        
        // Calculate words (rough approximation)
        const words = text.trim().split(/\s+/).length;
        
        // Average reading speed: 200-250 words per minute
        const readingTimeMinutes = Math.ceil(words / 225);
        
        return `${readingTimeMinutes} min read`;
    };
    
    const readingTime = getReadingTime(blogs?.content);
    
    // Format publication date
    const formattedDate = blogs?.createdAt 
        ? formatDistanceToNow(new Date(blogs.createdAt), { addSuffix: true })
        : 'Recently';
    
    useEffect(() => {
        const handleScroll = () => {
            // Show floating share button when scrolled down
            if (window.scrollY > 500) {
                setShowFloatingShare(true);
            } else {
                setShowFloatingShare(false);
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    const handleLike = () => {
        if (!liked) {
            setLikeCount(prev => prev + 1);
        } else {
            setLikeCount(prev => prev - 1);
        }
        setLiked(!liked);
        // Here you would also send the like/unlike to your backend
    };

    const handleShare = () => {
        setShowShareOptions(!showShareOptions);
    };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
        setShowShareOptions(false);
    };
    
    const increaseFontSize = () => {
        if (fontSize < 24) {
            setFontSize(prev => prev + 1);
        }
    };
    
    const decreaseFontSize = () => {
        if (fontSize > 14) {
            setFontSize(prev => prev - 1);
        }
    };
    
    const handlePrint = () => {
        window.print();
    };

    // Mock tags - in a real app these would come from the blog data
    const tags = blogs?.tags || ['Technology', 'Programming', 'Web Development'];

    // Custom transform function for ReactHtmlParser
    const transformContent = (node, index) => {
        // If it's an empty paragraph with non-breaking spaces or just whitespace
        if (node.type === 'tag' && node.name === 'p') {
            // Check if it only contains whitespace or &nbsp;
            const hasOnlyWhitespace = node.children?.every(child => 
                (child.type === 'text' && child.data.trim() === '') || 
                (child.type === 'tag' && child.name === 'br')
            );
            
            if (hasOnlyWhitespace) {
                return <p key={index} className="spacer-paragraph"></p>;
            }
        }
        
        // Return null to use the default transform
        return undefined;
    };
    
    // Get sanitized content
    const sanitizedContent = sanitizeContent(blogs?.content);
    
    return (
        <Container>
            <Article>
                <ArticleBody>
                    <Header>
                        <TitleAndTopicWrapper>
                            <Title> 
                                {ReactHtmlParser(blogs?.title)} 
                            </Title>
                            <PostMeta>
                                <MetaItem>
                                    <FaCalendarAlt />
                                    <span>{formattedDate}</span>
                                </MetaItem>
                                <MetaDot />
                                <MetaItem>
                                    <FaRegClock />
                                    <span>{readingTime}</span>
                                </MetaItem>
                            </PostMeta>
                            <PostAuthor authorId={blogs?.user?._id} authorName={blogs?.user?.username} />
                        </TitleAndTopicWrapper>

                        <ButtonShare onClick={handleShare}>
                            <IconShare />
                        </ButtonShare>

                        {showShareOptions && (
                            <ShareOptions>
                                <SocialButton color="#3b5998">
                                    <FaFacebook />
                                </SocialButton>
                                <SocialButton color="#1da1f2">
                                    <FaTwitter />
                                </SocialButton>
                                <SocialButton color="#0077b5">
                                    <FaLinkedin />
                                </SocialButton>
                                <SocialButton color="#6b7280" onClick={copyLink}>
                                    <FaLink />
                                </SocialButton>
                            </ShareOptions>
                        )}
                    </Header>

                    <CoverImage>
                        <PostImage 
                            src={blogs?.imageURL} 
                            alt={blogs?.title || 'Post image'} 
                        />
                    </CoverImage>
                    
                    <TextOptionsWrapper>
                        <FontSizeControls>
                            <FontButton onClick={decreaseFontSize} disabled={fontSize <= 14}>
                                <BiMinus />
                            </FontButton>
                            <span>Text Size</span>
                            <FontButton onClick={increaseFontSize} disabled={fontSize >= 24}>
                                <BiPlus />
                            </FontButton>
                        </FontSizeControls>
                        
                        <PrintButton onClick={handlePrint}>
                            <FaPrint />
                            <span>Print</span>
                        </PrintButton>
                    </TextOptionsWrapper>

                    <Content className="Content" style={{ fontSize: `${fontSize}px` }}>
                        {ReactHtmlParser(sanitizedContent, { transform: transformContent })}
                    </Content>

                    <TagsContainer>
                        {tags.map(tag => (
                            <Tag key={tag}>{tag}</Tag>
                        ))}
                    </TagsContainer>
                
                    <Divider />
                
                    <PostFooter>
                        <LikeButton onClick={handleLike} liked={liked}>
                            <LikeIcon />
                            <span>{likeCount} likes</span>
                        </LikeButton>
                        
                        <ViewWrapper>
                            <ViewIcon />
                            <span>{blogs?.views || 0} views</span>
                        </ViewWrapper>
                    </PostFooter>
                </ArticleBody>
            </Article>
            
            {showFloatingShare && (
                <FloatingShareContainer onClick={handleShare}>
                    <FaShareAlt />
                </FloatingShareContainer>
            )}
        </Container>
    );
};
