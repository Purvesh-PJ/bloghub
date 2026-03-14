# Working Flow Documentation

This document explains the end-to-end flows for major features in BlogHub, showing how data moves from user action to final result.

## Core User Flows

### 1. User Registration Flow

```
User fills registration form
    ↓
Frontend: Register.jsx
    ├─ Form validation (username, email, password, confirmPassword)
    ├─ authService.signUp(username, email, password, confirmPassword)
    └─ POST /auth/signup
        ↓
Backend: auth.routes.js → SignupValidation middleware
    ├─ Validate input fields (express-validator)
    ├─ Check required fields
    └─ Pass to controller
        ↓
Backend: auth.controllers.signUp
    ├─ Check if user exists (email or username)
    ├─ If exists → Return 409 Conflict
    ├─ Create new User document
    ├─ Hash password with bcrypt (salt rounds: 10)
    ├─ Save user to database
    ├─ Create UserProfile document
    │   └─ Link to user via user._id
    └─ Return 201 success
        ↓
Frontend: Show success message → Redirect to login
```

**Key Points:**
- Email normalized (lowercase, trimmed)
- Password never stored in plain text
- Profile created automatically on signup
- Duplicate check on both email and username

---

### 2. User Login Flow

```
User enters credentials (email/username + password)
    ↓
Frontend: Login.jsx
    ├─ authService.signIn(credential, password)
    └─ POST /auth/signin
        ↓
Backend: auth.controllers.signIn
    ├─ Find user by email OR username (case-insensitive for email)
    ├─ If not found → Return 401 Unauthorized
    ├─ Compare password with bcrypt.compare()
    ├─ If invalid → Return 401 Unauthorized
    ├─ Generate JWT tokens:
    │   ├─ Access Token (expires: 2 minutes)
    │   └─ Refresh Token (expires: 20 minutes)
    ├─ Prepare user data (id, username, email, roles)
    └─ Return tokens + user data
        ↓
Frontend: AuthContext.setAuth()
    ├─ Store in authState (global state)
    ├─ Persist to localStorage
    └─ Redirect to home page
        ↓
API Interceptor: Attach token to all future requests
    └─ Header: Authorization: Bearer <accessToken>
```

**Key Points:**
- Flexible login (email or username)
- Short-lived access token for security
- Longer refresh token for UX
- Tokens stored in localStorage and memory

---

### 3. Automatic Token Refresh Flow

```
User makes API request with expired access token
    ↓
API Request: GET /posts (with expired token)
    ↓
Backend: Returns 401 Unauthorized
    ↓
Frontend: Axios Response Interceptor (api.js)
    ├─ Detects 401 status
    ├─ Check if retry already attempted
    ├─ Extract refreshToken from authState
    └─ POST /auth/refreshToken
        ↓
Backend: auth.controllers.refreshToken
    ├─ Verify refresh token with JWT
    ├─ If invalid → Return 401
    ├─ Generate new access token (2 min expiry)
    └─ Return new access token
        ↓
Frontend: Axios Interceptor
    ├─ Update authState.accessToken
    ├─ Update original request header
    └─ Retry original request
        ↓
Success: User continues without interruption
```

**Failure Scenario:**
```
If refresh token is also expired:
    ↓
Frontend: authState.logout()
    ├─ Clear localStorage
    ├─ Clear memory state
    └─ Redirect to /login
```

**Key Points:**
- Completely transparent to user
- No manual token management needed
- Prevents unnecessary re-logins
- Graceful fallback to login on failure

---

### 4. Create Post Flow

