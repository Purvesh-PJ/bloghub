import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MDEditor from '@uiw/react-md-editor';
import { Eye, Pencil, Globe, Lock, FileText, X, RotateCcw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

import { postService } from '../services/postService';
import { useTags } from '../hooks/useTags';
import { useTheme } from '../styles/ThemeProvider';
import { PageShell } from '../components/layout/PageShell';
import { Button, Card, Input, Chip, Loading } from '../components/ui';
import { readingTime } from '../utils/text';
import { markdownRehypePlugins } from '../config/markdown';
import { useDraftRecovery, useBeforeUnload, useNavigationGuard } from '../hooks/useDraftRecovery';
import { queryKeys } from '../services/queryKeys';
import { cn } from '../lib/utils';

const MAX_TAGS = 5;

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
  const [tags, setTags] = useState([]);
  const [tagDraft, setTagDraft] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [preview, setPreview] = useState(false);
  const [dirty, setDirty] = useState(false);

  const { tags: allTags } = useTags();

  const popularSuggestions = useMemo(() => {
    const list = allTags;
    return list.filter((t) => !tags.includes(t.name.toLowerCase())).slice(0, 5);
  }, [allTags, tags]);

  const { data: existingPost, isLoading: postLoading } = useQuery({
    queryKey: queryKeys.posts.detail(id),
    queryFn: () => postService.getPost(id),
    enabled: isEditing,
  });

  const [loadedPost, setLoadedPost] = useState(null);
  if (existingPost?.data && loadedPost !== existingPost) {
    setLoadedPost(existingPost);
    const post = existingPost.data;
    setTitle(post.title || '');
    setContent(post.content || '');
    setSlug(post.slug || '');
    setVisibility(post.visibility || 'draft');
    setImageURL(post.imageURL || '');
    setTags(post.tags?.map((tag) => (typeof tag === 'string' ? tag : tag.name)) || []);
    setDirty(false);
  }

  const editorValues = useMemo(
    () => ({ title, content, slug, visibility, imageURL, tags }),
    [title, content, slug, visibility, imageURL, tags]
  );

  const {
    recovered,
    clear: clearDraft,
    discard: discardDraft,
  } = useDraftRecovery({
    id,
    values: editorValues,
    dirty,
    enabled: !isEditing || Boolean(existingPost?.data),
  });

  useBeforeUnload(dirty);
  useNavigationGuard(dirty);

  const restoreDraft = () => {
    if (!recovered) return;
    setTitle(recovered.title ?? '');
    setContent(recovered.content ?? '');
    setSlug(recovered.slug ?? '');
    setVisibility(recovered.visibility ?? 'draft');
    setImageURL(recovered.imageURL ?? '');
    setTags(recovered.tags ?? []);
    setDirty(true);
    discardDraft();
    toast.success('Recovered your unsaved work');
  };

  const createMutation = useMutation({
    mutationFn: postService.createPost,
    onSuccess: async (data, submitted) => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.mine() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });
      toast.success(submitted?.visibility === 'public' ? 'Story published 🎉' : 'Story saved');
      navigate(
        submitted?.visibility === 'public' && data.postId ? `/post/${data.postId}` : '/stories'
      );
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Could not create the post'),
  });

  const updateMutation = useMutation({
    mutationFn: (data) => postService.updatePost(id, data),
    onSuccess: async (_, submitted) => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.mine() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(id) });
      toast.success('Story updated 🚀');
      navigate(submitted?.visibility === 'public' ? `/post/${id}` : '/stories');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Could not update the post'),
  });

  const handleTitle = (value) => {
    setTitle(value);
    setDirty(true);
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
    setDirty(false);
    return isEditing ? updateMutation.mutate(payload) : createMutation.mutate(payload);
  };

  const words = useMemo(() => content.split(/\s+/).filter(Boolean).length, [content]);
  const pending = createMutation.isPending || updateMutation.isPending;

  if (isEditing && postLoading) return <Loading text="Loading the post…" />;

  return (
    <PageShell>
      {recovered && (
        <div
          role="status"
          className="flex items-center gap-3 flex-wrap p-4 px-6 mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-sm"
        >
          <RotateCcw className="w-4 h-4 shrink-0" />
          <span className="mr-auto">
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
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">
        {/* Main Editor Section */}
        <div className="flex flex-col gap-6 min-w-0">
          {preview ? (
            <Card tone="low" radius="xl" padding="2xl">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[hsl(var(--foreground))] mb-4">
                {title || 'Untitled'}
              </h1>
              {imageURL && (
                <div className="mt-4 rounded-2xl overflow-hidden aspect-[21/9] bg-[hsl(var(--muted))]">
                  <img src={imageURL} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div
                data-color-mode={mode}
                className="mt-6 text-lg leading-relaxed text-[hsl(var(--foreground))] [&_.wmde-markdown]:bg-transparent [&_.wmde-markdown_h1]:text-3xl [&_.wmde-markdown_h1]:font-bold [&_.wmde-markdown_h2]:text-2xl [&_.wmde-markdown_h2]:font-bold [&_.wmde-markdown_p]:text-[hsl(var(--muted-foreground))] [&_.wmde-markdown_li]:text-[hsl(var(--muted-foreground))] [&_.wmde-markdown_a]:text-[hsl(var(--primary))] [&_.wmde-markdown_pre]:rounded-xl [&_.wmde-markdown_pre]:bg-[hsl(var(--card))]"
              >
                <MDEditor.Markdown
                  source={content || '_Nothing written yet._'}
                  rehypePlugins={markdownRehypePlugins}
                />
              </div>
            </Card>
          ) : (
            <>
              {/* Borderless Title Textarea */}
              <textarea
                rows={1}
                placeholder="Title"
                value={title}
                onChange={(event) => handleTitle(event.target.value)}
                onInput={(event) => {
                  event.target.style.height = 'auto';
                  event.target.style.height = `${event.target.scrollHeight}px`;
                }}
                aria-label="Post title"
                className="w-full resize-none border-none bg-transparent text-2xl sm:text-4xl font-extrabold tracking-tight text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))/0.5] focus:outline-none"
              />

              {/* MD Editor Container */}
              <div
                data-color-mode={mode}
                className="rounded-2xl overflow-hidden border border-[hsl(var(--border))/0.6] shadow-sm [&_.w-md-editor]:bg-[hsl(var(--card))] [&_.w-md-editor]:shadow-none [&_.w-md-editor-toolbar]:bg-[hsl(var(--muted))/0.5] [&_.w-md-editor-toolbar]:border-b [&_.w-md-editor-toolbar]:border-[hsl(var(--border))/0.4] [&_.w-md-editor-text-input]:text-base [&_.wmde-markdown]:bg-transparent"
              >
                <MDEditor
                  value={content}
                  onChange={handleContent}
                  height={520}
                  preview="edit"
                  previewOptions={{ rehypePlugins: markdownRehypePlugins }}
                />
              </div>
            </>
          )}
        </div>

        {/* Sidebar Controls */}
        <aside className="flex flex-col gap-5 lg:sticky lg:top-20">
          <Card tone="low" radius="lg" padding="md">
            <Button
              variant={preview ? 'primary' : 'secondary'}
              fullWidth
              onClick={() => setPreview((current) => !current)}
            >
              {preview ? (
                <>
                  <Pencil className="w-3.5 h-3.5 mr-1" /> Keep writing
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 mr-1" /> Preview mode
                </>
              )}
            </Button>
          </Card>

          {/* Visibility choice */}
          <Card tone="low" radius="lg" padding="lg">
            <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-3 select-none">
              Who can see it
            </p>
            <div className="flex flex-col gap-1.5">
              {VISIBILITY.map((option) => {
                const isActive = visibility === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setVisibility(option.id)}
                    aria-pressed={isActive}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-xl text-left transition-colors cursor-pointer select-none',
                      isActive
                        ? 'bg-[hsl(var(--primary))/0.12] text-[hsl(var(--primary))]'
                        : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]'
                    )}
                  >
                    <option.icon className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      <span className="text-sm font-semibold block text-[hsl(var(--foreground))]">
                        {option.name}
                      </span>
                      <span className="text-xs text-[hsl(var(--muted-foreground))] block">
                        {option.note}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Tags card */}
          <Card tone="low" radius="lg" padding="lg">
            <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-3 select-none">
              Tags & Topics
            </p>
            {tags.length > 0 && (
              <div className="flex gap-1.5 flex-wrap mb-2">
                {tags.map((tag) => (
                  <Chip key={tag} size="sm" selected onClick={() => removeTag(tag)}>
                    #{tag} <X className="w-3 h-3 ml-1" />
                  </Chip>
                ))}
              </div>
            )}
            <Input
              placeholder={
                tags.length >= MAX_TAGS ? 'Tag limit reached' : 'Add tag (e.g. ai, react)'
              }
              value={tagDraft}
              disabled={tags.length >= MAX_TAGS}
              onChange={(event) => setTagDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ',') {
                  event.preventDefault();
                  addTag(tagDraft);
                } else if (event.key === 'Backspace' && !tagDraft && tags.length > 0) {
                  removeTag(tags[tags.length - 1]);
                }
              }}
              onBlur={() => addTag(tagDraft)}
            />
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1.5">
              {tags.length}/{MAX_TAGS} · lowercase, letters, numbers and hyphens
            </p>

            {popularSuggestions.length > 0 && tags.length < MAX_TAGS && (
              <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
                <span className="text-xs font-medium text-[hsl(var(--muted-foreground))]">
                  Popular:
                </span>
                {popularSuggestions.map((s) => (
                  <Chip key={s.name} size="sm" onClick={() => addTag(s.name)}>
                    +{s.name}
                  </Chip>
                ))}
              </div>
            )}
          </Card>

          {/* Details card */}
          <Card tone="low" radius="lg" padding="lg">
            <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-3 select-none">
              Details
            </p>
            <Input
              label="Cover image"
              placeholder="https://…"
              value={imageURL}
              onChange={(event) => setImageURL(event.target.value)}
            />
            {imageURL && (
              <div className="mt-3 rounded-xl overflow-hidden aspect-[21/9] bg-[hsl(var(--muted))]">
                <img
                  src={imageURL}
                  alt=""
                  onError={(event) => (event.target.src = '')}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="mt-4">
              <Input
                label="Link"
                placeholder="post-title"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                hint="Used in the post's address."
              />
            </div>
          </Card>

          {/* Length facts */}
          <Card tone="low" radius="lg" padding="lg">
            <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-3 select-none">
              Length
            </p>
            <dl className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-4 text-sm text-[hsl(var(--muted-foreground))]">
                <dt>Words</dt>
                <dd className="font-semibold text-[hsl(var(--foreground))] tabular-nums">
                  {words}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 text-sm text-[hsl(var(--muted-foreground))]">
                <dt>Reading time</dt>
                <dd className="font-semibold text-[hsl(var(--foreground))] tabular-nums">
                  {readingTime(content)} min
                </dd>
              </div>
              {isEditing && existingPost?.data && (
                <>
                  <div className="flex items-baseline justify-between gap-4 text-sm text-[hsl(var(--muted-foreground))]">
                    <dt>Likes</dt>
                    <dd className="font-semibold text-[hsl(var(--foreground))] tabular-nums">
                      {existingPost.data.likes?.length || 0}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 text-sm text-[hsl(var(--muted-foreground))]">
                    <dt>Responses</dt>
                    <dd className="font-semibold text-[hsl(var(--foreground))] tabular-nums">
                      {existingPost.data.comments?.length || 0}
                    </dd>
                  </div>
                </>
              )}
            </dl>
          </Card>

          {/* Action buttons */}
          <div className="flex flex-col gap-2">
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
            <Button variant="ghost" fullWidth as={Link} to="/stories">
              Cancel
            </Button>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
