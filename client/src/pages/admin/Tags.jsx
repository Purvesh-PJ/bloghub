import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { Plus, Hash, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { tagService } from '../../services/tagService';
import { useTags } from '../../hooks/useTags';
import { topicIcon } from '../../utils/topicIcons';
import { PageHeader, Section } from '../../components/layout/PageShell';
import {
  Button,
  Card,
  Input,
  Modal,
  Table,
  Loading,
  EmptyState,
  IconButton,
} from '../../components/ui';
import { text } from '../../styles/theme/mixins';
import { queryKeys } from '../../services/queryKeys';

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
  const [pendingDelete, setPendingDelete] = useState(null);

  const { tags, isLoading } = useTags();

  const createMutation = useMutation({
    mutationFn: tagService.createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });
      toast.success('Tag created');
      setName('');
      setOpen(false);
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Could not create that tag'),
  });

  /*
    Removing a tag.

    The console could create tags and never remove one, so a typo entered here stayed on the
    discovery rail permanently. The server refuses with a 409 while stories still carry the
    tag and says how many, which is the message surfaced below.
  */
  const deleteMutation = useMutation({
    mutationFn: (id) => tagService.deleteTag(id),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });
      setPendingDelete(null);
      toast.success(result?.message || 'Tag removed');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Could not remove that tag'),
  });

  const handleCreate = (event) => {
    event.preventDefault();
    const clean = name
      .trim()
      .toLowerCase()
      .replace(/^[#_-]+/, '');
    if (!clean) {
      toast.error('Give the tag a name');
      return;
    }
    createMutation.mutate(clean);
  };

  if (isLoading) return <Loading text="Loading tags…" />;

  return (
    <>
      <PageHeader
        badge="Taxonomy"
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
                  <th aria-label="Actions" />
                </tr>
              </Table.Head>
              <Table.Body>
                {tags.map((tag) => {
                  const Icon = topicIcon(tag.name);
                  return (
                    <tr key={tag._id || tag.name}>
                      <td>
                        <NameCell>
                          <Icon />#{tag.name}
                        </NameCell>
                      </td>
                      <td>{tag.postCount ?? tag.posts?.length ?? 0}</td>
                      <td style={{ textAlign: 'right' }}>
                        <IconButton
                          aria-label={`Remove the tag ${tag.name}`}
                          onClick={() => setPendingDelete(tag)}
                        >
                          <Trash2 />
                        </IconButton>
                      </td>
                    </tr>
                  );
                })}
              </Table.Body>
            </Table>
          </Card>
        )}
      </Section>

      <Modal
        open={Boolean(pendingDelete)}
        onOpenChange={(next) => !next && setPendingDelete(null)}
        title={`Remove #${pendingDelete?.name ?? ''}?`}
        description="Writers can create the tag again by using it on a story."
      >
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setPendingDelete(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteMutation.mutate(pendingDelete._id)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Removing…' : 'Remove'}
          </Button>
        </div>
      </Modal>

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
