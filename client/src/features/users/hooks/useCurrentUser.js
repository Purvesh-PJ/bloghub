import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { avatarUrl } from '../../../config/api';
import { useAuth } from '../../../features/auth';
import { queryKeys } from '../../../config/queryKeys';

/**
 * The signed-in account as the server knows it.
 */
export function useCurrentUser() {
  const { isAuthenticated } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.currentUser(),
    queryFn: userService.getUser,
    staleTime: 1000 * 60 * 5,
    enabled: isAuthenticated,
  });

  const account = data?.User;
  const profile = account?.profile;

  return {
    account,
    isLoading,
    avatarUrl: profile?.hasAvatar ? avatarUrl(account._id, profile.avatarUpdatedAt) : null,
    bio: profile?.bio ?? '',
  };
}
