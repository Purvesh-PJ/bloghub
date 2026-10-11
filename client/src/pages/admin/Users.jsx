import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Shield,
  ShieldOff,
  Users as UsersIcon,
  MoreHorizontal,
  Ban,
  CircleCheck,
  Trash2,
  Activity,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { Section } from '../../components/layout/PageShell';
import {
  Button,
  Card,
  Badge,
  Table,
  EmptyState,
  ErrorState,
  DropdownMenu,
  Modal,
  Input,
  Skeleton,
  Avatar,
  Pagination,
} from '../../components/ui';
import { queryKeys } from '../../services/queryKeys';

export function AdminUsers() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user: me } = useAuth();
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [password, setPassword] = useState('');

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.admin.users(page),
    queryFn: () => userService.getAllUsers(page),
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.users() });

  const suspendMutation = useMutation({
    mutationFn: ({ id, suspended }) => userService.setUserSuspended(id, suspended),
    onSuccess: (response) => {
      refresh();
      toast.success(response?.message || 'Updated');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Could not update that account'),
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, admin }) => userService.setUserRole(id, admin),
    onSuccess: (response) => {
      refresh();
      toast.success(response?.message || 'Updated');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Could not change that role'),
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id, password: secret }) => userService.deleteUser(id, secret),
    onSuccess: (response) => {
      refresh();
      setPendingDelete(null);
      setPassword('');
      toast.success(response?.message || 'Account deleted');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Could not delete that account'),
  });

  if (isLoading) {
    return (
      <div aria-hidden="true">
        <Card tone="low" radius="xl" padding="lg">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 border-b border-[hsl(var(--border))/0.4] last:border-b-0"
            >
              <div className="flex items-center gap-3 flex-1">
                <Skeleton variant="circle" width={36} height={36} />
                <div className="flex flex-col gap-1 flex-1">
                  <Skeleton width="35%" height={15} className="rounded" />
                  <Skeleton width="20%" height={12} className="rounded" />
                </div>
              </div>
              <Skeleton width={60} height={24} className="rounded-full" />
            </div>
          ))}
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState title="The directory did not load" error={error} onRetry={() => refetch()} />
    );
  }

  const users = data?.data || [];
  const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };
  const myId = me?._id || me?.user_id;

  return (
    <>
      <Section>
        {users.length === 0 ? (
          <EmptyState icon={UsersIcon} title="Nobody here yet">
            Accounts appear here as people register.
          </EmptyState>
        ) : (
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
                          className="inline-flex items-center gap-3 text-sm font-semibold text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))] transition-colors no-underline"
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
                          <span className="text-xs text-[hsl(var(--muted-foreground))]">You</span>
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
                              <DropdownMenu.Item
                                onSelect={() =>
                                  suspendMutation.mutate({ id: user._id, suspended: false })
                                }
                              >
                                <CircleCheck className="w-3.5 h-3.5 mr-2 text-emerald-500" /> Restore access
                              </DropdownMenu.Item>
                            ) : (
                              <DropdownMenu.Item
                                onSelect={() =>
                                  suspendMutation.mutate({ id: user._id, suspended: true })
                                }
                              >
                                <Ban className="w-3.5 h-3.5 mr-2 text-amber-500" /> Suspend account
                              </DropdownMenu.Item>
                            )}

                            <DropdownMenu.Separator />
                            <DropdownMenu.Label>Role</DropdownMenu.Label>

                            {isUserAdmin ? (
                              <DropdownMenu.Item
                                onSelect={() => roleMutation.mutate({ id: user._id, admin: false })}
                              >
                                <ShieldOff className="w-3.5 h-3.5 mr-2" /> Revoke administrator
                              </DropdownMenu.Item>
                            ) : (
                              <DropdownMenu.Item
                                onSelect={() => roleMutation.mutate({ id: user._id, admin: true })}
                              >
                                <Shield className="w-3.5 h-3.5 mr-2" /> Make administrator
                              </DropdownMenu.Item>
                            )}

                            <DropdownMenu.Separator />

                            <DropdownMenu.Item
                              tone="danger"
                              onSelect={() => setPendingDelete(user)}
                            >
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
              onChange={setPage}
            />
          </Card>
        )}
      </Section>

      <Modal
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setPendingDelete(null);
            setPassword('');
          }
        }}
        title={`Delete ${pendingDelete?.username}?`}
        description="Their account, stories, and the comments and likes on them are removed permanently. Suspending is reversible; this is not."
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!password) return toast.error('Enter your password to confirm');
            deleteMutation.mutate({ id: pendingDelete._id, password });
          }}
          className="flex flex-col gap-4"
        >
          <Input
            label="Confirm with your own password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            hint="Holding an admin session is not by itself authority to destroy an account."
          />
          <Modal.Footer>
            <Button type="button" variant="secondary" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Deleting…' : 'Delete permanently'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
