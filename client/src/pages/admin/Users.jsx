import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { Shield, ChevronLeft, ChevronRight, Users as UsersIcon } from 'lucide-react';

import { userService } from '../../services/userService';
import { PageHeader, Section } from '../../components/layout/PageShell';
import { Button, Card, Badge, Table, Loading, EmptyState, Alert } from '../../components/ui';
import { text, media } from '../../styles/theme/mixins';
import { initial } from '../../utils/text';

/**
 * The account directory. Read-only, which the page now says outright — the previous version
 * was headed "User Management" and offered no action of any kind.
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

const Portrait = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radii.full};
  ${text('xs', 'semibold')}
  background: ${({ theme, $admin }) =>
    $admin ? theme.colors.warningContainer : theme.colors.accentContainer};
  color: ${({ theme, $admin }) => ($admin ? theme.colors.warningText : theme.colors.accentText)};
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

export function AdminUsers() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: () => userService.getAllUsers(page),
  });

  if (isLoading) return <Loading text="Loading the directory…" />;

  if (isError) {
    return (
      <>
        <PageHeader title="People" />
        <Alert variant="danger">
          The directory could not be loaded. This endpoint requires an administrator account.
        </Alert>
      </>
    );
  }

  const users = data?.data || [];
  const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };

  return (
    <>
      <PageHeader
        title="People"
        subtitle={`${pagination.total} ${pagination.total === 1 ? 'account' : 'accounts'} registered. This directory is read-only.`}
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
                </tr>
              </Table.Head>
              <Table.Body>
                {users.map((user) => {
                  const isUserAdmin = user.roles?.includes('admin');
                  return (
                    <tr key={user._id}>
                      <td>
                        <Person to={`/user/${user._id}`}>
                          <Portrait $admin={isUserAdmin}>{initial(user.username)}</Portrait>
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
                        </Roles>
                      </td>
                      <td>
                        {new Date(user.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
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
    </>
  );
}
