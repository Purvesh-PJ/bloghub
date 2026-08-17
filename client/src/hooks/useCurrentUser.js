import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';

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
  const { isAuthenticated } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: userService.getUser,
    staleTime: 1000 * 60 * 5,
    // The endpoint requires a session. The header calls this hook on every page including
    // the public ones, so without this a signed-out visitor's landing page fired an
    // authenticated request and took a 401 on every load.
    enabled: isAuthenticated,
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
