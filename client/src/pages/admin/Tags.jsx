import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { Plus, Hash } from 'lucide-react';
import toast from 'react-hot-toast';

import { tagService } from '../../services/tagService';
import { topicIcon } from '../../components/marketing/Topics';
import { PageHeader, Section } from '../../components/layout/PageShell';
import { Button, Card, Input, Modal, Table, Loading, EmptyState } from '../../components/ui';
import { text } from '../../styles/theme/mixins';

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

export function AdminTags() {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: tagService.getTags,
  });

  const createMutation = useMutation({
    mutationFn: tagService.createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success('Tag created');
      setName('');
      setOpen(false);
    },
    onError: () => toast.error('Could not create that tag'),
  });

  const handleCreate = (event) => {
    event.preventDefault();
    const clean = name.trim().toLowerCase().replace(/^[#_-]+/, '');
    if (!clean) {
      toast.error('Give the tag a name');
      return;
    }
    createMutation.mutate(clean);
  };

  if (isLoading) return <Loading text="Loading tags…" />;

  const tags = data?.data || [];

  return (
    <>
      <PageHeader
        title="Tags & Topics"
        subtitle="Dynamic topics and tags created by writers and readers across BlogHub."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus /> New tag
          </Button>
        }
      />

      <Section>
        {tags.length === 0 ? (
          <EmptyState
            icon={Hash}
            title="No tags yet"
            actions={
              <Button onClick={() => setOpen(true)}>
                <Plus /> Create the first one
              </Button>
            }
          >
            Tags help writers categorize stories and help readers discover relevant topics.
          </EmptyState>
        ) : (
          <Card tone="low" radius="xl" padding="sm">
            <Table>
              <Table.Head>
                <tr>
                  <th>Topic / Tag</th>
                  <th>Published Stories</th>
                </tr>
              </Table.Head>
              <Table.Body>
                {tags.map((tag) => {
                  const Icon = topicIcon(tag.name);
                  return (
                    <tr key={tag._id || tag.name}>
                      <td>
                        <NameCell>
                          <Icon />
                          #{tag.name}
                        </NameCell>
                      </td>
                      <td>{tag.postCount ?? tag.posts?.length ?? 0}</td>
                    </tr>
                  );
                })}
              </Table.Body>
            </Table>
          </Card>
        )}
      </Section>

      <Modal open={open} onOpenChange={setOpen} title="New tag / topic">
        <form onSubmit={handleCreate}>
          <Input
            label="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. react, design, ai"
            hint="Lowercase tag without hash; e.g. 'react', 'cloud', 'architecture'."
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
