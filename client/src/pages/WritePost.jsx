import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Image, Eye, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { postService } from '../services/postService';
import { categoryService } from '../services/categoryService';
import { RichTextEditor } from '../components/common/RichTextEditor';
import { Loading } from '../components/common/Loading';

const PageWrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
`;

const ContentLayout = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const MainEditor = styled.div`
  flex: 1;
`;

const Sidebar = styled.div`
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CardTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ToggleButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
  
  svg { width: 14px; height: 14px; }
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 8px;
  
  svg { width: 14px; height: 14px; }
`;

const SmallLabel = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 6px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  background: ${({ theme }) => theme.colors.inputBg};
  border: 1px solid ${({ theme }) => theme.colors.inputBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.inputPlaceholder};
  }
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.inputBorderFocus};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 32px 10px 12px;
  background: ${({ theme }) => theme.colors.inputBg};
  border: 1px solid ${({ theme }) => theme.colors.inputBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b6b6b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.inputBorderFocus};
  }
`;

const ImagePreview = styled.div`
  margin-top: 8px;
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  
  img {
    width: 100%;
    max-height: 120px;
    object-fit: cover;
  }
`;

const WordCount = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 8px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PrimaryButton = styled.button`
  width: 100%;
  padding: 10px 16px;
  background: ${({ theme }) => theme.colors.buttonPrimaryBg};
  color: ${({ theme }) => theme.colors.buttonPrimaryText};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.buttonPrimaryHover};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled.button`
  width: 100%;
  padding: 10px 16px;
  background: ${({ theme }) => theme.colors.buttonSecondaryBg};
  color: ${({ theme }) => theme.colors.buttonSecondaryText};
  border: 1px solid ${({ theme }) => theme.colors.buttonSecondaryBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.buttonSecondaryHover};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const GhostButton = styled.button`
  width: 100%;
  padding: 10px 16px;
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const SidebarTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const CategoriesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const CategoryBadge = styled.button`
  padding: 4px 10px;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  border-radius: ${({ theme }) => theme.radii.full};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  border: none;
  
  ${({ $selected, theme }) => $selected ? `
    background: ${theme.colors.badgeActiveBg};
    color: ${theme.colors.badgeActiveText};
  ` : `
    background: ${theme.colors.badgeBg};
    color: ${theme.colors.badgeText};
    
    &:hover {
      background: ${theme.colors.bgActive};
    }
  `}
`;

const InfoText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 4px;
`;

const PreviewContent = styled.div`
  h1, h2, h3 {
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  
  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    line-height: ${({ theme }) => theme.lineHeights.relaxed};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

const PreviewTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const PreviewImage = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  
  img {
    width: 100%;
    max-height: 250px;
    object-fit: cover;
  }
`;

const EditorWrapper = styled.div`
  .ql-container {
    min-height: 300px;
    font-size: ${({ theme }) => theme.fontSizes.md};
  }
  
  .ql-editor {
    min-height: 300px;
  }
  
  .ql-toolbar {
    border-radius: ${({ theme }) => theme.radii.md} ${({ theme }) => theme.radii.md} 0 0;
    border-color: ${({ theme }) => theme.colors.inputBorder};
    background: ${({ theme }) => theme.colors.bgSecondary};
  }
  
  .ql-container {
    border-radius: 0 0 ${({ theme }) => theme.radii.md} ${({ theme }) => theme.radii.md};
    border-color: ${({ theme }) => theme.colors.inputBorder};
  }
`;


