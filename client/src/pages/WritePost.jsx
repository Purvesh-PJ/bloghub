import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  TextField,
  Button,
  Select,
  Badge,
  Card,
  Separator,
} from '@radix-ui/themes';
import { Image, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { postService } from '../services/postService';
import { categoryService } from '../services/categoryService';
import { RichTextEditor } from '../components/common/RichTextEditor';
import { Loading } from '../components/common/Loading';

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
    <Container size="3" py="5">
      <Flex gap="5" direction={{ initial: 'column', md: 'row' }}>
        {/* Main Editor */}
        <Box style={{ flex: 1 }}>
          <Card>
            <Box p="4">
              <Flex direction="column" gap="4">
                <Flex justify="between" align="center">
                  <Heading size="4">{isEditing ? 'Edit Post' : 'New Post'}</Heading>
                  <Button variant="ghost" size="1" onClick={() => setShowPreview(!showPreview)}>
                    <Eye size={14} /> {showPreview ? 'Edit' : 'Preview'}
                  </Button>
                </Flex>

                {showPreview ? (
                  <Box>
                    <Heading size="5" mb="3">{title || 'Untitled'}</Heading>
                    {imageURL && (
                      <Box mb="3" style={{ borderRadius: '6px', overflow: 'hidden' }}>
                        <img src={imageURL} alt="Cover" style={{ width: '100%', maxHeight: '250px', objectFit: 'cover' }} />
                      </Box>
                    )}
                    <Box 
                      className="post-content"
                      dangerouslySetInnerHTML={{ __html: content || '<p>No content</p>' }} 
                    />
                  </Box>
                ) : (
                  <>
                    <Box>
                      <Text as="label" size="2" weight="medium" style={{ display: 'block', marginBottom: '6px' }}>
                        Title
                      </Text>
                      <TextField.Root
                        size="2"
                        placeholder="Post title"
                        value={title}
                        onChange={handleTitleChange}
                      />
                    </Box>

                    <Box>
                      <Text as="label" size="2" weight="medium" style={{ display: 'block', marginBottom: '6px' }}>
                        <Flex align="center" gap="1">
                          <Image size={12} /> Cover Image URL
                        </Flex>
                      </Text>
                      <TextField.Root
                        size="2"
                        placeholder="https://..."
                        value={imageURL}
                        onChange={(e) => setImageURL(e.target.value)}
                      />
                      {imageURL && (
                        <Box mt="2" style={{ borderRadius: '4px', overflow: 'hidden' }}>
                          <img 
                            src={imageURL} 
                            alt="Preview" 
                            style={{ width: '100%', maxHeight: '120px', objectFit: 'cover' }}
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        </Box>
                      )}
                    </Box>

                    <Box>
                      <Text as="label" size="2" weight="medium" style={{ display: 'block', marginBottom: '6px' }}>
                        Content
                      </Text>
                      <RichTextEditor value={content} onChange={setContent} />
                      <Text size="1" color="gray" mt="1">{wordCount} words</Text>
                    </Box>
                  </>
                )}
              </Flex>
            </Box>
          </Card>
        </Box>

        {/* Sidebar */}
        <Box style={{ width: '280px', flexShrink: 0 }}>
          <Flex direction="column" gap="4">
            {/* Publish */}
            <Card>
              <Box p="3">
                <Flex direction="column" gap="3">
                  <Text size="2" weight="medium">Publish</Text>
                  
                  <Box>
                    <Text as="label" size="1" color="gray" style={{ display: 'block', marginBottom: '4px' }}>
                      Status
                    </Text>
                    <Select.Root value={visibility} onValueChange={setVisibility}>
                      <Select.Trigger style={{ width: '100%' }} />
                      <Select.Content>
                        <Select.Item value="draft">Draft</Select.Item>
                        <Select.Item value="private">Private</Select.Item>
                        <Select.Item value="public">Public</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Box>

                  <Box>
                    <Text as="label" size="1" color="gray" style={{ display: 'block', marginBottom: '4px' }}>
                      URL Slug
                    </Text>
                    <TextField.Root
                      size="2"
                      placeholder="post-slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                    />
                  </Box>

                  <Separator size="4" />

                  <Flex direction="column" gap="2">
                    <Button size="2" onClick={(e) => handleSubmit(e, 'public')} disabled={isPending}>
                      {isPending ? 'Saving...' : isEditing ? 'Update' : 'Publish'}
                    </Button>
                    <Button variant="soft" size="2" onClick={(e) => handleSubmit(e, 'draft')} disabled={isPending}>
                      Save Draft
                    </Button>
                    <Button variant="ghost" size="2" onClick={() => navigate(-1)}>
                      Cancel
                    </Button>
                  </Flex>
                </Flex>
              </Box>
            </Card>

            {/* Categories */}
            <Card>
              <Box p="3">
                <Flex direction="column" gap="2">
                  <Text size="2" weight="medium">Categories</Text>
                  {categories.length === 0 ? (
                    <Text size="1" color="gray">No categories available</Text>
                  ) : (
                    <Flex gap="1" wrap="wrap">
                      {categories.map((cat) => (
                        <Badge
                          key={cat._id}
                          variant={selectedCategories.includes(cat.name) ? 'solid' : 'soft'}
                          color="gray"
                          size="1"
                          style={{ cursor: 'pointer' }}
                          onClick={() => toggleCategory(cat.name)}
                        >
                          {cat.name}
                        </Badge>
                      ))}
                    </Flex>
                  )}
                </Flex>
              </Box>
            </Card>

            {/* Post Info */}
            {isEditing && existingPost?.data && (
              <Card>
                <Box p="3">
                  <Flex direction="column" gap="1">
                    <Text size="2" weight="medium">Info</Text>
                    <Text size="1" color="gray">
                      Created: {new Date(existingPost.data.createdAt).toLocaleDateString()}
                    </Text>
                    <Text size="1" color="gray">
                      Likes: {existingPost.data.likes?.length || 0}
                    </Text>
                    <Text size="1" color="gray">
                      Comments: {existingPost.data.comments?.length || 0}
                    </Text>
                  </Flex>
                </Box>
              </Card>
            )}
          </Flex>
        </Box>
      </Flex>
    </Container>
  );
}