```
User clicks "Write a story" → Navigate to /write
    ↓
Frontend: WritePost.jsx
    ├─ Load categories (TanStack Query)
    ├─ Render MDX editor
    └─ User fills form:
        ├─ Title
        ├─ Cover image URL
        ├─ Content (MDX format)
        └─ Select categories
            ↓
User clicks "Publish"
    ↓
Frontend: postService.createPost(postData)
    └─ POST /posts (with JWT token)
        ↓
Backend: post.routes.js → authenticateUser middleware
    ├─ Verify JWT token
    ├─ Extract user ID from token
    └─ Pass to controller
        ↓
Backend: post.controllers.postBlogs
    ├─ Extract user_id from req.user
    ├─ Call postService.createPost(user_id, req.body)
    └─ postService.createPost():
        ├─ Validate required fields
        ├─ Create new Post document
        │   ├─ user: userId
        │   ├─ title, slug, content, imageURL
        │   └─ visibility: 'draft' (default)
        ├─ Save post to database
        ├─ Find User by userId
        ├─ Add post._id to User.posts array
        ├─ Save user
        ├─ Update Profile.postCount (+1)
        └─ Return new post
            ↓
Backend: Return 201 + postId
    ↓
Frontend: 
    ├─ Invalidate 'posts' query cache
    ├─ Show success toast
    └─ Redirect to /post/:postId
```

**Key Points:**
- Authentication required (JWT middleware)
- Post linked to user bidirectionally
- Profile stats updated automatically
- Slug generated from title
- Default visibility is 'draft'

---

### 5. View Post Flow (with Nested Data)

```
User clicks on post card → Navigate to /post/:id
    ↓
Frontend: PostDetail.jsx
    ├─ Extract id from URL params
    ├─ useQuery(['post', id], () => postService.getPost(id))
    └─ GET /posts/:id
        ↓
Backend: post.controllers.getSinglePost
    ├─ Post.findById(id)
    │   .populate('user', 'username')
    │   .populate({
    │       path: 'comments',
    │       populate: [
    │           { path: 'user', select: 'username' },
    │           { path: 'replies', populate: { path: 'user' } }
    │       ]
    │   })
    │   .populate('categories')
    └─ Return populated post
        ↓
Frontend: Render post with:
    ├─ Author information (from user)
    ├─ Categories (from categories)
    ├─ Comments with nested replies
    │   └─ Each comment/reply has user info
    ├─ Like count and button
    └─ View count
```

**Data Structure Returned:**
```javascript
{
  _id: "post123",
  title: "My Post",
  content: "...",
  user: { _id: "user123", username: "john" },
  categories: [
    { _id: "cat1", name: "Technology" }
  ],
  comments: [
    {
      _id: "comment1",
      message: "Great post!",
      user: { _id: "user456", username: "jane" },
      replies: [
        {
          _id: "reply1",
          message: "Thanks!",
          user: { _id: "user123", username: "john" }
        }
      ]
    }
  ],
  likes: ["user456", "user789"],
  views: ["view1", "view2"]
}
```

**Key Points:**
- Multiple levels of population (nested)
- Comments include replies (recursive structure)
- User info populated at each level
- No authentication required for public posts

---

### 6. Comment on Post Flow

```
User types comment → Clicks "Post Comment"
    ↓
Frontend: PostDetail.jsx
    ├─ commentService.createComment(postId, message)
    └─ POST /comments (with JWT token)
        ↓
Backend: comment.routes.js → authenticateUser middleware
    ↓
Backend: comment.controllers.createComment
    ├─ Extract user_id from req.user
    ├─ Extract postId and message from req.body
    ├─ Create new Comment document
    │   ├─ user: user_id
    │   ├─ message: message
    │   └─ date: Date.now()
    ├─ Save comment
    ├─ Find Post by postId
    ├─ Add comment._id to Post.comments array
    ├─ Save post
    └─ Return comment
        ↓
Frontend:
    ├─ Invalidate ['post', postId] query
    ├─ TanStack Query refetches post
    └─ Comment appears in UI
```

**Reply to Comment Flow:**
```
User clicks "Reply" on comment → Types reply
    ↓
Frontend: commentService.createReply(commentId, message)
    └─ POST /comments/replies
        ↓
Backend: comment.controllers.createReply
    ├─ Create new Comment document (reply)
    ├─ Find parent Comment by commentId
    ├─ Add reply._id to Comment.replies array
    ├─ Increment Comment.replyCount
    └─ Return reply
        ↓
Frontend: Refetch post → Reply appears nested under comment
```

**Key Points:**
- Comments are separate documents
- Replies are also Comment documents
- Nested structure via replies array
- Post maintains array of top-level comments only

---

### 7. Like/Unlike Post Flow

