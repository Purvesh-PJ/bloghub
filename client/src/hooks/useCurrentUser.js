import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { avatarUrl } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { queryKeys } from '../services/queryKeys';

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
    queryKey: queryKeys.currentUser(),
    queryFn: userService.getUser,
    staleTime: 1000 * 60 * 5,
    // The endpoint requires a session. The header calls this hook on every page including
    // the public ones, so without this a signed-out visitor's landing page fired an
    // authenticated request and took a 401 on every load.
    enabled: isAuthenticated,
  });

  const account = data?.User;
  const profile = account?.profile;

  return {
    account,
    isLoading,
    /*
      A URL, not the image itself. getUser used to base64 the avatar into its own response —
      which this hook feeds to the header on every page — so a 2 MB picture became megabytes
      of JSON that no cache could hold onto. The bytes now come from their own endpoint,
      keyed on when the profile last changed.
    */
    avatarUrl: profile?.hasAvatar ? avatarUrl(account._id, profile.avatarUpdatedAt) : null,
    bio: profile?.bio ?? '',
  };
}
