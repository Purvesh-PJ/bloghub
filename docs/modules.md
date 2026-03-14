# Modules & Components Documentation

This document explains the purpose and functionality of major folders, modules, and components in BlogHub.

## Backend Modules

### 1. `backend/config/`

**Purpose**: Configuration files for external services and connections

**Files:**
- `db.js`: MongoDB connection setup using Mongoose

**Key Functions:**
```javascript
connectDB() // Establishes connection to MongoDB
```

**Why it exists**: Centralizes database configuration, makes connection reusable, separates config from business logic

---

### 2. `backend/controllers/`

**Purpose**: Handle HTTP requests and responses, orchestrate business logic

**Key Controllers:**

#### `auth.controllers.js`
- `signUp()`: User registration with password hashing
- `signIn()`: User login with JWT generation
- `refreshToken()`: Generate new access token from refresh token

#### `post.controllers.js`
- `getBlogs()`: Fetch all posts
- `getSinglePost()`: Fetch single post with populated relationships
- `postBlogs()`: Create new post
- `putBlogs()`: Update existing post
- `deletePost()`: Delete post and cleanup relationships

#### `user.controllers.js`
- `getUser()`: Get current user profile
- `setUser()`: Update user profile
- `getUserPosts()`: Get user's posts
- `followUser()`: Follow another user
- `unfollowUser()`: Unfollow user

#### `comment.controllers.js`
- `createComment()`: Add comment to post
- `createReply()`: Reply to existing comment
- `deleteComment()`: Remove comment

#### `like.controllers.js`
- `likePost()`: Add like to post
- `unlikePost()`: Remove like from post

#### `analytics.controllers.js`
- `getAnalytics()`: Calculate user's post performance metrics

#### `category.controllers.js`
- `getCategories()`: Fetch all categories
- `createCategory()`: Create new category (admin)
- `attachCategories()`: Link categories to post

#### `search.controllers.js`
- `searchPosts()`: Full-text search in posts

**Pattern**: Controllers are thin - they validate input, call services, and format responses

---

### 3. `backend/middlewares/`

**Purpose**: Reusable request processing logic

#### `authenticateUser.js`
```javascript
authenticateUser(req, res, next)
// - Extracts JWT from Authorization header
// - Verifies token validity
// - Attaches user ID to req.user
// - Allows request to proceed or returns 401

authorizeAdmin(req, res, next)
// - Checks if user has admin role
// - Returns 403 if not admin
```

**Usage**: Applied to protected routes
```javascript
router.post('/posts', authenticateUser, postController.postBlogs)
```

#### `SignupValidation.js`
- Express-validator rules for signup form
- Validates email format, password strength, required fields

#### `errorHandler.js`
- Centralized error handling
- Catches all errors from routes
- Formats consistent error responses
- Logs errors for debugging

#### `logger.js`
- Logs HTTP requests (method, URL, status, response time)
- Uses Morgan or custom logging

#### `tokenRenewal.js`
- Handles token refresh logic (if separate from controller)

**Why it exists**: DRY principle, reusable across routes, separates cross-cutting concerns

---

### 4. `backend/models/`

**Purpose**: Define database schemas and data validation

#### `user.model.js`
```javascript
{
  username: String (required),
  email: String (required),
  password: String (required, hashed),
  roles: [String] (default: ['user']),
  profile: ObjectId → UserProfile,
  settings: ObjectId → UserSettings,
  posts: [ObjectId] → Post,
  timestamps: true
}
```

#### `post.model.js`
```javascript
{
  user: ObjectId → User,
  imageURL: String,
  title: String (required),
  slug: String (required),
  visibility: Enum ['draft', 'private', 'public'],
  content: String (required),
  tags: [ObjectId] → Tag,
  categories: [ObjectId] → Category,
  views: [ObjectId] → View,
  likes: [ObjectId] → Like,
  comments: [ObjectId] → Comment,
  timestamps: true
}
```

#### `comment.model.js`
```javascript
{
  user: ObjectId → User,
  message: String,
  likes: [ObjectId] → User,
  dislikes: [ObjectId] → User,
  replies: [ObjectId] → Comment (recursive),
  replyCount: Number,
  date: Date
}
```

