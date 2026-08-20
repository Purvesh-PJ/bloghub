import { useQuery } from '@tanstack/react-query';
import { tagService } from '../services/tagService';
import { queryKeys } from '../services/queryKeys';

/**
 * The topic taxonomy, with a published post count on each tag.
 *
 * The same `useQuery` was written out in five files — the landing page, search, the editor,
 * the footer and the admin console — each with its own idea of how long the answer stays
 * fresh. They shared a cache key by coincidence rather than by design, so changing the policy
 * meant finding all five.
 *
 * The server already sorts by post count descending, so `popular` is a slice rather than a
 * re-sort.
 *
 * @param {object} [options]
 * @param {boolean} [options.withPostsOnly] drop tags nothing published carries. A tag exists
 *   as soon as any story uses it, drafts included, so an unfiltered list can offer a reader
 *   topics they cannot then find a single piece about.
 */
export function useTags({ withPostsOnly = false } = {}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.tags.all,
    queryFn: tagService.getTags,
    // The taxonomy changes when somebody publishes, not between clicks.
    staleTime: 1000 * 60 * 10,
  });

  const all = data?.data ?? [];
  const tags = withPostsOnly ? all.filter((tag) => (tag.postCount ?? 0) > 0) : all;

  return {
    tags,
    /** Just the names, for the places that render a plain list. */
    names: tags.map((tag) => tag.name).filter(Boolean),
    isLoading,
    isError,
  };
}
