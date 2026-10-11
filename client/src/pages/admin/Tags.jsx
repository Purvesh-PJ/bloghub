import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Hash, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { tagService } from '../../services/tagService';
import { useTags } from '../../hooks/useTags';
import { topicIcon } from '../../utils/topicIcons';
import { Section } from '../../components/layout/PageShell';
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
import { queryKeys } from '../../services/queryKeys';

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
      <Section>
        {tags.length === 0 ? (
          <EmptyState
            icon={Hash}
            title="No tags yet"
            actions={
              <Button onClick={() => setOpen(true)}>
                <Plus className="w-4 h-4 mr-1.5" /> Create the first one
              </Button>
            }
          >
            Tags help writers categorize stories and help readers discover relevant topics.
          </EmptyState>
        ) : (
          <>
            <div className="flex items-center justify-end gap-2 mb-4">
              <Button size="sm" onClick={() => setOpen(true)}>
                <Plus className="w-3.5 h-3.5 mr-1" /> New tag
              </Button>
            </div>

            <Card tone="low" radius="xl" padding="none" className="overflow-hidden">
              <Table>
                <Table.Head>
                  <tr>
                    <th className="pl-6">Topic / Tag</th>
                    <th>Published Stories</th>
                    <th aria-label="Actions" className="pr-6" />
                  </tr>
                </Table.Head>
                <Table.Body>
                  {tags.map((tag) => {
                    const Icon = topicIcon(tag.name);
                    return (
                      <tr key={tag._id || tag.name}>
                        <td className="pl-6">
                          <span className="inline-flex items-center gap-2.5 text-sm font-semibold text-[hsl(var(--foreground))]">
                            <Icon className="w-4 h-4 text-[hsl(var(--primary))]" />#{tag.name}
                          </span>
                        </td>
                        <td>{tag.postCount ?? tag.posts?.length ?? 0}</td>
                        <td className="text-right pr-6">
                          <IconButton
                            aria-label={`Remove the tag ${tag.name}`}
                            onClick={() => setPendingDelete(tag)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </IconButton>
                        </td>
                      </tr>
                    );
                  })}
                </Table.Body>
              </Table>
            </Card>
          </>
        )}
      </Section>

      <Modal
        open={Boolean(pendingDelete)}
        onOpenChange={(next) => !next && setPendingDelete(null)}
        title={`Remove #${pendingDelete?.name ?? ''}?`}
        description="Writers can create the tag again by using it on a story."
      >
        <Modal.Footer>
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
        </Modal.Footer>
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
          <div className="flex gap-2 justify-end mt-6">
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
