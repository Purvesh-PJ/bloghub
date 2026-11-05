/**
 * Every React Query cache key in one place.
 *
 * Keys were string literals written out at each call site, and a key is only useful if two
 * places spell it identically — `useCurrentUser` caches under `['currentUser']` and Settings
 * invalidates `['currentUser']` after a save, so a typo in either would not fail, it would
 * quietly leave the header showing the old name and avatar until the tab was reloaded. The
 * same key appeared in five files for tags alone.
 *
 * Grouped by resource, and every group exposes `all` so a mutation can invalidate the whole
 * family without knowing which parameterised variants happen to be cached:
 *
 *     queryClient.invalidateQueries({ queryKey: queryKeys.posts.all })
 *
 * Arrays are built fresh on each call rather than shared, because React Query compares keys
 * structurally and a shared array handed to two queries is a mutation hazard for no gain.
 */
export const queryKeys = {
  /** The signed-in account, as the server knows it. */
  currentUser: () => ['currentUser'],

  posts: {
    all: ['posts'],
    /** The public feed, optionally filtered by topic. */
    feed: (params = {}) => ['posts', params],
    /** One story. */
    detail: (id) => ['post', id],
    /** Ranked by recent engagement. */
    trending: (params = {}) => ['trendingPosts', params],
    /** One author's published stories, paged. */
    byAuthor: (authorId, page) => ['authorPosts', authorId, page],
    /** The caller's own stories, including drafts. */
    mine: (params = {}) => ['myPosts', params],
    /** The moderation listing: every story, whatever its visibility. */
    moderation: (params = {}) => ['allPosts', params],
  },

  comments: {
    all: ['postComments'],
    forPost: (postId) => ['postComments', postId],
  },

  tags: {
    all: ['tags'],
  },

  /** Full-text search results for one term. */
  search: (term) => ['search', term],

  profiles: {
    all: ['publicProfile'],
    detail: (userId) => ['publicProfile', userId],
    /** The caller's own extended profile — display name, links, location. */
    ownDetails: () => ['userProfileDetails'],
    following: (userId) => ['isFollowing', userId],
  },

  settings: {
    all: ['userSettings'],
  },

  analytics: {
    /** The caller's own figures across every story they have written. */
    mine: () => ['myAnalytics'],
    /** One story's figures. Author and administrators only. */
    forPost: (postId) => ['postAnalytics', postId],
    /** The public open count for one story. */
    viewsForPost: (postId) => ['postViews', postId],
    /** What the caller has been reading. */
    reading: () => ['readingActivity'],
    /** Site-wide totals for the administration console. */
    site: () => ['adminAnalytics'],
    /** One account's figures, read by an administrator. */
    forUser: (userId) => ['personAnalytics', userId],
  },

  admin: {
    users: (page) => ['admin-users', page],
    activity: (page) => ['adminActivity', page],
    moderationLog: (page) => ['adminModerationLog', page],
    personActivity: (userId) => ['personActivity', userId],
    personTimeline: (userId) => ['personTimeline', userId],
  },
};