export function WritePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [slug, setSlug] = useState('');
  const [visibility, setVisibility] = useState('draft');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [originalCategories, setOriginalCategories] = useState([]);
  const [imageURL, setImageURL] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
  });

  const { data: existingPost, isLoading: postLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postService.getPost(id),
    enabled: isEditing,
  });

  useEffect(() => {
    if (existingPost?.data) {
      const post = existingPost.data;
      setTitle(post.title || '');
      setContent(post.content || '');
      setSlug(post.slug || '');
      setVisibility(post.visibility || 'draft');
      setImageURL(post.imageURL || '');
      const catNames = post.categories?.map((c) => c.name) || [];
      setSelectedCategories(catNames);
      setOriginalCategories(catNames);
    }
  }, [existingPost]);

  const createMutation = useMutation({
    mutationFn: postService.createPost,
    onSuccess: async (data) => {
      if (selectedCategories.length > 0 && data.postId) {
        try {
          await categoryService.attachCategoriesToPost(selectedCategories, data.postId);
        } catch (err) {
          console.error('Failed to attach categories:', err);
        }
      }
      toast.success('Post created');
      navigate(data.postId ? `/post/${data.postId}` : '/my-posts');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create post');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => postService.updatePost(id, data),
    onSuccess: async () => {
      const addedCategories = selectedCategories.filter((c) => !originalCategories.includes(c));
      const removedCategories = originalCategories.filter((c) => !selectedCategories.includes(c));
      
      if (addedCategories.length > 0 || removedCategories.length > 0) {
        try {
          await categoryService.updatePostCategories(id, addedCategories, removedCategories);
        } catch (err) {
          console.error('Failed to update categories:', err);
        }
      }
      toast.success('Post updated');
      navigate(`/post/${id}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update post');
    },
  });

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!isEditing || !slug) {
      setSlug(generateSlug(newTitle));
    }
  };

  const toggleCategory = (catName) => {
    setSelectedCategories((prev) =>
      prev.includes(catName) ? prev.filter((name) => name !== catName) : [...prev, catName]
    );
  };

  const handleSubmit = (e, submitVisibility) => {
    if (e) e.preventDefault();

    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!content.trim() || content === '<p><br></p>') {
      toast.error('Content is required');
      return;
    }
    if (!slug.trim()) {
      toast.error('Slug is required');
      return;
    }

    const postData = {
      title: title.trim(),
      content: content,
      slug: slug.trim(),
      visibility: submitVisibility || visibility,
      imageURL: imageURL.trim() || '',
    };

    if (isEditing) {
      updateMutation.mutate(postData);
    } else {
      createMutation.mutate(postData);
    }
  };

  if (isEditing && postLoading) {
    return <Loading text="Loading..." />;
  }

  const isPending = createMutation.isPending || updateMutation.isPending;
  const categories = categoriesData?.data || [];
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;

  return (
    <PageWrapper>
      <ContentLayout>
        <MainEditor>
          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? 'Edit Post' : 'New Post'}</CardTitle>
              <ToggleButton onClick={() => setShowPreview(!showPreview)}>
                {showPreview ? <><Pencil /> Edit</> : <><Eye /> Preview</>}
              </ToggleButton>
            </CardHeader>

            {showPreview ? (
              <PreviewContent>
                <PreviewTitle>{title || 'Untitled'}</PreviewTitle>
                {imageURL && (
                  <PreviewImage>
                    <img src={imageURL} alt="Cover" />
                  </PreviewImage>
                )}
                <div 
                  className="post-content"
                  dangerouslySetInnerHTML={{ __html: content || '<p>No content</p>' }} 
                />
              </PreviewContent>
            ) : (
              <>
                <FormGroup>
                  <Label>Title</Label>
                  <Input
                    type="text"
                    placeholder="Post title"
                    value={title}
                    onChange={handleTitleChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label><Image /> Cover Image URL</Label>
                  <Input
                    type="text"
                    placeholder="https://..."
                    value={imageURL}
                    onChange={(e) => setImageURL(e.target.value)}
                  />
                  {imageURL && (
                    <ImagePreview>
                      <img 
                        src={imageURL} 
                        alt="Preview" 
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </ImagePreview>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>Content</Label>
                  <EditorWrapper>
                    <RichTextEditor value={content} onChange={setContent} />
                  </EditorWrapper>
                  <WordCount>{wordCount} words</WordCount>
                </FormGroup>
              </>
            )}
          </Card>
        </MainEditor>

        <Sidebar>
          <Card>
            <SidebarTitle>Publish</SidebarTitle>
            
            <FormGroup>
              <SmallLabel>Status</SmallLabel>
              <Select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                <option value="draft">Draft</option>
                <option value="private">Private</option>
                <option value="public">Public</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <SmallLabel>URL Slug</SmallLabel>
              <Input
                type="text"
                placeholder="post-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </FormGroup>

            <Divider />

            <ButtonGroup>
              <PrimaryButton onClick={(e) => handleSubmit(e, 'public')} disabled={isPending}>
                {isPending ? 'Saving...' : isEditing ? 'Update' : 'Publish'}
              </PrimaryButton>
              <SecondaryButton onClick={(e) => handleSubmit(e, 'draft')} disabled={isPending}>
                Save Draft
              </SecondaryButton>
              <GhostButton onClick={() => navigate(-1)}>
                Cancel
              </GhostButton>
            </ButtonGroup>
          </Card>

          <Card>
            <SidebarTitle>Categories</SidebarTitle>
            {categories.length === 0 ? (
              <InfoText>No categories available</InfoText>
            ) : (
              <CategoriesWrapper>
                {categories.map((cat) => (
                  <CategoryBadge
                    key={cat._id}
                    $selected={selectedCategories.includes(cat.name)}
                    onClick={() => toggleCategory(cat.name)}
                  >
                    {cat.name}
                  </CategoryBadge>
                ))}
              </CategoriesWrapper>
            )}
          </Card>

          {isEditing && existingPost?.data && (
            <Card>
              <SidebarTitle>Info</SidebarTitle>
              <InfoText>Created: {new Date(existingPost.data.createdAt).toLocaleDateString()}</InfoText>
              <InfoText>Likes: {existingPost.data.likes?.length || 0}</InfoText>
              <InfoText>Comments: {existingPost.data.comments?.length || 0}</InfoText>
            </Card>
          )}
        </Sidebar>
      </ContentLayout>
    </PageWrapper>
  );
}
