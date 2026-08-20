import api from '../config/api';

/**
 * Site and per-account activity.
 *
 * These four endpoints have existed on the server since the beginning with nothing on the
 * client calling them: there was no service module, no query and no screen. An administrator
 * could see totals on the dashboard and individual accounts in the users table, but had no
 * way to look at what was actually happening — which comments were being written, what was
 * being liked, or what one account had been doing.
 */
export const activityService = {
  // Recent posts, comments, likes and views across the whole site, plus a count of the
  // accounts that have opened anything in the last thirty days. Administrators only.
  getAllActivity: async (params = {}) => {
    const response = await api.get('/user-activity/all', { params });
    return response.data;
  },

  // Everything one account has done. Readable by that account or by an administrator.
  getUserActivity: async (userId, params = {}) => {
    const response = await api.get(`/user-activity/user/${userId}`, { params });
    return response.data;
  },

  // The same activity merged into one time-ordered stream.
  getUserTimeline: async (userId, params = {}) => {
    const response = await api.get(`/user-activity/timeline/${userId}`, { params });
    return response.data;
  },

  // Stories edited since they were written. Administrators only.
  getModerationLog: async (params = {}) => {
    const response = await api.get('/user-activity/moderation-log', { params });
    return response.data;
  },
};
