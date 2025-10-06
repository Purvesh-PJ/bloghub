const express = require('express');
require('dotenv').config();
const app = express();

// IMPORT DATABASES
require('./databases/My_Blog_Database');

const errorHandler = require('./middlewares/errorHandler'); // Import error handling middleware

// IMPORT ROUTES
const postRoutes = require('./routes/post.routes');
const userRoutes = require('./routes/user.routes');
const categoryRoutes = require('./routes/category.routes');
const tagRoutes = require('./routes/tag.routes');
const commentRoutes = require('./routes/comment.routes');
const searchRoutes = require('./routes/search.routes');
const authRoutes = require('./routes/auth.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const likesRoutes = require('./routes/likes.routes');
const pageViewsRoutes = require('./routes/page-views.routes');
const userActivityRoutes = require('./routes/user-activity.routes');
const settingsRoutes = require('./routes/settings.routes');

const logger = require('./middlewares/logger'); // Import logging middleware

// REQUIRED SERVER 
const cors = require('cors');
app.use(logger); // Use the logging middleware
app.use(cors());            // for handling Cross-Origin Resource Sharing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ROUTES
app.use('/posts', postRoutes);
app.use('/users', userRoutes);
app.use('/categories', categoryRoutes);
app.use('/tags', tagRoutes);
app.use('/comments', commentRoutes);
app.use('/search', searchRoutes);
app.use('/auth', authRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/likes', likesRoutes);
app.use('/page-views', pageViewsRoutes);
app.use('/user-activity', userActivityRoutes);
app.use('/settings', settingsRoutes);

// Error handling middleware MUST be after routes
app.use(errorHandler);

// SERVER LISTENING
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => { 
    console.log(`Server running on port ${PORT}`); 
});
