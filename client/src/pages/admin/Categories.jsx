import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Flex,
  Heading,
  Text,
  Card,
  Table,
  Button,
  TextField,
  Dialog,
} from '@radix-ui/themes';
import { PlusIcon } from '@radix-ui/react-icons';
import toast from 'react-hot-toast';
import { categoryService } from '../../services/categoryService';
import { Loading } from '../../components/common/Loading';

export function AdminCategories() {
  const queryClient = useQueryClient();
  const [newCategory, setNewCategory] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
  });

  const createMutation = useMutation({
    mutationFn: categoryService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.success('Category created');
      setNewCategory('');
      setDialogOpen(false);
    },
    onError: () => toast.error('Failed to create category'),
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      toast.error('Category name is required');
      return;
    }
    createMutation.mutate(newCategory.trim());
  };

  if (isLoading) return <Loading text="Loading categories..." />;

  const categories = data?.data || [];

  return (
    <Box>
      <Flex justify="between" align="center" mb="6">
        <Heading size="7">Categories</Heading>
        <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
          <Dialog.Trigger>
            <Button>
              <PlusIcon /> New Category
            </Button>
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Create Category</Dialog.Title>
            <form onSubmit={handleCreate}>
              <Flex direction="column" gap="4" mt="4">
                <TextField.Root
                  placeholder="Category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <Flex gap="3" justify="end">
                  <Dialog.Close>
                    <Button variant="soft" color="gray">Cancel</Button>
                  </Dialog.Close>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? 'Creating...' : 'Create'}
                  </Button>
                </Flex>
              </Flex>
            </form>
          </Dialog.Content>
        </Dialog.Root>
      </Flex>

      <Card>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Posts Count</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {categories.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={2}>
                  <Text color="gray">No categories yet</Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              categories.map((cat) => (
                <Table.Row key={cat._id}>
                  <Table.Cell>
                    <Text weight="medium">{cat.name}</Text>
                  </Table.Cell>
                  <Table.Cell>{cat.posts?.length || 0}</Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Card>
    </Box>
  );
}
