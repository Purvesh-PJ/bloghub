import { describe, it, expect, vi, beforeEach } from 'vitest';

/*
  The service layer is the contract between the screens and the API, and it is where two of
  the defects this suite pins down actually lived: `getUser` ignored the id it was given, so
  every writer's public page rendered the viewer's own account, and the profile page had no
  way to ask for one author's posts.

  api is mocked rather than the network: what matters here is the URL and the parameters each
  call produces, not axios.
*/

const get = vi.fn(() => Promise.resolve({ data: { success: true } }));
const post = vi.fn(() => Promise.resolve({ data: { success: true } }));
const put = vi.fn(() => Promise.resolve({ data: { success: true } }));
const patch = vi.fn(() => Promise.resolve({ data: { success: true } }));
const del = vi.fn(() => Promise.resolve({ data: { success: true } }));

vi.mock('../config/api', () => ({
  default: { get, post, put, patch, delete: del },
}));

const { userService } = await import('./userService');
const { postService } = await import('./postService');
const { commentService } = await import('./commentService');
const { likeService } = await import('./likeService');
const { tagService } = await import('./tagService');
const { activityService } = await import('./activityService');
const { searchService } = await import('./searchService');
const { analyticsService } = await import('./analyticsService');

beforeEach(() => {
  [get, post, put, patch, del].forEach((fn) => fn.mockClear());
});

describe('userService', () => {
  it('asks for a specific person’s public profile', async () => {
    await userService.getPublicProfile('507f1f77bcf86cd799439011');
    expect(get).toHaveBeenCalledWith('/users/507f1f77bcf86cd799439011/profile');
  });

  it('keeps getUser scoped to the token and takes no id', async () => {
    /*
      The profile page used to call `getUser(userId)`. This function has never accepted an
      argument, so the id was silently dropped and the endpoint returned whoever the token
      belonged to. The assertion pins that down: a caller passing an id must not believe it
      did anything.
    */
    await userService.getUser('507f1f77bcf86cd799439011');
    expect(get).toHaveBeenCalledWith('/users/getUser');
  });

  it('sends the password in the body when deleting an account', async () => {
    await userService.deleteAccount('hunter2hunter2');
    // A session alone is not authority to destroy the account, so the body carries proof.
    expect(del).toHaveBeenCalledWith('/users/me', { data: { password: 'hunter2hunter2' } });
  });

  it('sends the administrator’s own password when deleting somebody else', async () => {
    await userService.deleteUser('507f1f77bcf86cd799439011', 'admin-password');
    expect(del).toHaveBeenCalledWith('/users/507f1f77bcf86cd799439011', {
      data: { password: 'admin-password' },
    });
  });

  it('patches suspension and role rather than replacing the account', async () => {
    await userService.setUserSuspended('507f1f77bcf86cd799439011', true);
    expect(patch).toHaveBeenCalledWith('/users/507f1f77bcf86cd799439011/suspension', {
      suspended: true,
    });

    await userService.setUserRole('507f1f77bcf86cd799439011', false);
    expect(patch).toHaveBeenCalledWith('/users/507f1f77bcf86cd799439011/role', { admin: false });
  });
});

