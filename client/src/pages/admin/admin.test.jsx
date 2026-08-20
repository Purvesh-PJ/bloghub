import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/*
  The administration console, screen by screen.

  These are the screens whose controls act on other people's accounts and content, so "it
  renders" is not the interesting claim — what matters is that every control reaches the
  endpoint it says it does, with the arguments it says it does. A suspend button that renders
  and calls nothing looks identical to one that works.

  Every service is mocked at the module boundary: the assertions are about what the screen
  asks for, which is the half that was broken or missing.
*/

const postService = {
  getAllPosts: vi.fn(),
  deletePost: vi.fn(),
  bulkUpdate: vi.fn(),
};

const userService = {
  getAllUsers: vi.fn(),
  setUserSuspended: vi.fn(),
  setUserRole: vi.fn(),
  deleteUser: vi.fn(),
};

const tagService = {
  getTags: vi.fn(),
  createTag: vi.fn(),
  deleteTag: vi.fn(),
};

const analyticsService = {
  getAdminAnalytics: vi.fn(),
  getUserAnalytics: vi.fn(),
};

const activityService = {
  getAllActivity: vi.fn(),
  getModerationLog: vi.fn(),
  getUserActivity: vi.fn(),
  getUserTimeline: vi.fn(),
};

vi.mock('../../services/postService', () => ({ postService }));
vi.mock('../../services/userService', () => ({ userService }));
vi.mock('../../services/tagService', () => ({ tagService }));
vi.mock('../../services/analyticsService', () => ({ analyticsService }));
vi.mock('../../services/activityService', () => ({ activityService }));

const { renderWithProviders } = await import('../../test/render');
const { AdminDashboard } = await import('./Dashboard');
const { AdminPosts } = await import('./Posts');
const { AdminTags } = await import('./Tags');
const { AdminUsers } = await import('./Users');
const { AdminActivity } = await import('./Activity');
const { AdminPersonActivity } = await import('./PersonActivity');

const ADMIN_ID = '507f1f77bcf86cd799439001';
const OTHER_ID = '507f1f77bcf86cd799439002';
const POST_ID = '507f1f77bcf86cd799439010';
const TAG_ID = '507f1f77bcf86cd799439020';

const admin = { _id: ADMIN_ID, user_id: ADMIN_ID, username: 'root', roles: ['user', 'admin'] };

const postsPage = (overrides = {}) => ({
  success: true,
  data: [
    {
      _id: POST_ID,
      title: 'A published story',
      visibility: 'public',
      createdAt: new Date().toISOString(),
      user: { _id: OTHER_ID, username: 'writer' },
      likes: [],
      comments: [],
    },
  ],
  pagination: { total: 1, page: 1, limit: 20, pages: 1 },
  counts: { all: 3, public: 1, draft: 1, private: 1 },
  ...overrides,
});

const usersPage = () => ({
  success: true,
  data: [
    {
      _id: OTHER_ID,
      username: 'writer',
      email: 'writer@example.com',
      roles: ['user'],
      suspended: false,
      createdAt: new Date().toISOString(),
    },
    { ...admin, email: 'root@example.com', createdAt: new Date().toISOString() },
  ],
  pagination: { total: 2, page: 1, limit: 10, pages: 1 },
});

