import { Link } from 'react-router-dom';
import {
  UserPlus,
  UserCheck,
  Settings as SettingsIcon,
  MapPin,
  LinkIcon,
  Github,
  Twitter,
  Linkedin,
} from 'lucide-react';
import { Button, Avatar } from '../../../components/ui';

const SOCIALS = [
  { key: 'github', icon: Github, href: (handle) => `https://github.com/${handle}` },
  { key: 'twitter', icon: Twitter, href: (handle) => `https://twitter.com/${handle}` },
  { key: 'linkedin', icon: Linkedin, href: (handle) => `https://linkedin.com/in/${handle}` },
];

export function ProfileHeader({
  author,
  authorAvatar,
  authorName,
  isOwnProfile,
  isAuthenticated,
  isFollowing,
  pending,
  onFollowToggle,
}) {
  const socials = SOCIALS.filter(
    ({ key }) => author.socialLinks && Boolean(author.socialLinks[key])
  );

  return (
    <header className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8">
      <Avatar src={authorAvatar} name={authorName} size="2xl" />

      <div className="flex-1 min-w-0 flex flex-col gap-3 w-full">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">
              {authorName}
            </h1>
            {author.fullName && (
              <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
                {author.fullName}
              </p>
            )}
          </div>

          {isOwnProfile ? (
            <Button as={Link} to="/settings" variant="secondary">
              <SettingsIcon className="h-4 w-4" /> Edit profile
            </Button>
          ) : (
            isAuthenticated && (
              <Button
                variant={isFollowing ? 'tonal' : 'primary'}
                onClick={onFollowToggle}
                disabled={pending}
              >
                {isFollowing ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            )
          )}
        </div>

        {author.bio && (
          <p className="text-base sm:text-lg text-[hsl(var(--muted-foreground))] max-w-[60ch] leading-relaxed">
            {author.bio}
          </p>
        )}

        {(author.location || author.website || socials.length > 0) && (
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap text-sm text-[hsl(var(--muted-foreground))]">
            {author.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" /> {author.location}
              </span>
            )}

            {author.website && (
              <a
                href={author.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-[hsl(var(--primary))] transition-colors"
              >
                <LinkIcon className="h-3.5 w-3.5" /> {author.website.replace(/^https?:\/\//, '')}
              </a>
            )}

            {socials.map(({ key, icon: Icon, href }) => (
              <a
                key={key}
                href={href(author.socialLinks[key])}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-[hsl(var(--primary))] transition-colors"
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="capitalize">{key}</span>
              </a>
            ))}
          </div>
        )}

        {/* Counts from server */}
        <dl className="flex gap-6 sm:gap-8 flex-wrap pt-2">
          <div className="flex items-baseline gap-1.5">
            <dt className="text-base font-semibold text-[hsl(var(--foreground))] tabular-nums">
              {author.counts?.posts ?? 0}
            </dt>
            <dd className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
              {author.counts?.posts === 1 ? 'story' : 'stories'}
            </dd>
          </div>
          <div className="flex items-baseline gap-1.5">
            <dt className="text-base font-semibold text-[hsl(var(--foreground))] tabular-nums">
              {author.counts?.followers ?? 0}
            </dt>
            <dd className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
              {author.counts?.followers === 1 ? 'follower' : 'followers'}
            </dd>
          </div>
          <div className="flex items-baseline gap-1.5">
            <dt className="text-base font-semibold text-[hsl(var(--foreground))] tabular-nums">
              {author.counts?.following ?? 0}
            </dt>
            <dd className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
              following
            </dd>
          </div>
        </dl>
      </div>
    </header>
  );
}