#### `category.model.js`
```javascript
{
  name: String (required),
  posts: [ObjectId] → Post
}
```

#### `user-profile.model.js`
```javascript
{
  user: ObjectId → User,
  image: { data: Buffer, contentType: String },
  bio: String,
  followings: [ObjectId] → User,
  followers: [ObjectId] → User,
  postCount: Number,
  followingsCount: Number,
  followersCount: Number
}
```

#### Other Models:
- `like.model.js`: Tracks post likes
- `view.model.js`: Tracks post views
- `tag.model.js`: Post tags
- `settings.model.js`: Site settings
- `user-settings.model.js`: User preferences
- `analytics.model.js`: Analytics data

**Relationships:**
- User ↔ Post (one-to-many)
- Post ↔ Comment (one-to-many)
- Comment ↔ Comment (self-referential for replies)
- User ↔ Profile (one-to-one)
- Post ↔ Category (many-to-many)
- Post ↔ Like (one-to-many)

**Why it exists**: Data validation, relationship management, schema enforcement

---

### 5. `backend/routes/`

**Purpose**: Define API endpoints and map to controllers

**Route Files:**
- `auth.routes.js`: `/auth/signup`, `/auth/signin`, `/auth/refreshToken`
- `post.routes.js`: `/posts`, `/posts/:id`
- `user.routes.js`: `/users/*`
- `category.routes.js`: `/categories/*`
- `comment.routes.js`: `/comments/*`
- `like.routes.js`: `/likes/*`
- `search.routes.js`: `/search/:query`
- `analytics.routes.js`: `/analytics`
- `tag.routes.js`: `/tags/*`
- `settings.routes.js`: `/settings/*`
- `page-views.routes.js`: `/page-views/*`
- `user-activity.routes.js`: `/user-activity/*`

**Pattern Example:**
```javascript
// post.routes.js
router.get('/', postController.getBlogs)
router.get('/:id', postController.getSinglePost)
router.post('/', authenticateUser, postController.postBlogs)
router.put('/:id', authenticateUser, postController.putBlogs)
router.delete('/:id', authenticateUser, postController.deletePost)
```

**Why it exists**: Clean separation of routing logic, easy to understand API structure

---

### 6. `backend/services/`

**Purpose**: Encapsulate complex business logic, reusable across controllers

#### `postService.js`
```javascript
createPost(userId, postData)
// - Creates post document
// - Links post to user
// - Updates user's posts array
// - Updates profile post count
// - Returns created post

updatePost(post, postId)
// - Validates fields
// - Updates post document
// - Returns updated post
```

#### `categoryServices.js`
- Category-related business logic
- Attach/detach categories from posts

#### `commentServices.js`
- Comment creation logic
- Reply handling

**Why it exists**: 
- Keeps controllers thin
- Reusable logic across multiple controllers
- Easier to test business logic in isolation
- Handles multi-step operations (create post + update user + update profile)

---

### 7. `backend/index.js`

**Purpose**: Application entry point, server setup

**Responsibilities:**
- Import and configure Express
- Connect to database
- Register middleware (CORS, body parser, logger)
- Register all routes
- Register error handler (must be last)
- Start server on specified port

**Middleware Order (Important):**
```javascript
1. logger (request logging)
2. cors (cross-origin requests)
3. express.json() (parse JSON bodies)
4. express.urlencoded() (parse form data)
5. Routes
6. errorHandler (catch all errors)
```

---

### 8. `backend/seed.js`

**Purpose**: Populate database with sample data for development/testing

**Creates:**
- 15 sample users with profiles
- 22 blog posts across categories
- 10 categories
- 99 comments with replies
- 177 likes
- Analytics data

**Usage:** `npm run seed`

**Why it exists**: Quick setup for development, testing with realistic data, demo purposes

---

## Frontend Modules

### 1. `client/src/pages/`

**Purpose**: Route-level components, one per URL path

#### Public Pages:
- `Home.jsx`: Landing page with category slideshow, post feed, trending sidebar
- `PostDetail.jsx`: Single post view with comments, likes
- `Search.jsx`: Search results page
- `UserProfile.jsx`: Public user profile view
- `Login.jsx`: Login form
- `Register.jsx`: Registration form
- `NotFound.jsx`: 404 page

