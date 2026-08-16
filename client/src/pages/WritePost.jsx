import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import MDEditor from '@uiw/react-md-editor';
import { Eye, Pencil, Globe, Lock, FileText, X, RotateCcw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

import { postService } from '../services/postService';
import { categoryService } from '../services/categoryService';
import { useTheme } from '../styles/ThemeProvider';
import { PageShell, PageHeader, Section } from '../components/layout/PageShell';
import { topicIcon } from '../components/marketing/Topics';
import { Button, Card, Input, Chip, Loading } from '../components/ui';
import { display, text, label as labelStyle, media, interactive } from '../styles/theme/mixins';
import { readingTime } from '../utils/text';
import { markdownRehypePlugins } from '../config/markdown';
import { useDraftRecovery, useBeforeUnload, useNavigationGuard } from '../hooks/useDraftRecovery';

// Mirrors the server-side cap in validators/content.validators.js.
const MAX_TAGS = 5;

/**
 * The editor.
 *
 * Rebuilt on the shared primitives, and the markdown surface no longer has
 * `data-color-mode="light"` pinned on it — the editor and its preview stayed white while
 * the rest of the page went dark, which is also why a draft never looked like the article
 * it would become.
 *
 * Visibility is a three-way choice made in the open rather than a select buried in a
 * sidebar, because it is the decision on this page a writer is most likely to get wrong.
 */

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: ${({ theme }) => theme.spacing['2xl']};
  align-items: start;

  ${media.down('lg')`grid-template-columns: 1fr;`}
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  min-width: 0;
`;

const Aside = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};

  ${media.up('lg')`
    position: sticky;
    top: calc(${({ theme }) => theme.layout.headerHeight} + ${({ theme }) => theme.spacing.xl});
  `}
`;

/* A borderless title field, sized like the heading it becomes. */
const TitleField = styled.textarea`
  width: 100%;
  resize: none;
  border: none;
  background: transparent;
  ${display('md')}
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textDisabled};
  }

  &:focus {
    outline: none;
  }
`;

const Editor = styled.div`
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.lineDefault};
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);

  .w-md-editor {
    background: ${({ theme }) => theme.colors.surfaceElevated};
    box-shadow: none;
  }

  .w-md-editor-toolbar {
    background: ${({ theme }) => theme.colors.surfaceContainer};
    border-bottom: 1px solid ${({ theme }) => theme.colors.lineDefault};
  }

  .w-md-editor-text-input,
  .w-md-editor-text-pre > code {
    font-size: 15px !important;
    line-height: 1.7 !important;
  }

  .wmde-markdown {
    background: transparent;
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const Preview = styled.div`
  .wmde-markdown {
    background: transparent;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: ${({ theme }) => theme.text.lg[0]};
    line-height: ${({ theme }) => theme.text.lg[1]};
  }

  .wmde-markdown h1,
  .wmde-markdown h2,
  .wmde-markdown h3 {
    color: ${({ theme }) => theme.colors.textPrimary};
    border-bottom: none;
  }

  .wmde-markdown p,
  .wmde-markdown li {
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  .wmde-markdown pre,
  .wmde-markdown code {
    background: ${({ theme }) => theme.colors.surfaceContainer};
    border-radius: ${({ theme }) => theme.radii.sm};
  }

  .wmde-markdown img {
    border-radius: ${({ theme }) => theme.radii.lg};
    max-width: 100%;
  }
`;

const CoverPreview = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  aspect-ratio: 21 / 9;
  background: ${({ theme }) => theme.colors.surfaceContainer};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AsideLabel = styled.p`
  ${labelStyle('sm')}
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Choices = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Choice = styled.button`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  text-align: left;
  ${interactive}

  background: ${({ theme, $active }) => ($active ? theme.colors.accentContainer : 'transparent')};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.accentText : theme.colors.textSecondary};

  &:hover {
    background: ${({ theme, $active }) =>
      $active ? theme.colors.accentContainer : theme.colors.surfaceContainer};
  }

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const ChoiceName = styled.span`
  ${text('sm', 'semibold')}
  display: block;
`;

const ChoiceNote = styled.span`
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};
  display: block;
`;

const Topics = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
`;

const TagRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  /* Collapses to nothing rather than leaving a gap above the input when there are no tags. */
  &:empty {
    display: none;
  }
`;

const TagHint = styled.p`
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

/* Shown when a local snapshot survives a crash or an accidental navigation. */
const RecoveryBanner = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.warningContainer};
  border: 1px solid ${({ theme }) => theme.colors.warningLine};
  color: ${({ theme }) => theme.colors.warningText};
  ${text('sm')}

  span {
    margin-right: auto;
  }

  svg {
    flex-shrink: 0;
  }
