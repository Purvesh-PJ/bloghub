// Configuration settings for the blogging platform

// API URLs
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Default user avatar
const defaultAvatar = '/assets/images/default-avatar.png';

// File upload limits
const fileUploadLimits = {
  image: 5 * 1024 * 1024, // 5MB
  document: 10 * 1024 * 1024 // 10MB
};

// App info
const appInfo = {
  name: 'Blogging Platform',
  version: '1.0.0',
  company: 'Your Company Name'
};

// Export configuration
const config = {
  apiUrl,
  defaultAvatar,
  fileUploadLimits,
  appInfo
};

export default config; 