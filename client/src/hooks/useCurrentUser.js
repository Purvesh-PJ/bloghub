import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/userService';

/**
 * The signed-in account as the server knows it.
 *
 * The auth context holds only what sign-in returned — user_id, username, email and roles —
 * so anything reading `user.bio` or expecting an avatar from it got undefined. The dashboard
 * banner did exactly that, which is why its "personalised" line always showed the same
 * generic sentence, and why the workspace only ever drew initials even after the avatar
 * upload started working.
 *
 * Shared so the layout and the dashboard read one cached copy rather than each fetching
 * their own, and Settings can invalidate it after a save.
 */
export function useCurrentUser() {
  const { data, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: userService.getUser,
    staleTime: 1000 * 60 * 5,
  });

  const account = data?.User;

  return {
    account,
    isLoading,
    // getUser renders the stored avatar as a data URI; null when none has been uploaded.
    avatarUrl: account?.profile?.image?.data ?? null,
    bio: account?.profile?.bio ?? '',
  };
}
