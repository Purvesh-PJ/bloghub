import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users as UsersIcon } from 'lucide-react';
import toast from 'react-hot-toast';

import { userService } from '../../users/services/userService';
import { useAuth } from '../../../features/auth';
import { Section } from '../../../components/layout/PageShell';
import { EmptyState, ErrorState, Input, TableSkeleton } from '../../../components/ui';
import { ConfirmDialog } from '../../../components/shared';
import { AdminUsersTable } from '../components/AdminUsersTable';
import { queryKeys } from '../../../config/queryKeys';

export function AdminUsers() {
  const queryClient = useQueryClient();
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
    return <TableSkeleton rows={6} hasAvatar hasBadge />;
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
          <AdminUsersTable
            users={users}
            myId={myId}
            onSuspend={(id, suspended) => suspendMutation.mutate({ id, suspended })}
            onRoleChange={(id, admin) => roleMutation.mutate({ id, admin })}
            onDelete={setPendingDelete}
            pagination={pagination}
            onPageChange={setPage}
          />
        )}
      </Section>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setPendingDelete(null);
            setPassword('');
          }
        }}
        title={`Delete ${pendingDelete?.username}?`}
        description="Their account, stories, and the comments and likes on them are removed permanently. Suspending is reversible; this is not."
        confirmText="Delete permanently"
        confirmVariant="danger"
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (!password) return toast.error('Enter your password to confirm');
          deleteMutation.mutate({ id: pendingDelete._id, password });
        }}
      >
        <div className="my-2">
          <Input
            label="Confirm with your own password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            hint="Holding an admin session is not by itself authority to destroy an account."
          />
        </div>
      </ConfirmDialog>
    </>
  );
}
