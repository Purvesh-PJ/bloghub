import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  ShieldOff,
  MoreHorizontal,
  Ban,
  CircleCheck,
  Trash2,
  Activity,
} from 'lucide-react';
import {
  Button,
  Card,
  Badge,
  Table,
  DropdownMenu,
  Avatar,
  Pagination,
} from '../../../components/ui';

export function AdminUsersTable({
  users = [],
  myId,
  onSuspend,
  onRoleChange,
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
            <th className="pl-6">Person</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Joined</th>
            <th aria-label="Actions" className="pr-6" />
          </tr>
        </Table.Head>
        <Table.Body>
          {users.map((user) => {
            const isUserAdmin = user.roles?.includes('admin');
            const isSelf = String(user._id) === String(myId);

            return (
              <tr key={user._id}>
                <td className="pl-6">
                  <Link
                    to={`/user/${user._id}`}
                    className="inline-flex items-center gap-3 text-sm font-semibold text-foreground hover:text-primary transition-colors no-underline"
                  >
                    <Avatar name={user.username} size="sm" />
                    <span>{user.username}</span>
                  </Link>
                </td>
                <td>{user.email}</td>
                <td>
                  <div className="flex gap-1.5 flex-wrap">
                    {user.roles?.map((role) => (
                      <Badge key={role} variant={role === 'admin' ? 'warning' : 'neutral'}>
                        {role === 'admin' && <Shield className="w-3 h-3 mr-1 inline" />}
                        {role}
                      </Badge>
                    ))}
                    {user.suspended && <Badge variant="danger">suspended</Badge>}
                  </div>
                </td>
                <td>
                  {new Date(user.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td className="text-right pr-6">
                  {isSelf ? (
                    <span className="text-xs text-muted-foreground">You</span>
                  ) : (
                    <DropdownMenu
                      trigger={
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`Actions for ${user.username}`}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      }
                    >
                      <DropdownMenu.Item
                        onSelect={() => navigate(`/admin/users/${user._id}/activity`)}
                      >
                        <Activity className="w-3.5 h-3.5 mr-2" /> View activity
                      </DropdownMenu.Item>

                      <DropdownMenu.Separator />

                      {user.suspended ? (
                        <DropdownMenu.Item onSelect={() => onSuspend(user._id, false)}>
                          <CircleCheck className="w-3.5 h-3.5 mr-2 text-emerald-500" /> Restore
                          access
                        </DropdownMenu.Item>
                      ) : (
                        <DropdownMenu.Item onSelect={() => onSuspend(user._id, true)}>
                          <Ban className="w-3.5 h-3.5 mr-2 text-amber-500" /> Suspend account
                        </DropdownMenu.Item>
                      )}

                      <DropdownMenu.Separator />
                      <DropdownMenu.Label>Role</DropdownMenu.Label>

                      {isUserAdmin ? (
                        <DropdownMenu.Item onSelect={() => onRoleChange(user._id, false)}>
                          <ShieldOff className="w-3.5 h-3.5 mr-2" /> Revoke administrator
                        </DropdownMenu.Item>
                      ) : (
                        <DropdownMenu.Item onSelect={() => onRoleChange(user._id, true)}>
                          <Shield className="w-3.5 h-3.5 mr-2" /> Make administrator
                        </DropdownMenu.Item>
                      )}

                      <DropdownMenu.Separator />

                      <DropdownMenu.Item tone="danger" onSelect={() => onDelete(user)}>
                        <Trash2 className="w-3.5 h-3.5 mr-2 text-red-500" /> Delete account
                      </DropdownMenu.Item>
                    </DropdownMenu>
                  )}
                </td>
              </tr>
            );
          })}
        </Table.Body>
      </Table>

      <Pagination
        page={pagination.page}
        pages={pagination.pages}
        total={pagination.total}
        noun="accounts"
        onChange={onPageChange}
      />
    </Card>
  );
}
