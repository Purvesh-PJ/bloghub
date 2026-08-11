import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Heading, Text, Card, Table, Avatar, Badge, Flex, Button } from '@radix-ui/themes';
import { Users as UsersIcon, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { userService } from '../../services/userService';
import { Loading } from '../../components/ui';

export function AdminUsers() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: () => userService.getAllUsers(page),
  });

  const users = data?.data || [];
  const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };

  if (isLoading) return <Loading text="Loading user directory..." />;

  if (isError) {
    return (
      <Card>
        <Text color="red">Failed to load users. Ensure you have admin privileges.</Text>
      </Card>
    );
  }

  return (
    <Box>
      <Flex align="center" justify="between" mb="6">
        <Box>
          <Heading size="7" mb="1">
            User Management
          </Heading>
          <Text size="2" color="gray">
            View and manage registered platform accounts ({pagination.total} total)
          </Text>
        </Box>
      </Flex>

      <Card size="2">
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>User</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Roles</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Joined Date</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {users.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={4}>
                  <Flex align="center" justify="center" p="4">
                    <Text color="gray">No users found.</Text>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ) : (
              users.map((user) => {
                const isUserAdmin = user.roles?.includes('admin');
                return (
                  <Table.Row key={user._id}>
                    <Table.RowHeaderCell>
                      <Flex align="center" gap="3">
                        <Avatar
                          size="2"
                          fallback={user.username?.[0]?.toUpperCase() || 'U'}
                          radius="full"
                          color={isUserAdmin ? 'amber' : 'indigo'}
                        />
                        <Text weight="medium">{user.username}</Text>
                      </Flex>
                    </Table.RowHeaderCell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>
                      <Flex gap="1">
                        {user.roles?.map((role) => (
                          <Badge
                            key={role}
                            color={role === 'admin' ? 'red' : 'blue'}
                            variant="soft"
                            radius="full"
                          >
                            {role === 'admin' && <Shield size={12} style={{ marginRight: 3 }} />}
                            {role}
                          </Badge>
                        ))}
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>
                      {new Date(user.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Table.Cell>
                  </Table.Row>
                );
              })
            )}
          </Table.Body>
        </Table.Root>

        {pagination.pages > 1 && (
          <Flex align="center" justify="between" pt="4" px="2">
            <Text size="2" color="gray">
              Page {pagination.page} of {pagination.pages}
            </Text>
            <Flex gap="2">
              <Button
                variant="soft"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
              >
                <ChevronLeft size={16} /> Previous
              </Button>
              <Button
                variant="soft"
                disabled={page >= pagination.pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next <ChevronRight size={16} />
              </Button>
            </Flex>
          </Flex>
        )}
      </Card>
    </Box>
  );
}