```
User clicks heart icon on post
    ↓
Frontend: Check if already liked
    ├─ If not liked → likeService.likePost(postId)
    └─ If liked → likeService.unlikePost(postId)
        ↓
Like Flow: POST /likes
    ↓
Backend: like.controllers.likePost
    ├─ Extract user_id from req.user
    ├─ Check if Like already exists (user + post)
    ├─ If exists → Return 400 "Already liked"
    ├─ Create new Like document
    │   ├─ user: user_id
    │   └─ post: postId
    ├─ Find Post by postId
    ├─ Add like._id to Post.likes array
    └─ Return success
        ↓
Unlike Flow: DELETE /likes/:postId
    ↓
Backend: like.controllers.unlikePost
    ├─ Find Like by user_id and postId
    ├─ Delete Like document
    ├─ Remove like._id from Post.likes array
    └─ Return success
        ↓
Frontend:
    ├─ Optimistic update (immediate UI change)
    ├─ Invalidate query cache
    └─ Refetch to confirm
```

**Key Points:**
- Separate Like model for tracking
- Prevents duplicate likes
- Optimistic UI updates for instant feedback
- Like count derived from likes array length

---

### 8. Search Posts Flow

```
User types in search bar → Presses Enter
    ↓
Frontend: Navigate to /search?q=query
    ↓
Frontend: Search.jsx
    ├─ Extract query from URL params
    ├─ searchService.searchPosts(query)
    └─ GET /search/:query
        ↓
Backend: search.controllers.searchPosts
    ├─ Extract query from params
    ├─ Post.find({
    │     $or: [
    │       { title: { $regex: query, $options: 'i' } },
    │       { content: { $regex: query, $options: 'i' } }
    │     ],
    │     visibility: 'public'
    │   })
    │   .populate('user', 'username')
    │   .populate('categories')
    └─ Return matching posts
        ↓
Frontend: Display results with PostCard components
```

**Key Points:**
- Case-insensitive search
- Searches both title and content
- Only public posts returned
- Real-time search (no debouncing shown)

---

### 9. User Profile View Flow

```
User clicks on author name → Navigate to /user/:userId
    ↓
Frontend: UserProfile.jsx
    ├─ userService.getUserProfile(userId)
    └─ GET /users/:userId
        ↓
Backend: user.controllers.getUserProfile
    ├─ Find User by userId
    ├─ Populate profile
    │   ├─ bio
    │   ├─ image
    │   ├─ postCount
    │   ├─ followersCount
    │   └─ followingsCount
    ├─ Find user's posts
    │   └─ Filter by visibility: 'public'
    └─ Return user + profile + posts
        ↓
Frontend: Display:
    ├─ Profile info (avatar, bio, stats)
    ├─ Follow/Unfollow button
    └─ User's public posts
```

**Follow User Flow:**
```
User clicks "Follow" button
    ↓
Frontend: userService.followUser(userId)
    └─ POST /users/followUser
        ↓
Backend: user.controllers.followUser
    ├─ Extract current_user_id from req.user
    ├─ Extract target_user_id from req.body
    ├─ Find current user's profile
    ├─ Add target_user_id to followings array
    ├─ Increment followingsCount
    ├─ Find target user's profile
    ├─ Add current_user_id to followers array
    ├─ Increment followersCount
    └─ Return success
        ↓
Frontend: Update UI (button → "Following")
```

**Key Points:**
- Bidirectional relationship (followings/followers)
- Counts maintained separately for performance
- Only public posts shown on profile

---

### 10. Analytics Dashboard Flow

```
User navigates to /analytics
    ↓
Frontend: Analytics.jsx
    ├─ analyticsService.getAnalytics()
    └─ GET /analytics (with JWT token)
        ↓
Backend: analytics.controllers.getAnalytics
    ├─ Extract user_id from req.user
    ├─ Find all user's posts
    ├─ Aggregate data:
    │   ├─ Total views (sum of post.views.length)
    │   ├─ Total likes (sum of post.likes.length)
    │   ├─ Total comments (sum of post.comments.length)
    │   ├─ Post performance (views/likes per post)
    │   └─ Engagement rate calculations
    └─ Return analytics data
        ↓
Frontend: Display charts and metrics
    ├─ Total views, likes, comments
    ├─ Top performing posts
    ├─ Engagement trends
    └─ Category breakdown
```