describe('postService', () => {
  it('filters the feed by author on the server', async () => {
    await postService.getPostsByAuthor('507f1f77bcf86cd799439011', { page: 2, limit: 12 });
    expect(get).toHaveBeenCalledWith('/posts', {
      params: { page: 2, limit: 12, author: '507f1f77bcf86cd799439011' },
    });
  });

  it('marks the moderation listing with all=true and forwards its filters', async () => {
    await postService.getAllPosts({ page: 3, limit: 20, visibility: 'draft', q: 'hydro' });
    expect(get).toHaveBeenCalledWith('/posts', {
      params: { page: 3, limit: 20, visibility: 'draft', q: 'hydro', all: 'true' },
    });
  });

  it('does not send all=true on the public feed', async () => {
    await postService.getPosts({ page: 1 });
    expect(get).toHaveBeenCalledWith('/posts', { params: { page: 1 } });
  });

  it('passes paging and filters through to the author’s own posts', async () => {
    /*
      One method for this endpoint, not two. `userService.getUserPosts` was a second wrapper
      around the same URL, so the workspace and anything else reaching for "my posts" could
      pick different ones and drift apart.
    */
    await postService.getMyPosts({ page: 2, visibility: 'draft', sort: 'updated' });
    expect(get).toHaveBeenCalledWith('/users/getUserPosts', {
      params: { page: 2, visibility: 'draft', sort: 'updated' },
    });
    expect(userService.getUserPosts).toBeUndefined();
  });

  it('applies one action to many ids in a single request', async () => {
    await postService.bulkUpdate(['a', 'b'], 'public');
    expect(post).toHaveBeenCalledWith('/posts/bulk', { ids: ['a', 'b'], action: 'public' });
  });
});

describe('commentService and likeService', () => {
  it('scopes comments to one post', async () => {
    await commentService.getPostComments('507f1f77bcf86cd799439011', { limit: 50 });
    expect(get).toHaveBeenCalledWith('/comments/post/507f1f77bcf86cd799439011', {
      params: { limit: 50 },
    });
  });

  it('posts a reply against its parent comment', async () => {
    await commentService.replyToComment('user-1', 'comment-1', 'A reply');
    expect(post).toHaveBeenCalledWith('/comments/replies', {
      userId: 'user-1',
      repliedCommentId: 'comment-1',
      message: 'A reply',
    });
  });

  it('unlikes through the post, not through the like id', async () => {
    // The reader knows which post they are on; they do not know their own like's id.
    await likeService.unlikePost('507f1f77bcf86cd799439011');
    expect(del).toHaveBeenCalledWith('/likes/post/507f1f77bcf86cd799439011');
  });
});

describe('tagService', () => {
  it('creates and deletes tags', async () => {
    await tagService.createTag('react');
    expect(post).toHaveBeenCalledWith('/tags', { name: 'react' });

    await tagService.deleteTag('507f1f77bcf86cd799439011');
    expect(del).toHaveBeenCalledWith('/tags/507f1f77bcf86cd799439011');
  });
});

describe('activityService', () => {
  it('reaches the four activity endpoints the console needs', async () => {
    await activityService.getAllActivity({ page: 1, limit: 20 });
    expect(get).toHaveBeenCalledWith('/user-activity/all', { params: { page: 1, limit: 20 } });

    await activityService.getModerationLog({ page: 2 });
    expect(get).toHaveBeenCalledWith('/user-activity/moderation-log', { params: { page: 2 } });

    await activityService.getUserActivity('507f1f77bcf86cd799439011');
    expect(get).toHaveBeenCalledWith('/user-activity/user/507f1f77bcf86cd799439011', {
      params: {},
    });

    await activityService.getUserTimeline('507f1f77bcf86cd799439011');
    expect(get).toHaveBeenCalledWith('/user-activity/timeline/507f1f77bcf86cd799439011', {
      params: {},
    });
  });
});

describe('searchService', () => {
  it('encodes the query so a slash or a hash cannot break the path', async () => {
    await searchService.search('c++ / rust');
    expect(get).toHaveBeenCalledWith(`/search/${encodeURIComponent('c++ / rust')}`);
  });
});

describe('analyticsService', () => {
  it('asks for the caller’s own figures without sending an id', async () => {
    await analyticsService.getMyAnalytics();
    expect(get).toHaveBeenCalledWith('/analytics/me');
  });

  it('tracks views and reads against the post', async () => {
    await analyticsService.trackPageView('507f1f77bcf86cd799439011');
    expect(post).toHaveBeenCalledWith('/analytics/view/507f1f77bcf86cd799439011');

    await analyticsService.trackPostRead('507f1f77bcf86cd799439011');
    expect(post).toHaveBeenCalledWith('/analytics/read/507f1f77bcf86cd799439011');
  });
});