beforeEach(() => {
  vi.clearAllMocks();

  postService.getAllPosts.mockResolvedValue(postsPage());
  postService.deletePost.mockResolvedValue({ success: true });
  postService.bulkUpdate.mockResolvedValue({ success: true, message: '1 story updated' });

  userService.getAllUsers.mockResolvedValue(usersPage());
  userService.setUserSuspended.mockResolvedValue({ success: true });
  userService.setUserRole.mockResolvedValue({ success: true });
  userService.deleteUser.mockResolvedValue({ success: true });

  tagService.getTags.mockResolvedValue({
    success: true,
    data: [{ _id: TAG_ID, name: 'react', postCount: 4 }],
  });
  tagService.createTag.mockResolvedValue({ success: true });
  tagService.deleteTag.mockResolvedValue({ success: true, message: '“react” removed' });

  analyticsService.getAdminAnalytics.mockResolvedValue({
    success: true,
    data: {
      totalPosts: 3,
      publishedPosts: 1,
      totalUsers: 2,
      totalViews: 40,
      totalReads: 10,
      readRate: 25,
      topPosts: [{ _id: POST_ID, title: 'A published story', viewCount: 40 }],
      topUsers: [{ _id: OTHER_ID, username: 'writer', postCount: 3 }],
      recentViews: [],
    },
  });
  analyticsService.getUserAnalytics.mockResolvedValue({
    success: true,
    data: { totalViews: 40, totalReads: 10, readRate: 25, postsAnalytics: [], topPosts: [] },
  });

  activityService.getAllActivity.mockResolvedValue({
    success: true,
    data: {
      activeUsers: 7,
      posts: { data: [], total: 3, page: 1, limit: 20, totalPages: 1 },
      comments: {
        data: [
          {
            _id: 'c1',
            message: 'Good piece',
            createdAt: new Date().toISOString(),
            user: { _id: OTHER_ID, username: 'writer' },
            post: { _id: POST_ID, title: 'A published story' },
          },
        ],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      },
      likes: { data: [], total: 5, page: 1, limit: 20, totalPages: 1 },
      views: { data: [], total: 40, page: 1, limit: 20, totalPages: 1 },
    },
  });
  activityService.getModerationLog.mockResolvedValue({
    success: true,
    data: [],
    pagination: { total: 0, page: 1, limit: 20, pages: 0 },
  });
  activityService.getUserActivity.mockResolvedValue({
    success: true,
    data: {
      user: { _id: OTHER_ID, username: 'writer', email: 'writer@example.com', createdAt: null },
      posts: { data: [], total: 3, page: 1, limit: 1, totalPages: 3 },
      comments: { data: [], total: 8, page: 1, limit: 1, totalPages: 8 },
      likes: { data: [], total: 2, page: 1, limit: 1, totalPages: 2 },
      views: { data: [], total: 12, page: 1, limit: 1, totalPages: 12 },
    },
  });
  activityService.getUserTimeline.mockResolvedValue({
    success: true,
    data: [
      {
        _id: 'c1',
        type: 'comment',
        action: 'commented on',
        message: 'Good piece',
        createdAt: new Date().toISOString(),
        post: { _id: POST_ID, title: 'A published story' },
      },
    ],
  });
});

const renderAdmin = (ui, options = {}) =>
  renderWithProviders(ui, { user: admin, route: '/admin', ...options });

/* ── Overview ────────────────────────────────────────────────────────────── */

describe('Admin overview', () => {
  /** The value rendered inside the stat tile carrying `label`. */
  const tileValue = (label) => {
    const labels = screen.getAllByText(label);
    // The stat tile is the one whose container also holds a number; the sidebar link is not.
    for (const node of labels) {
      const tile = node.closest('div')?.parentElement;
      const value = tile?.querySelector('div:last-child');
      if (value && /^[\d,]+$/.test(value.textContent.trim())) return value.textContent.trim();
    }
    return null;
  };

  it('reads its totals through the envelope the endpoint actually returns', async () => {
    renderAdmin(<AdminDashboard />);
    await screen.findAllByText('A published story');

    /*
      The endpoint answers { success, data: { … } } like the rest of the API. It used to
      return a bare object, and this screen read it that way — a regression on either side
      shows up as zeroes where the totals should be.
    */
    expect(tileValue('People')).toBe('2');
    expect(tileValue('Published')).toBe('1');
    expect(tileValue('Opened')).toBe('40');
    expect(tileValue('Finished')).toBe('10');
  });

  it('lists the top posts and writers the endpoint reports', async () => {
    renderAdmin(<AdminDashboard />);

    // The story is in both "Most opened" and the recent list, so more than one match is right.
    expect(await screen.findAllByText('A published story')).not.toHaveLength(0);
    expect(screen.getAllByText('writer').length).toBeGreaterThan(0);
    expect(screen.getByText(/40 opened/)).toBeInTheDocument();
  });
});

/* ── Posts ───────────────────────────────────────────────────────────────── */

