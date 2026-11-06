import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '../../../components/ui';

const TONE = { public: 'success', draft: 'warning', private: 'neutral' };
const LABEL = { public: 'Published', draft: 'Draft', private: 'Private' };

const ago = (value) => {
  const date = value ? new Date(value) : null;
  return date && !isNaN(date.getTime()) ? formatDistanceToNow(date, { addSuffix: true }) : '—';
};

export const PostRef = ({ post }) =>
  post?._id ? (
    <Link
      to={`/post/${post._id}`}
      className="text-sm text-primary hover:underline line-clamp-1 max-w-[280px] no-underline block"
    >
      {post.title}
    </Link>
  ) : (
    <span className="text-sm text-muted-foreground italic">A deleted story</span>
  );

export function AuditLogRow({ row, tab }) {
  return (
    <tr>
      <td className="pl-6">
        <span className="text-sm font-semibold text-foreground">
          {row.user?.username || 'A signed-out visitor'}
        </span>
      </td>

      <td>
        {tab === 'comments' ? (
          <span className="text-sm text-muted-foreground line-clamp-2 max-w-[420px] block">
            {row.message}
          </span>
        ) : tab === 'posts' || tab === 'edits' ? (
          <PostRef post={row} />
        ) : (
          <PostRef post={row.post} />
        )}
      </td>

      {tab === 'comments' && (
        <td>
          <PostRef post={row.post} />
        </td>
      )}

      {(tab === 'posts' || tab === 'edits') && (
        <td>
          <Badge variant={TONE[row.visibility] || 'neutral'}>
            {LABEL[row.visibility] || row.visibility}
          </Badge>
        </td>
      )}

      <td className="pr-6">
        <span className="text-xs text-muted-foreground whitespace-nowrap tabular-nums">
          {ago(tab === 'edits' ? row.updatedAt : row.createdAt)}
        </span>
      </td>
    </tr>
  );
}