#### Protected Pages (require authentication):
- `WritePost.jsx`: Create/edit post with MDX editor
- `Profile.jsx`: Current user's profile management
- `MyPosts.jsx`: User's own posts list
- `Analytics.jsx`: User's post performance dashboard
- `Settings.jsx`: User settings

#### Admin Pages (require admin role):
- `admin/Dashboard.jsx`: Admin overview
- `admin/Posts.jsx`: Manage all posts
- `admin/Categories.jsx`: Manage categories
- `admin/Users.jsx`: Manage users
- `admin/Settings.jsx`: Site settings

**Pattern**: Pages compose smaller components, handle data fetching with TanStack Query

---

### 2. `client/src/components/`

**Purpose**: Reusable UI components

#### `components/common/`

**`PostCard.jsx`**
- Displays post preview (title, excerpt, author, stats)
- Used in: Home, Search, MyPosts, UserProfile
- Props: `post` object

**`Avatar.jsx`**
- User avatar with fallback to initials
- Props: `username`, `imageUrl`, `size`

**`Loading.jsx`**
- Loading spinner with optional text
- Used across app during data fetching

**`ProtectedRoute.jsx`**
- Route wrapper that requires authentication
- Redirects to /login if not authenticated
- Usage: `<ProtectedRoute><WritePost /></ProtectedRoute>`

**`AdminRoute.jsx`**
- Route wrapper that requires admin role
- Redirects to home if not admin
- Usage: `<AdminRoute><AdminDashboard /></AdminRoute>`

**`RichTextEditor.jsx`**
- MDX editor component
- Live preview, syntax highlighting
- Used in WritePost page

**`ThemeToggle.jsx`**
- Light/dark mode toggle button
- Updates theme context

**`ErrorBoundary.jsx`**
- Catches React errors
- Displays fallback UI
- Prevents entire app crash

#### `components/layout/`

**`Layout.jsx`**
- Main app layout wrapper
- Header, navigation, footer
- Wraps public and user pages

**`AdminLayout.jsx`**
- Admin panel layout
- Admin sidebar navigation
- Wraps admin pages

**Why it exists**: Reusability, consistency, separation of concerns

---

### 3. `client/src/services/`

**Purpose**: API communication layer, encapsulates HTTP requests

#### `authService.js`
```javascript
signIn(credential, password)
signUp(username, email, password, confirmPassword)
refreshToken(refreshToken)
```

#### `postService.js`
```javascript
getPosts()
getPost(id)
createPost(postData)
updatePost(id, postData)
deletePost(id)
```

#### `userService.js`
```javascript
getUser()
updateUser(userData)
getUserProfile(userId)
followUser(userId)
unfollowUser(userId)
```

#### Other Services:
- `commentService.js`: Comment CRUD
- `likeService.js`: Like/unlike
- `categoryService.js`: Category operations
- `tagService.js`: Tag operations
- `searchService.js`: Search posts
- `analyticsService.js`: Fetch analytics
- `settingsService.js`: User settings

**Pattern:**
```javascript
export const postService = {
  getPosts: async () => {
    const response = await api.get('/posts')
    return response.data
  }
}
```

**Why it exists**: 
- Centralized API calls
- Easy to mock for testing
- Consistent error handling
- Single source of truth for endpoints

---

### 4. `client/src/context/`

**Purpose**: Global state management with React Context

#### `AuthContext.jsx`

**State:**
```javascript
{
  user: { user_id, username, email, roles },
  accessToken: "jwt...",
  refreshToken: "jwt...",
  isAuthenticated: boolean
}
```

**Methods:**
```javascript
setAuth(data)          // Set auth state after login
setAccessToken(token)  // Update access token after refresh
setUser(user)          // Update user data
logout()               // Clear auth state
isLoggedIn()           // Check if authenticated
isAdmin()              // Check if user is admin
```

**Special Feature: authState**
- Separate state object accessible outside React
- Used by axios interceptors
- Synced with React context
- Persisted to localStorage

**Why it exists**: 
- Share auth state across entire app
- Avoid prop drilling
- Accessible in non-React code (interceptors)

---

### 5. `client/src/config/`

#### `api.js`

**Purpose**: Axios instance with interceptors