describe('Admin posts', () => {
  it('asks the server to filter, rather than filtering a fixed page in the browser', async () => {
    renderAdmin(<AdminPosts />);
    await screen.findByText('A published story');

    await userEvent.click(screen.getByRole('button', { name: /^Drafts/ }));

    await waitFor(() =>
      expect(postService.getAllPosts).toHaveBeenCalledWith(
        expect.objectContaining({ visibility: 'draft', page: 1 })
      )
    );
  });

  it('shows counts for the whole collection, not the page on screen', async () => {
    renderAdmin(<AdminPosts />);

    // One row loaded, but the chips report all three stories.
    expect(await screen.findByRole('button', { name: 'All (3)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Drafts (1)' })).toBeInTheDocument();
  });

  it('sends a search term to the server after the debounce', async () => {
    renderAdmin(<AdminPosts />);
    await screen.findByText('A published story');

    await userEvent.type(screen.getByLabelText(/search posts by title/i), 'hydro');

    await waitFor(
      () =>
        expect(postService.getAllPosts).toHaveBeenCalledWith(
          expect.objectContaining({ q: 'hydro' })
        ),
      { timeout: 2000 }
    );
  });

  it('applies a bulk action to the selected stories in one request', async () => {
    renderAdmin(<AdminPosts />);
    await screen.findByText('A published story');

    await userEvent.click(screen.getByLabelText('Select A published story'));
    await userEvent.click(screen.getByRole('button', { name: /unpublish/i }));

    await waitFor(() => expect(postService.bulkUpdate).toHaveBeenCalledWith([POST_ID], 'draft'));
  });

  it('confirms before deleting several at once, and deletes on confirm', async () => {
    renderAdmin(<AdminPosts />);
    await screen.findByText('A published story');

    await userEvent.click(screen.getByLabelText('Select A published story'));
    await userEvent.click(screen.getByRole('button', { name: /^Delete$/ }));

    // Nothing is destroyed by the click that opens the dialog.
    expect(postService.bulkUpdate).not.toHaveBeenCalled();

    const dialog = await screen.findByRole('dialog');
    await userEvent.click(within(dialog).getByRole('button', { name: /delete all/i }));

    await waitFor(() => expect(postService.bulkUpdate).toHaveBeenCalledWith([POST_ID], 'delete'));
  });
});

/* ── Tags ────────────────────────────────────────────────────────────────── */

describe('Admin tags', () => {
  it('creates a tag, normalised to lowercase without its hash', async () => {
    renderAdmin(<AdminTags />);
    await screen.findByText('#react');

    await userEvent.click(screen.getByRole('button', { name: /new tag/i }));
    const dialog = await screen.findByRole('dialog');
    await userEvent.type(within(dialog).getByLabelText(/name/i), '#Kubernetes');
    await userEvent.click(within(dialog).getByRole('button', { name: /^create$/i }));

    /*
      The first argument only. `mutationFn: tagService.createTag` hands the service function
      straight to React Query, which calls it with (variables, context) — so an exact-argument
      assertion fails on the context it appends rather than on anything the screen got wrong.
    */
    await waitFor(() => expect(tagService.createTag).toHaveBeenCalled());
    expect(tagService.createTag.mock.calls[0][0]).toBe('kubernetes');
  });

  it('confirms before removing a tag, then removes it', async () => {
    renderAdmin(<AdminTags />);
    await screen.findByText('#react');

    await userEvent.click(screen.getByRole('button', { name: /remove the tag react/i }));
    expect(tagService.deleteTag).not.toHaveBeenCalled();

    const dialog = await screen.findByRole('dialog');
    await userEvent.click(within(dialog).getByRole('button', { name: /^remove$/i }));

    await waitFor(() => expect(tagService.deleteTag).toHaveBeenCalledWith(TAG_ID));
  });

  it('shows the published post count behind each tag', async () => {
    renderAdmin(<AdminTags />);
    expect(await screen.findByText('4')).toBeInTheDocument();
  });
});

/* ── People ──────────────────────────────────────────────────────────────── */

describe('Admin people', () => {
  it('suspends another account', async () => {
    renderAdmin(<AdminUsers />);
    await screen.findByText('writer');

    await userEvent.click(screen.getByRole('button', { name: /actions for writer/i }));
    await userEvent.click(await screen.findByText(/suspend account/i));

    await waitFor(() => expect(userService.setUserSuspended).toHaveBeenCalledWith(OTHER_ID, true));
  });

  it('promotes another account to administrator', async () => {
    renderAdmin(<AdminUsers />);
    await screen.findByText('writer');

    await userEvent.click(screen.getByRole('button', { name: /actions for writer/i }));
    await userEvent.click(await screen.findByText(/make administrator/i));

    await waitFor(() => expect(userService.setUserRole).toHaveBeenCalledWith(OTHER_ID, true));
  });

  it('offers no actions on your own row', async () => {
    renderAdmin(<AdminUsers />);
    await screen.findByText('writer');

    // Settings is where you change your own account; a mis-click here must not suspend the
    // account doing the clicking.
    expect(screen.getByText('You')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /actions for root/i })).not.toBeInTheDocument();
  });

  /*
    Opening the delete dialog *from the dropdown* is not driven here.

    Radix returns focus to the menu trigger as the menu closes while the dialog it opened is
    trapping focus at the same time. jsdom has no layout for either to resolve against, so the
    two recurse into a stack overflow — in a browser this is the ordinary Radix pattern and it
    works. What the dialog does with the password is covered where it can be: the service layer
    asserts `deleteUser` sends it in the body, and the backend suite refuses the request
    without it.
  */
  it('offers deletion only for other people, and states what it costs', async () => {
    renderAdmin(<AdminUsers />);
    await screen.findByText('writer');

    await userEvent.click(screen.getByRole('button', { name: /actions for writer/i }));

    expect(await screen.findByText(/delete account/i)).toBeInTheDocument();
    // Suspension is the reversible option and has to stay distinguishable from deletion.
    expect(screen.getByText(/suspend account/i)).toBeInTheDocument();
  });
});

