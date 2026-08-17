import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import {
  Shield,
  ShieldOff,
  ChevronLeft,
  ChevronRight,
  Users as UsersIcon,
  MoreHorizontal,
  Ban,
  CircleCheck,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { PageHeader, Section } from '../../components/layout/PageShell';
import {
  Button,
  Card,
  Badge,
  Table,
  Loading,
  EmptyState,
  ErrorState,
  DropdownMenu,
  Modal,
  Input,
  Skeleton,
  SkeletonText,
  Avatar,
} from '../../components/ui';
import { text, media } from '../../styles/theme/mixins';

/**
 * The account directory, and the actions an administrator can take on one.
 *
 * It was read-only — a table headed "User Management" that managed nothing. The three things
 * it can do now are deliberately different in weight:
 *
 *   suspend  reversible, keeps everything, ends the person's sessions at once
 *   role     grants or revokes the console itself
 *   delete   permanent, takes their stories with it, and asks for your own password
 */

const Person = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  ${text('sm', 'semibold')}
  color: ${({ theme }) => theme.colors.textPrimary};

  &:hover {
    color: ${({ theme }) => theme.colors.accentText};
  }
`;

const Roles = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
`;

const Pager = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.lineSubtle};

  ${media.down('sm')`flex-direction: column;`}
`;

const PageCount = styled.span`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textMuted};
  font-variant-numeric: tabular-nums;
`;

const Quiet = styled.span`
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};
`;

export function AdminUsers() {
  const queryClient = useQueryClient();
  const { user: me } = useAuth();
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [password, setPassword] = useState('');

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: () => userService.getAllUsers(page),
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['admin-users'] });

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
        <PageHeader title="People" subtitle="Loading directory…" />
        <Card tone="low" radius="xl" style={{ padding: 20 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                <Skeleton $variant="circle" $width={36} $height={36} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                  <Skeleton $width="35%" $height={15} $radius="xs" />
                  <Skeleton $width="20%" $height={12} $radius="xs" />
                </div>
              </div>
              <Skeleton $width={60} $height={24} $radius="pill" />
            </div>
          ))}
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <>
        <PageHeader title="People" />
        <ErrorState title="The directory did not load" error={error} onRetry={() => refetch()} />
      </>
    );
  }

  const users = data?.data || [];
  const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };
  const myId = me?._id || me?.user_id;

  return (
    <>
      <PageHeader
        title="People"
        subtitle={`${pagination.total} ${pagination.total === 1 ? 'account' : 'accounts'} registered.`}
      />

      <Section>
        {users.length === 0 ? (
          <EmptyState icon={UsersIcon} title="Nobody here yet">
            Accounts appear here as people register.
          </EmptyState>
        ) : (
          <Card tone="low" radius="xl" padding="sm">
            <Table>
              <Table.Head>
                <tr>
                  <th>Person</th>
                  <th>Email</th>
                  <th>Roles</th>
                  <th>Joined</th>
                  <th aria-label="Actions" />
                </tr>
              </Table.Head>
              <Table.Body>
                {users.map((user) => {
                  const isUserAdmin = user.roles?.includes('admin');
                  // Your own row is read-only here; settings is where you change your account.
                  const isSelf = String(user._id) === String(myId);

                  return (
                    <tr key={user._id}>
                      <td>
                        <Person to={`/user/${user._id}`}>
                          <Avatar name={user.username} size="sm" />
                          {user.username}
                        </Person>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <Roles>
                          {user.roles?.map((role) => (
                            <Badge key={role} variant={role === 'admin' ? 'warning' : 'neutral'}>
                              {role === 'admin' && <Shield />}
                              {role}
                            </Badge>
                          ))}
                          {user.suspended && <Badge variant="danger">suspended</Badge>}
                        </Roles>
                      </td>
                      <td>
                        {new Date(user.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {isSelf ? (
                          <Quiet>You</Quiet>
                        ) : (
                          <DropdownMenu
                            trigger={
                              <Button
                                variant="ghost"
                                size="sm"
                                aria-label={`Actions for ${user.username}`}
                              >
                                <MoreHorizontal size={16} />
                              </Button>
                            }
                          >
                            {user.suspended ? (
                              <DropdownMenu.Item
                                onSelect={() =>
                                  suspendMutation.mutate({ id: user._id, suspended: false })
                                }
                              >
                                <CircleCheck size={14} /> Restore access
                              </DropdownMenu.Item>
                            ) : (
                              <DropdownMenu.Item
                                onSelect={() =>
                                  suspendMutation.mutate({ id: user._id, suspended: true })
                                }
                              >
                                <Ban size={14} /> Suspend account
                              </DropdownMenu.Item>
                            )}

                            <DropdownMenu.Separator />
                            <DropdownMenu.Label>Role</DropdownMenu.Label>

                            {isUserAdmin ? (
                              <DropdownMenu.Item
                                onSelect={() => roleMutation.mutate({ id: user._id, admin: false })}
                              >
                                <ShieldOff size={14} /> Revoke administrator
                              </DropdownMenu.Item>
                            ) : (
                              <DropdownMenu.Item
                                onSelect={() => roleMutation.mutate({ id: user._id, admin: true })}
                              >
                                <Shield size={14} /> Make administrator
                              </DropdownMenu.Item>
                            )}

                            <DropdownMenu.Separator />

                            <DropdownMenu.Item
                              $tone="danger"
                              onSelect={() => setPendingDelete(user)}
                            >
                              <Trash2 size={14} /> Delete account
                            </DropdownMenu.Item>
                          </DropdownMenu>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </Table.Body>
            </Table>

            {pagination.pages > 1 && (
              <Pager>
                <PageCount>
                  Page {pagination.page} of {pagination.pages}
                </PageCount>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((current) => Math.max(current - 1, 1))}
                  >
                    <ChevronLeft /> Previous
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page >= pagination.pages}
                    onClick={() => setPage((current) => current + 1)}
                  >
                    Next <ChevronRight />
                  </Button>
                </div>
              </Pager>
            )}
          </Card>
        )}
      </Section>

      <Modal
        open={!!pendingDelete}
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
        >
          <Input
            label="Confirm with your own password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            hint="Holding an admin session is not by itself authority to destroy an account."
          />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
            <Button type="button" variant="secondary" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Deleting…' : 'Delete permanently'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