`;

const Facts = styled.dl`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Fact = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textSecondary};

  dd {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-variant-numeric: tabular-nums;
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const VISIBILITY = [
  { id: 'public', icon: Globe, name: 'Public', note: 'Anyone can find and read it.' },
  { id: 'private', icon: Lock, name: 'Private', note: 'Only you, via a direct link.' },
  { id: 'draft', icon: FileText, name: 'Draft', note: 'Not published. Only you can see it.' },
];

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export function WritePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mode } = useTheme();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [slug, setSlug] = useState('');
  const [visibility, setVisibility] = useState('draft');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [originalCategories, setOriginalCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagDraft, setTagDraft] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [preview, setPreview] = useState(false);
  // Flipped by any edit, cleared once the work reaches the server. Drives both the recovery
  // snapshot and the navigation guards.
  const [dirty, setDirty] = useState(false);

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
    if (!existingPost?.data) return;
    const post = existingPost.data;
    setTitle(post.title || '');
    setContent(post.content || '');
    setSlug(post.slug || '');
    setVisibility(post.visibility || 'draft');
    setImageURL(post.imageURL || '');
    setTags(post.tags?.map((tag) => tag.name ?? tag) || []);
    const names = post.categories?.map((category) => category.name) || [];
    setSelectedCategories(names);
    setOriginalCategories(names);
    // Loading the server's own copy is not an edit.
    setDirty(false);
  }, [existingPost]);

  const editorValues = useMemo(
    () => ({ title, content, slug, visibility, imageURL, tags, categories: selectedCategories }),
    [title, content, slug, visibility, imageURL, tags, selectedCategories]
  );

  const {
    recovered,
    clear: clearDraft,
    discard: discardDraft,
  } = useDraftRecovery({
    id,
    values: editorValues,
    dirty,
    // Nothing worth snapshotting until the post being edited has actually loaded.
    enabled: !isEditing || Boolean(existingPost?.data),
  });

  useBeforeUnload(dirty);
  useNavigationGuard(dirty);

  /** Puts a recovered snapshot back into the editor. */
  const restoreDraft = () => {
    if (!recovered) return;
    setTitle(recovered.title ?? '');
    setContent(recovered.content ?? '');
    setSlug(recovered.slug ?? '');
    setVisibility(recovered.visibility ?? 'draft');
    setImageURL(recovered.imageURL ?? '');
    setTags(recovered.tags ?? []);
    setSelectedCategories(recovered.categories ?? []);
    setDirty(true);
    discardDraft();
    toast.success('Recovered your unsaved work');
  };

  const createMutation = useMutation({
    mutationFn: postService.createPost,
    onSuccess: async (data) => {
      // The work is on the server now, so the local recovery copy is no longer wanted.
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ['myPosts'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      if (selectedCategories.length > 0 && data.postId) {
        try {
          await categoryService.attachCategoriesToPost(selectedCategories, data.postId);
        } catch (error) {
          console.error('[WritePost] attaching categories failed', error);
        }
      }
      toast.success('Post published successfully! 🎉');
      navigate(data.postId ? `/post/${data.postId}` : '/dashboard');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Could not create the post'),
  });

  const updateMutation = useMutation({
    mutationFn: (data) => postService.updatePost(id, data),
    onSuccess: async () => {
      // The work is on the server now, so the local recovery copy is no longer wanted.
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ['myPosts'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      const added = selectedCategories.filter((name) => !originalCategories.includes(name));
      const removed = originalCategories.filter((name) => !selectedCategories.includes(name));

      if (added.length > 0 || removed.length > 0) {
        try {
          await categoryService.updatePostCategories(id, added, removed);
        } catch (error) {
          console.error('[WritePost] updating categories failed', error);
        }
      }
      toast.success('Post updated successfully! 🚀');
      navigate(`/post/${id}`);
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Could not update the post'),
  });

  const handleTitle = (value) => {
    setTitle(value);
    setDirty(true);
    // Keep the slug following the title until it has been set by hand or already published.
    if (!isEditing || !slug) setSlug(slugify(value));
  };

  const handleContent = (value) => {
    setContent(value || '');
    setDirty(true);
  };

  const addTag = (raw) => {
    const name = raw.trim().toLowerCase();
    if (!name) return;
    if (tags.length >= MAX_TAGS) return toast.error(`Up to ${MAX_TAGS} tags`);
    if (tags.includes(name)) return setTagDraft('');
    if (!/^[a-z0-9][a-z0-9 -]*$/.test(name)) {
      return toast.error('Tags can use letters, numbers, spaces and hyphens');
    }
    setTags((current) => [...current, name]);
    setTagDraft('');
    setDirty(true);
  };

  const removeTag = (name) => {
    setTags((current) => current.filter((tag) => tag !== name));
    setDirty(true);
  };

  const toggleCategory = (name) => {
    setSelectedCategories((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name]
    );
    setDirty(true);
  };

  const submit = (nextVisibility) => {
    if (!title.trim()) return toast.error('Give it a title first');
    if (!content.trim()) return toast.error('There is nothing to publish yet');

    const finalSlug = slug.trim() || slugify(title);
    if (!finalSlug) return toast.error('That title cannot make a valid link');

    const payload = {
      title: title.trim(),
      content,
      slug: finalSlug,
      visibility: nextVisibility || visibility,
      imageURL: imageURL.trim() || '',
      tags,
    };

    setVisibility(payload.visibility);
    // Cleared before the request so the navigation the mutation performs on success is not
    // itself blocked by the unsaved-changes guard.
    setDirty(false);
    return isEditing ? updateMutation.mutate(payload) : createMutation.mutate(payload);
  };

  const words = useMemo(() => content.split(/\s+/).filter(Boolean).length, [content]);
  const categories = categoriesData?.data || [];
  const pending = createMutation.isPending || updateMutation.isPending;

  if (isEditing && postLoading) return <Loading text="Loading the post…" />;

  return (
    <PageShell>
      <PageHeader
        title={isEditing ? 'Edit post' : 'New post'}
        subtitle={
          preview ? 'This is how it will read once published.' : 'Markdown, with a live preview.'
        }
        actions={
          <Button variant="secondary" onClick={() => setPreview((current) => !current)}>
            {preview ? (
              <>
                <Pencil /> Keep writing
              </>
            ) : (
              <>
                <Eye /> Preview
              </>
            )}
          </Button>
        }
      />

      {recovered && (
        <RecoveryBanner role="status">
          <RotateCcw size={16} />
          <span>
            Unsaved work from{' '}
            {formatDistanceToNow(new Date(recovered.savedAt), { addSuffix: true })} was found on
            this device.
          </span>
          <Button size="sm" variant="tonal" onClick={restoreDraft}>
            Restore it
          </Button>
          <Button size="sm" variant="ghost" onClick={discardDraft}>
            Discard
          </Button>
        </RecoveryBanner>
      )}

      <Layout>
        <Main>
          {preview ? (
            <Card tone="low" radius="xl" padding="2xl">
              <h1 style={{ marginBottom: 16 }}>
                <TitleField as="span" style={{ display: 'block' }}>
                  {title || 'Untitled'}
                </TitleField>
              </h1>
              {imageURL && (
                <CoverPreview>
                  <img src={imageURL} alt="" />
                </CoverPreview>
              )}
              <Preview data-color-mode={mode} style={{ marginTop: 24 }}>
                <MDEditor.Markdown
                  source={content || '_Nothing written yet._'}
                  rehypePlugins={markdownRehypePlugins}
                />
              </Preview>
            </Card>
          ) : (
            <>
              <TitleField
                rows={1}
                placeholder="Title"
                value={title}
                onChange={(event) => handleTitle(event.target.value)}
                onInput={(event) => {
                  event.target.style.height = 'auto';
                  event.target.style.height = `${event.target.scrollHeight}px`;
                }}
                aria-label="Post title"
              />

              <Editor data-color-mode={mode}>
                <MDEditor
                  value={content}
                  onChange={handleContent}
                  height={520}
                  preview="edit"
                  previewOptions={{ rehypePlugins: markdownRehypePlugins }}
                />
              </Editor>
            </>
          )}
        </Main>

        <Aside>
          <Card tone="low" radius="lg" padding="lg">
            <AsideLabel>Who can see it</AsideLabel>
            <Choices>
              {VISIBILITY.map((option) => (
                <Choice
                  key={option.id}
                  type="button"
                  $active={visibility === option.id}
                  onClick={() => setVisibility(option.id)}
                  aria-pressed={visibility === option.id}
                >
                  <option.icon />
                  <span>
                    <ChoiceName>{option.name}</ChoiceName>
                    <ChoiceNote>{option.note}</ChoiceNote>
                  </span>
                </Choice>
              ))}
            </Choices>
          </Card>

          <Card tone="low" radius="lg" padding="lg">
            <AsideLabel>Categories & Topics</AsideLabel>
            <Topics>
              {(categories.length > 0
                ? categories.map((c) => ({ id: c._id, name: c.name }))
                : [
                    { id: '1', name: 'Food' },
                    { id: '2', name: 'Technology' },
                    { id: '3', name: 'Science' },
                    { id: '4', name: 'Design' },
                    { id: '5', name: 'Travel' },
                    { id: '6', name: 'Health' },
                    { id: '7', name: 'Programming' },
                    { id: '8', name: 'Business' },
                  ]
              ).map((category) => {
                const Icon = topicIcon(category.name);
                const isSelected = selectedCategories.includes(category.name);
                return (
                  <Chip
                    key={category.id}
                    size="sm"
                    selected={isSelected}
                    onClick={() => toggleCategory(category.name)}
                  >
                    <Icon size={13} /> {category.name}
                  </Chip>
                );
              })}
            </Topics>
          </Card>

          {/*
            Tags, unlike categories, are whatever the writer types — categories stay a fixed
            list an administrator curates. The Tag model, its routes and the `tags` field on
            Post all existed before this; nothing had ever written to them.
          */}
          <Card tone="low" radius="lg" padding="lg">
            <AsideLabel>Tags</AsideLabel>
            <TagRow>
              {tags.map((tag) => (
                <Chip key={tag} size="sm" selected onClick={() => removeTag(tag)}>
                  {tag} <X size={12} />
                </Chip>
              ))}
            </TagRow>
            <Input
              placeholder={tags.length >= MAX_TAGS ? 'Tag limit reached' : 'Add a tag, press Enter'}
              value={tagDraft}
              disabled={tags.length >= MAX_TAGS}
              onChange={(event) => setTagDraft(event.target.value)}
              onKeyDown={(event) => {
                // Comma as well as Enter, since that is how people habitually separate tags.
                if (event.key === 'Enter' || event.key === ',') {
                  event.preventDefault();
                  addTag(tagDraft);
                } else if (event.key === 'Backspace' && !tagDraft && tags.length > 0) {
                  removeTag(tags[tags.length - 1]);
                }
              }}
              onBlur={() => addTag(tagDraft)}
            />
            <TagHint>
              {tags.length}/{MAX_TAGS} · lowercase, letters, numbers and hyphens
            </TagHint>
          </Card>

          <Card tone="low" radius="lg" padding="lg">
            <AsideLabel>Details</AsideLabel>
            <Input
              label="Cover image"
              placeholder="https://…"
              value={imageURL}
              onChange={(event) => setImageURL(event.target.value)}
            />
            {imageURL && (
              <CoverPreview>
                <img src={imageURL} alt="" onError={(event) => (event.target.src = '')} />
              </CoverPreview>
            )}
            <div style={{ marginTop: 16 }}>
              <Input
                label="Link"
                placeholder="post-title"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                hint="Used in the post's address."
              />
            </div>
          </Card>

          <Card tone="low" radius="lg" padding="lg">
            <AsideLabel>Length</AsideLabel>
            <Facts>
              <Fact>
                <dt>Words</dt>
                <dd>{words}</dd>
              </Fact>
              <Fact>
                <dt>Reading time</dt>
                <dd>{readingTime(content)} min</dd>
              </Fact>
              {isEditing && existingPost?.data && (
                <>
                  <Fact>
                    <dt>Likes</dt>
                    <dd>{existingPost.data.likes?.length || 0}</dd>
                  </Fact>
                  <Fact>
                    <dt>Responses</dt>
                    <dd>{existingPost.data.comments?.length || 0}</dd>
                  </Fact>
                </>
              )}
            </Facts>
          </Card>

          <Buttons>
            <Button fullWidth isLoading={pending} onClick={() => submit(visibility)}>
              {isEditing ? 'Save changes' : visibility === 'public' ? 'Publish' : 'Save'}
            </Button>
            {visibility !== 'draft' && !isEditing && (
              <Button
                variant="secondary"
                fullWidth
                disabled={pending}
                onClick={() => submit('draft')}
              >
                Save as draft
              </Button>
            )}
            <Button variant="ghost" fullWidth onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </Buttons>
        </Aside>
      </Layout>
    </PageShell>
  );
}
