import styled from 'styled-components';
import { formatDistanceToNow, format } from 'date-fns';
import { Clock } from 'lucide-react';
import { Avatar } from '../ui';
import { text } from '../../styles/theme/mixins';

/**
 * Who wrote this, and when.
 *
 * App-specific, not a primitive: it knows a story has an author, a published date and a
 * reading time. It is built from `ui/Avatar` rather than drawing its own circle, which is the
 * arrangement the rest of the app should follow — the ui layer knows nothing about posts, and
 * everything that does knows how to use it.
 *
 * Two layouts, because the same three facts are shown two ways:
 *
 *   inline    a single line under a card title — avatar, name, dot, date, dot, read time
 *   stacked   name on its own line with the meta beneath it, for a page header
 *
 * Deliberately not used for the comment thread or the profile header. A comment's avatar is a
 * sibling in a grid, not part of the byline, and a profile header carries a bio and follower
 * counts. Forcing three different shapes through one component is how the seven avatars
 * happened.
 */

const Inline = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};
  min-width: 0;
`;

const Stacked = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: 0;
`;

const Names = styled.span`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const Name = styled.span`
  ${text('md', 'bold')}
  color: ${({ theme }) => theme.colors.textPrimary};
  display: block;
`;

const Meta = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};

  svg {
    width: 12px;
    height: 12px;
  }
`;

const Dot = styled.span`
  color: ${({ theme }) => theme.colors.lineStrong};
`;

/**
 * @param {object} props
 * @param {string} props.name
 * @param {string} [props.avatarUrl]
 * @param {string|Date} [props.at] when it was published
 * @param {'relative'|'absolute'} [props.dateStyle]
 * @param {number} [props.readingMinutes]
 * @param {string} [props.note] replaces the date line entirely, for a caption of your own
 * @param {'inline'|'stacked'} [props.layout]
 * @param {'xs'|'sm'|'md'|'lg'} [props.size] avatar size
 */
export function AuthorByline({
  name,
  avatarUrl,
  at,
  dateStyle = 'relative',
  readingMinutes,
  note,
  layout = 'inline',
  size,
}) {
  const date = at ? new Date(at) : null;
  const validDate = date && !Number.isNaN(date.getTime());
  const when = validDate
    ? dateStyle === 'absolute'
      ? format(date, 'd MMM yyyy')
      : formatDistanceToNow(date, { addSuffix: true })
    : null;

  const displayName = name || 'Anonymous';

  if (layout === 'stacked') {
    return (
      <Stacked>
        <Avatar src={avatarUrl} name={displayName} size={size ?? 'md'} />
        <Names>
          <Name>{displayName}</Name>
          <Meta>
            {note ?? (
              <>
                {when}
                {when && readingMinutes ? <Clock /> : null}
                {readingMinutes ? `${readingMinutes} min read` : null}
              </>
            )}
          </Meta>
        </Names>
      </Stacked>
    );
  }

  return (
    <Inline>
      <Avatar src={avatarUrl} name={displayName} size={size ?? 'xs'} />
      <span>{displayName}</span>
      {when && (
        <>
          <Dot>·</Dot>
          <span>{when}</span>
        </>
      )}
      {readingMinutes ? (
        <>
          <Dot>·</Dot>
          <span>{readingMinutes} min read</span>
        </>
      ) : null}
    </Inline>
  );
}