**Configuration:**
```javascript
baseURL: process.env.VITE_API_URL
headers: { 'Content-Type': 'application/json' }
```

**Request Interceptor:**
- Attaches JWT token to every request
- Reads token from authState

**Response Interceptor:**
- Detects 401 errors
- Automatically refreshes token
- Retries original request
- Logs out if refresh fails

**Why it exists**: 
- Centralized API configuration
- Automatic token management
- DRY principle for auth headers

---

### 6. `client/src/styles/`

**Purpose**: Theme and global styling

#### `styles/theme/`

**`tokens.js`**
- Design tokens (colors, spacing, font sizes)
- Shared constants

**`lightTheme.js` / `darkTheme.js`**
- Theme-specific color values
- Extends base tokens

**`typography.js`**
- Font families, sizes, weights
- Line heights

**`GlobalStyles.js`**
- CSS reset
- Global styles (body, html)
- Font imports

**`index.js`**
- Exports all theme objects

#### `ThemeProvider.jsx`
- Wraps app with styled-components ThemeProvider
- Manages theme switching (light/dark)
- Persists theme preference to localStorage

**Why it exists**: 
- Consistent design system
- Easy theme switching
- Centralized style management

---

### 7. `client/src/App.jsx`

**Purpose**: Root component, defines routing structure

**Route Structure:**
```
/ (Layout)
  ├─ / (Home)
  ├─ /login
  ├─ /register
  ├─ /post/:id
  ├─ /user/:userId
  ├─ /search
  ├─ /write (Protected)
  ├─ /edit/:id (Protected)
  ├─ /profile (Protected)
  ├─ /my-posts (Protected)
  ├─ /analytics (Protected)
  ├─ /settings (Protected)
  └─ /* (NotFound)

/admin (AdminLayout, AdminRoute)
  ├─ /admin (Dashboard)
  ├─ /admin/posts
  ├─ /admin/categories
  ├─ /admin/users
  └─ /admin/settings
```

**Why it exists**: Single source of truth for routing, clear navigation structure

---

### 8. `client/src/main.jsx`

**Purpose**: Application entry point

**Setup:**
```javascript
1. Import React and ReactDOM
2. Wrap App with:
   - BrowserRouter (routing)
   - AuthProvider (auth state)
   - ThemeProvider (styling)
   - QueryClientProvider (data fetching)
3. Render to DOM
```

**Why it exists**: Bootstrap application, configure providers

---

## Key Integration Points

### Frontend ↔ Backend Communication

```
Component → Service → api.js → Backend Route → Controller → Service → Model → Database
                ↓
         Axios Interceptor
         (auto token refresh)
```

### Data Flow

```
User Action → Component State → Service Call → API Request
    ↓
Backend Processing
    ↓
Response → TanStack Query Cache → Component Re-render
```

### Authentication Flow

```
Login → AuthContext.setAuth() → localStorage + authState
    ↓
api.js interceptor reads authState
    ↓
Attaches token to all requests
    ↓
Backend authenticateUser middleware verifies token
```

---

## Module Dependencies

### Backend Dependencies
```
index.js
  ├─ config/db.js
  ├─ routes/*.routes.js
  │   ├─ middlewares/*.js
  │   └─ controllers/*.controllers.js
  │       ├─ services/*.js
  │       └─ models/*.model.js
  └─ middlewares/errorHandler.js
```

### Frontend Dependencies
```
main.jsx
  └─ App.jsx
      ├─ pages/*.jsx
      │   ├─ components/*.jsx
      │   ├─ services/*.js
      │   │   └─ config/api.js
      │   └─ context/AuthContext.jsx
      └─ styles/ThemeProvider.jsx
```

---

## Summary

BlogHub follows a **modular architecture** with clear separation:

**Backend:**
- **Routes**: Define endpoints
- **Middleware**: Cross-cutting concerns
- **Controllers**: Request handling
- **Services**: Business logic
- **Models**: Data layer

**Frontend:**
- **Pages**: Route components
- **Components**: Reusable UI
- **Services**: API layer
- **Context**: Global state
- **Config**: App configuration

Each module has a single responsibility, making the codebase maintainable and scalable. The structure follows industry best practices for MERN stack applications.
