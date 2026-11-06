import { Link } from 'react-router-dom';
import { Eye, Pencil, Globe, Lock, FileText, X } from 'lucide-react';
import { Button, Card, Input, Chip } from '../../../components/ui';
import { cn } from '../../../lib/utils';

const VISIBILITY = [
  { id: 'public', icon: Globe, name: 'Public', note: 'Anyone can find and read it.' },
  { id: 'private', icon: Lock, name: 'Private', note: 'Only you, via a direct link.' },
  { id: 'draft', icon: FileText, name: 'Draft', note: 'Not published. Only you can see it.' },
];

export function PublishSettingsSidebar({
  preview,
  onTogglePreview,
  visibility,
  onVisibilityChange,
  tags,
  tagDraft,
  onTagDraftChange,
  onAddTag,
  onRemoveTag,
  maxTags = 5,
  popularSuggestions = [],
  imageURL,
  onImageURLChange,
  slug,
  onSlugChange,
  words,
  readingMinutes,
  isEditing,
  likesCount = 0,
  commentsCount = 0,
  onSubmit,
  onSaveDraft,
  pending = false,
}) {
  return (
    <aside className="flex flex-col gap-5 lg:sticky lg:top-20">
      {/* Preview Toggle Button */}
      <Card tone="low" radius="lg" padding="md">
        <Button variant={preview ? 'primary' : 'secondary'} fullWidth onClick={onTogglePreview}>
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
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 select-none">
          Who can see it
        </p>
        <div className="flex flex-col gap-1.5">
          {VISIBILITY.map((option) => {
            const isActive = visibility === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onVisibilityChange(option.id)}
                aria-pressed={isActive}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-xl text-left transition-colors cursor-pointer select-none',
                  isActive
                    ? 'bg-primary/12 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <option.icon className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <span className="text-sm font-semibold block text-foreground">{option.name}</span>
                  <span className="text-xs text-muted-foreground block">{option.note}</span>
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Tags card */}
      <Card tone="low" radius="lg" padding="lg">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 select-none">
          Tags & Topics
        </p>
        {tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-2">
            {tags.map((tag) => (
              <Chip key={tag} size="sm" selected onClick={() => onRemoveTag(tag)}>
                #{tag} <X className="w-3 h-3 ml-1" />
              </Chip>
            ))}
          </div>
        )}
        <Input
          placeholder={tags.length >= maxTags ? 'Tag limit reached' : 'Add tag (e.g. ai, react)'}
          value={tagDraft}
          disabled={tags.length >= maxTags}
          onChange={(event) => onTagDraftChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ',') {
              event.preventDefault();
              onAddTag(tagDraft);
            } else if (event.key === 'Backspace' && !tagDraft && tags.length > 0) {
              onRemoveTag(tags[tags.length - 1]);
            }
          }}
          onBlur={() => onAddTag(tagDraft)}
        />
        <p className="text-xs text-muted-foreground mt-1.5">
          {tags.length}/{maxTags} · lowercase, letters, numbers and hyphens
        </p>

        {popularSuggestions.length > 0 && tags.length < maxTags && (
          <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
            <span className="text-xs font-medium text-muted-foreground">Popular:</span>
            {popularSuggestions.map((s) => (
              <Chip key={s.name} size="sm" onClick={() => onAddTag(s.name)}>
                +{s.name}
              </Chip>
            ))}
          </div>
        )}
      </Card>

      {/* Details card */}
      <Card tone="low" radius="lg" padding="lg">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 select-none">
          Details
        </p>
        <Input
          label="Cover image"
          placeholder="https://…"
          value={imageURL}
          onChange={(event) => onImageURLChange(event.target.value)}
        />
        {imageURL && (
          <div className="mt-3 rounded-xl overflow-hidden aspect-[21/9] bg-muted">
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
            onChange={(event) => onSlugChange(event.target.value)}
            hint="Used in the post's address."
          />
        </div>
      </Card>

      {/* Length facts */}
      <Card tone="low" radius="lg" padding="lg">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 select-none">
          Length
        </p>
        <dl className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-4 text-sm text-muted-foreground">
            <dt>Words</dt>
            <dd className="font-semibold text-foreground tabular-nums">{words}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 text-sm text-muted-foreground">
            <dt>Reading time</dt>
            <dd className="font-semibold text-foreground tabular-nums">{readingMinutes} min</dd>
          </div>
          {isEditing && (
            <>
              <div className="flex items-baseline justify-between gap-4 text-sm text-muted-foreground">
                <dt>Likes</dt>
                <dd className="font-semibold text-foreground tabular-nums">{likesCount}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 text-sm text-muted-foreground">
                <dt>Responses</dt>
                <dd className="font-semibold text-foreground tabular-nums">{commentsCount}</dd>
              </div>
            </>
          )}
        </dl>
      </Card>

      {/* Action buttons */}
      <div className="flex flex-col gap-2">
        <Button fullWidth isLoading={pending} onClick={onSubmit}>
          {isEditing ? 'Save changes' : visibility === 'public' ? 'Publish' : 'Save'}
        </Button>
        {visibility !== 'draft' && !isEditing && (
          <Button variant="secondary" fullWidth disabled={pending} onClick={onSaveDraft}>
            Save as draft
          </Button>
        )}
        <Button variant="ghost" fullWidth as={Link} to="/stories">
          Cancel
        </Button>
      </div>
    </aside>
  );
}
