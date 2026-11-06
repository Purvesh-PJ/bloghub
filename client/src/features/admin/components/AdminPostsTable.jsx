import { Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import { Card, Table, Badge, DropdownMenu, Pagination } from '../../../components/ui';

const TONE = { public: 'success', draft: 'warning', private: 'neutral' };
const LABEL = { public: 'Published', draft: 'Draft', private: 'Private' };

export function AdminPostsTable({
  visible = [],
  selectedIds = [],
  onToggleSelected,
  allVisibleSelected,
  onToggleSelectAll,
  onDelete,
  pagination,
  onPageChange,
}) {
  const navigate = useNavigate();

  return (
    <Card tone="low" radius="xl" padding="none" className="overflow-hidden">
      <Table>
        <Table.Head>
          <tr>
            <th className="w-10 pl-6">
              <input
                type="checkbox"
                checked={allVisibleSelected}
                onChange={onToggleSelectAll}
                aria-label={
                  allVisibleSelected ? 'Clear this page' : 'Select every story on this page'
                }
                className="w-4 h-4 rounded accent-primary cursor-pointer"
              />
            </th>
            <th>Title</th>
            <th>Author</th>
            <th>Status</th>
            <th>Engagement</th>
            <th>Created</th>
            <th aria-label="Actions" className="pr-6" />
          </tr>
        </Table.Head>
        <Table.Body>
          {visible.map((post) => (
            <tr key={post._id}>
              <td className="pl-6">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(post._id)}
                  onChange={() => onToggleSelected(post._id)}
                  aria-label={`Select ${post.title}`}
                  className="w-4 h-4 rounded accent-primary cursor-pointer"
                />
              </td>
              <td>
                <Link
                  to={`/post/${post._id}`}
                  className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-1 max-w-[320px] no-underline block"
                >
                  {post.title}
                </Link>
              </td>
              <td>{post.user?.username || 'Unknown'}</td>
              <td>
                <Badge variant={TONE[post.visibility] || 'neutral'}>
                  {LABEL[post.visibility] || post.visibility}
                </Badge>
              </td>
              <td>
                {post.likes?.length || 0} likes · {post.comments?.length || 0} replies
              </td>
              <td>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</td>
              <td className="text-right pr-6">
                <DropdownMenu
                  trigger={
                    <button
                      type="button"
                      aria-label={`Actions for ${post.title}`}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  }
                >
                  <DropdownMenu.Item onSelect={() => navigate(`/post/${post._id}`)}>
                    <Eye className="w-3.5 h-3.5 mr-2" /> View
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onSelect={() => navigate(`/edit/${post._id}`)}>
                    <Pencil className="w-3.5 h-3.5 mr-2" /> Edit
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item tone="danger" onSelect={() => onDelete(post)}>
                    <Trash2 className="w-3.5 h-3.5 mr-2 text-red-500" /> Delete
                  </DropdownMenu.Item>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </Table.Body>
      </Table>

      {pagination && (
        <Pagination
          page={pagination.page}
          pages={pagination.pages}
          total={pagination.total}
          noun="stories"
          onChange={onPageChange}
        />
      )}
    </Card>
  );
}