/* ── Activity ────────────────────────────────────────────────────────────── */

describe('Admin activity', () => {
  it('reports active users from the endpoint rather than a field nothing writes', async () => {
    renderAdmin(<AdminActivity />);

    expect(await screen.findByText('7')).toBeInTheDocument();
    expect(screen.getByText(/active this month/i)).toBeInTheDocument();
  });

  it('shows what a reader actually said, and links to the story', async () => {
    renderAdmin(<AdminActivity />);

    expect(await screen.findByText('Good piece')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'A published story' });
    expect(link).toHaveAttribute('href', `/post/${POST_ID}`);
  });

  it('switches to the moderation log, which is a different endpoint', async () => {
    renderAdmin(<AdminActivity />);
    await screen.findByText('Good piece');

    await userEvent.click(screen.getByRole('tab', { name: /edited/i }));

    await waitFor(() => expect(activityService.getModerationLog).toHaveBeenCalled());
    expect(await screen.findByText(/no story has been edited/i)).toBeInTheDocument();
  });

  it('renders a deleted story as text rather than a link to nowhere', async () => {
    activityService.getAllActivity.mockResolvedValue({
      success: true,
      data: {
        activeUsers: 0,
        posts: { data: [], total: 0, page: 1, limit: 20, totalPages: 0 },
        comments: {
          data: [
            {
              _id: 'c2',
              message: 'On something since removed',
              createdAt: new Date().toISOString(),
              user: { _id: OTHER_ID, username: 'writer' },
              post: null,
            },
          ],
          total: 1,
          page: 1,
          limit: 20,
          totalPages: 1,
        },
        likes: { data: [], total: 0, page: 1, limit: 20, totalPages: 0 },
        views: { data: [], total: 0, page: 1, limit: 20, totalPages: 0 },
      },
    });

    renderAdmin(<AdminActivity />);

    // `/post/` with no id matches no route and lands on the 404 page.
    expect(await screen.findByText('A deleted story')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'A deleted story' })).not.toBeInTheDocument();
  });
});

/* ── One person's activity ───────────────────────────────────────────────── */

describe('Admin person activity', () => {
  const renderPerson = () =>
    renderWithProviders(<AdminPersonActivity />, {
      user: admin,
      route: `/admin/users/${OTHER_ID}/activity`,
      path: '/admin/users/:userId/activity',
    });

  it('asks both activity endpoints for the person in the URL', async () => {
    renderPerson();

    await waitFor(() => {
      expect(activityService.getUserActivity).toHaveBeenCalledWith(OTHER_ID, { limit: 1 });
      expect(activityService.getUserTimeline).toHaveBeenCalledWith(OTHER_ID, { limit: 50 });
    });
  });

  it('shows totals across everything the account has done', async () => {
    renderPerson();

    // Totals come from the endpoint's counts, not from the one-row page it returns.
    expect(await screen.findByText('8')).toBeInTheDocument();
    expect(screen.getByText(/responses/i)).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('renders the merged timeline with what was said', async () => {
    renderPerson();

    expect(await screen.findByText(/commented on/i)).toBeInTheDocument();
    expect(screen.getByText('“Good piece”')).toBeInTheDocument();
  });

  it('reports a deleted account instead of an empty page', async () => {
    activityService.getUserActivity.mockRejectedValue({ response: { status: 404 } });
    renderPerson();

    expect(await screen.findByText(/no such account/i)).toBeInTheDocument();
  });
});