**Key Points:**
- User-specific analytics (own posts only)
- Real-time calculation (no pre-aggregation)
- Multiple metrics combined

---

### 11. Admin Dashboard Flow

```
Admin navigates to /admin
    ↓
Frontend: AdminRoute component
    ├─ Check if user.roles includes 'admin'
    ├─ If not admin → Redirect to home
    └─ If admin → Render AdminLayout
        ↓
Frontend: Admin/Dashboard.jsx
    ├─ Fetch all posts (GET /posts)
    ├─ Fetch all users (GET /users)
    ├─ Fetch all categories (GET /categories)
    └─ Display admin metrics:
        ├─ Total users
        ├─ Total posts
        ├─ Total categories
        └─ Recent activity
```

**Admin Actions:**
- Manage posts (edit, delete any post)
- Manage users (view, edit roles, delete)
- Manage categories (create, edit, delete)
- View site-wide analytics

**Key Points:**
- Role-based access control
- Admin can modify any content
- Separate admin layout and routes

---

## Request-Response Patterns

### Standard Success Response
```javascript
{
  success: true,
  message: "Operation successful",
  data: { /* result data */ }
}
```

### Standard Error Response
```javascript
{
  success: false,
  message: "Error description",
  error: "ErrorType"
}
```

### Common HTTP Status Codes
- `200 OK`: Successful GET, PUT, DELETE
- `201 Created`: Successful POST (resource created)
- `400 Bad Request`: Validation error, missing fields
- `401 Unauthorized`: Invalid/missing token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource doesn't exist
- `409 Conflict`: Duplicate resource (e.g., email exists)
- `500 Internal Server Error`: Server-side error

---

## Data Caching Strategy (TanStack Query)

### Query Keys
```javascript
['posts']              // All posts
['post', postId]       // Single post
['categories']         // All categories
['user', userId]       // User profile
['analytics']          // User analytics
```

### Cache Behavior
- **Stale Time**: Data considered fresh for X seconds
- **Cache Time**: Data kept in cache for Y seconds after unused
- **Refetch on Window Focus**: Automatic background refetch
- **Optimistic Updates**: UI updates before server confirms

### Invalidation Strategy
```javascript
// After creating post
queryClient.invalidateQueries(['posts'])

// After liking post
queryClient.invalidateQueries(['post', postId])

// After updating profile
queryClient.invalidateQueries(['user', userId])
```

---

## Error Handling Flow

### Frontend Error Handling
```
API Request fails
    ↓
Axios catches error
    ↓
Check error.response.status
    ├─ 401 → Try token refresh → Retry
    ├─ 403 → Show "Access denied" toast
    ├─ 404 → Show "Not found" message
    ├─ 500 → Show "Server error" toast
    └─ Network error → Show "Connection failed"
        ↓
TanStack Query error state
    ↓
Component displays error UI
```

### Backend Error Handling
```
Error occurs in controller/service
    ↓
Throw error or pass to next(error)
    ↓
Error Handler Middleware (errorHandler.js)
    ├─ Log error details
    ├─ Determine status code
    ├─ Sanitize error message
    └─ Send JSON response
        ↓
Frontend receives error response
```

---

## Summary

BlogHub follows a **request-response cycle** with clear patterns:

1. **User Action** → Frontend component
2. **Service Call** → API request with axios
3. **Middleware** → Authentication, validation
4. **Controller** → Request handling
5. **Service** → Business logic (if complex)
6. **Model** → Database operation
7. **Response** → JSON back to frontend
8. **State Update** → TanStack Query cache + UI update

Key characteristics:
- **Stateless API**: Each request contains all needed info (JWT)
- **Automatic Token Refresh**: Seamless user experience
- **Optimistic Updates**: Instant UI feedback
- **Nested Data Loading**: Efficient population with Mongoose
- **Role-Based Access**: Different flows for user/admin
- **Error Recovery**: Graceful handling at every layer
