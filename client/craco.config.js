const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/ui': path.resolve(__dirname, 'src/ui'),
      '@/shared': path.resolve(__dirname, 'src/shared'),
      '@/features': path.resolve(__dirname, 'src/features'),
      '@/theme': path.resolve(__dirname, 'src/theme'),
      '@/hooks': path.resolve(__dirname, 'src/hooks'),
      '@/utils': path.resolve(__dirname, 'src/utils'),
      '@/services': path.resolve(__dirname, 'src/services'),
      '@/context': path.resolve(__dirname, 'src/context'),
      '@/layouts': path.resolve(__dirname, 'src/layouts'),
    },
  },
};
