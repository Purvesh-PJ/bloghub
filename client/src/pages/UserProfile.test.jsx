import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/*
  The public profile page.

  Two defects here made it show the wrong person entirely, and neither would have thrown:

    - it called `userService.getUser(userId)`, which ignores its argument and returns whoever
      the token belongs to, so every writer's page rendered the *viewer's* account and a
      signed-out reader clicking a byline took a 401;

    - the stories under it came from the global feed filtered by author in the browser, which
      only ever saw the first page of the whole site.

  The assertions below are written against the endpoints the page must call, because that is
  what distinguishes the fix from the bug — the rendered output looked plausible either way.
*/

const getPublicProfile = vi.fn();
const getPostsByAuthor = vi.fn();
const getPosts = vi.fn();
const getUser = vi.fn();
const isFollowing = vi.fn();
const followUser = vi.fn();
const unfollowUser = vi.fn();

vi.mock('../services/userService', () => ({
  userService: { getPublicProfile, getUser, isFollowing, followUser, unfollowUser },
}));

vi.mock('../services/postService', () => ({
  postService: { getPostsByAuthor, getPosts },
}));

const { renderWithProviders } = await import('../test/render');
const { UserProfile } = await import('./UserProfile');

const AUTHOR_ID = '507f1f77bcf86cd799439011';
const VIEWER_ID = '507f1f77bcf86cd799439012';

const profileFixture = (overrides = {}) => ({
  success: true,
  data: {
    _id: AUTHOR_ID,
    username: 'ada',
    bio: 'Writes about compilers.',
    fullName: 'Ada Lovelace',
    location: 'London',
    website: 'https://ada.example.com',
    socialLinks: { github: 'ada' },
    avatar: null,
    counts: { posts: 2, followers: 41, following: 7 },
    ...overrides,
  },
});

const postsFixture = (titles = ['First story', 'Second story']) => ({
  success: true,
  data: titles.map((title, index) => ({
    _id: `post-${index}`,
    title,
    content: 'Body text.',
    createdAt: new Date().toISOString(),
    user: { _id: AUTHOR_ID, username: 'ada' },
    tags: [],
    likes: [],
    comments: [],
  })),
  pagination: { total: titles.length, page: 1, limit: 12, pages: 1 },
});

const renderProfile = (user = null) =>
  renderWithProviders(<UserProfile />, {
    route: `/user/${AUTHOR_ID}`,
    path: '/user/:userId',
    user,
  });

beforeEach(() => {
  [
    getPublicProfile,
    getPostsByAuthor,
    getPosts,
    getUser,
    isFollowing,
    followUser,
    unfollowUser,
  ].forEach((fn) => fn.mockReset());

  getPublicProfile.mockResolvedValue(profileFixture());
  getPostsByAuthor.mockResolvedValue(postsFixture());
  isFollowing.mockResolvedValue({ success: true, isFollowing: false });
  followUser.mockResolvedValue({ success: true });
  unfollowUser.mockResolvedValue({ success: true });
});

describe('UserProfile', () => {
  it('asks for the person named in the URL, not for the signed-in account', async () => {
    renderProfile({ _id: VIEWER_ID, user_id: VIEWER_ID, username: 'someone-else' });

    await waitFor(() => expect(getPublicProfile).toHaveBeenCalledWith(AUTHOR_ID));
    // getUser is scoped to the token and would have returned the viewer.
    expect(getUser).not.toHaveBeenCalled();
  });

  it('renders that person’s details for a signed-out reader', async () => {
    renderProfile(null);

    expect(await screen.findByRole('heading', { name: 'ada' })).toBeInTheDocument();
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByText('Writes about compilers.')).toBeInTheDocument();
    expect(screen.getByText('London')).toBeInTheDocument();

    // The endpoint is public, so a visitor must not be sent to sign in for it.
    expect(getPublicProfile).toHaveBeenCalledWith(AUTHOR_ID);
  });

  it('shows the follower counts the server reports, not ones derived from a page of posts', async () => {
    renderProfile(null);

    expect(await screen.findByText('41')).toBeInTheDocument();
    expect(screen.getByText('followers')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('fetches the author’s stories by author id rather than filtering the global feed', async () => {
    renderProfile(null);

    await waitFor(() =>
      expect(getPostsByAuthor).toHaveBeenCalledWith(AUTHOR_ID, { page: 1, limit: 12 })
    );
    // The unfiltered feed would only ever contain this author's posts by coincidence.
    expect(getPosts).not.toHaveBeenCalled();
    expect(await screen.findByText('First story')).toBeInTheDocument();
  });

  it('offers Follow to a signed-in stranger and calls through on click', async () => {
    renderProfile({ _id: VIEWER_ID, user_id: VIEWER_ID, username: 'reader' });

    const button = await screen.findByRole('button', { name: /follow/i });
    await userEvent.click(button);

    await waitFor(() => expect(followUser).toHaveBeenCalledWith(AUTHOR_ID));
  });

  it('offers Unfollow when already following', async () => {
    isFollowing.mockResolvedValue({ success: true, isFollowing: true });
    renderProfile({ _id: VIEWER_ID, user_id: VIEWER_ID, username: 'reader' });

    const button = await screen.findByRole('button', { name: /following/i });
    await userEvent.click(button);

    await waitFor(() => expect(unfollowUser).toHaveBeenCalledWith(AUTHOR_ID));
  });

  it('offers Edit profile instead of Follow on your own page', async () => {
    renderWithProviders(<UserProfile />, {
      route: `/user/${AUTHOR_ID}`,
      path: '/user/:userId',
      user: { _id: AUTHOR_ID, user_id: AUTHOR_ID, username: 'ada' },
    });

    expect(await screen.findByRole('link', { name: /edit profile/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^follow$/i })).not.toBeInTheDocument();
    // Asking whether you follow yourself is meaningless, so the query stays disabled.
    expect(isFollowing).not.toHaveBeenCalled();
  });

  it('reports a deleted account rather than rendering an empty page', async () => {
    getPublicProfile.mockRejectedValue({ response: { status: 404 } });
    renderProfile(null);

    expect(await screen.findByText(/no such writer/i)).toBeInTheDocument();
    // A deleted account is not a transient failure, so there is nothing to retry.
    expect(screen.queryByRole('button', { name: /try again|retry/i })).not.toBeInTheDocument();
  });

  it('tells a reader nothing is published yet without claiming the writer does not exist', async () => {
    getPostsByAuthor.mockResolvedValue({
      success: true,
      data: [],
      pagination: { total: 0, page: 1, limit: 12, pages: 0 },
    });

    renderProfile(null);

    expect(await screen.findByRole('heading', { name: 'ada' })).toBeInTheDocument();
    expect(screen.getByText(/nothing here yet/i)).toBeInTheDocument();
  });
});
