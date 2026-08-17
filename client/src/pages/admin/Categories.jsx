import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { Plus, FolderOpen } from 'lucide-react';
import toast from 'react-hot-toast';

import { categoryService } from '../../services/categoryService';
import { topicIcon } from '../../components/marketing/Topics';
import { PageHeader, Section } from '../../components/layout/PageShell';
import { Button, Card, Input, Modal, Table, Loading, EmptyState } from '../../components/ui';
import { text } from '../../styles/theme/mixins';

/**
 * Topics.
 *
 * The same list as before on the shared primitives, plus the icon each topic actually gets
 * on the landing page — so an administrator adding one can see how it will appear rather
 * than finding out later.
 */

const NameCell = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  ${text('sm', 'semibold')}
  color: ${({ theme }) => theme.colors.textPrimary};

  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.accentText};
  }
`;

export function AdminCategories() {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories({ withEmpty: true }),
  });

  const createMutation = useMutation({
    mutationFn: categoryService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Topic created');
      setName('');
      setOpen(false);
    },
    onError: () => toast.error('Could not create that topic'),
  });

  const handleCreate = (event) => {
    event.preventDefault();
    if (!name.trim()) {
      toast.error('Give the topic a name');
      return;
    }
    createMutation.mutate(name.trim());
  };

  if (isLoading) return <Loading text="Loading topics…" />;

  const categories = data?.data || [];

  return (
    <>
      <PageHeader
        title="Topics"
        subtitle="What people can file a post under. These drive the landing page and the browse view."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus /> New topic
          </Button>
        }
      />

      <Section>
        {categories.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="No topics yet"
            actions={
              <Button onClick={() => setOpen(true)}>
                <Plus /> Create the first one
              </Button>
            }
          >
            A post has to be filed under something. Add a few broad topics and writers can pick from
            them.
          </EmptyState>
        ) : (
          <Card tone="low" radius="xl" padding="sm">
            <Table>
              <Table.Head>
                <tr>
                  <th>Topic</th>
                  <th>Posts</th>
                </tr>
              </Table.Head>
              <Table.Body>
                {categories.map((category) => {
                  const Icon = topicIcon(category.name);
                  return (
                    <tr key={category._id}>
                      <td>
                        <NameCell>
                          <Icon />
                          {category.name}
                        </NameCell>
                      </td>
                      <td>{category.posts?.length || 0}</td>
                    </tr>
                  );
                })}
              </Table.Body>
            </Table>
          </Card>
        )}
      </Section>

      <Modal open={open} onOpenChange={setOpen} title="New topic">
        <form onSubmit={handleCreate}>
          <Input
            label="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Photography"
            hint="Known names get their own icon; anything else falls back to a globe."
            autoFocus
          />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 24 }}>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={createMutation.isPending}>
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
