import api from '../config/api';

export const postService = {
  // Returns the envelope { success, message, data, pagination }.
  getPosts: async (params = {}) => {
    const response = await api.get('/posts', { params });
    return response.data;
  },

  /**
   * Moderation view: includes drafts and private posts. Requires an admin token; the
   * server ignores the flag for anyone else.
   *
   * Takes { page, limit, visibility, q }. Filtering and paging happen on the server — the
   * console used to ask for a flat 50 and filter them in the browser, so a site with more
   * than fifty stories had no way to reach the rest of them, and the counts on the filter
   * chips described the loaded page rather than the site.
   *
   * Returns { data, pagination, counts } where `counts` breaks the whole collection down by
   * visibility.
   */
  getAllPosts: async (params = {}) => {
    const response = await api.get('/posts', { params: { ...params, all: 'true' } });
    return response.data;
  },

  /**
   * Posts ranked by recent engagement.
   *
   * The response carries `trendedBy`: 'engagement' when a real ranking was possible, or
   * 'latest' when too little has happened in the window — the caller is expected to label
   * the section accordingly rather than calling newest posts trending.
   */
  getTrending: async (params = {}) => {
    const response = await api.get('/posts/trending', { params });
    return response.data;
  },

  /**
   * One author's published stories, filtered and paged on the server.
   *
   * The public profile page used to fetch the global feed and filter it in the browser, so it
   * only ever saw whichever of that author's posts happened to fall in the first page of the
   * whole site — usually none of them.
   */
  getPostsByAuthor: async (authorId, params = {}) => {
    const response = await api.get('/posts', { params: { ...params, author: authorId } });
    return response.data;
  },

  getPost: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  updatePost: async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },

  /**
   * The author's own posts.
   *
   * Filtering, sorting and paging happen on the server, so this takes
   * { page, limit, visibility, sort, q } and returns { data, pagination, counts }.
   */
  getMyPosts: async (params = {}) => {
    const response = await api.get('/users/getUserPosts', { params });
    return response.data;
  },

  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  /**
   * Applies one action to several posts in a single request.
   *
   * @param {string[]} ids post ids
   * @param {'delete'|'public'|'draft'|'private'} action
   */
  bulkUpdate: async (ids, action) => {
    const response = await api.post('/posts/bulk', { ids, action });
    return response.data;
  },
};
