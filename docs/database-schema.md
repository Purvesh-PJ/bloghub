# Database Schema Documentation

## Overview

BlogHub uses **MongoDB** as its database with **Mongoose** as the ODM (Object Document Mapper). The schema follows a **document-oriented** design with references between collections.

## Database: `bloghub`

---

## Collections & Schemas

### 1. Users Collection

**Model**: `User`  
**File**: `backend/models/user.model.js`

```javascript
{
  _id: ObjectId,
  username: String (required, unique),
  email: String (required, unique, lowercase),
  password: String (required, hashed with bcrypt),
  roles: [String] (default: ['user']),
  profile: ObjectId (ref: 'UserProfile'),
  settings: ObjectId (ref: 'UserSettings'),
  posts: [ObjectId] (ref: 'Post'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes** (Inferred):
- `email`: Unique index for fast lookup
- `username`: Unique index for fast lookup

**Relationships:**
- One-to-One with UserProfile
- One-to-One with UserSettings
- One-to-Many with Posts

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com",
  "password": "$2a$10$...", 
  "roles": ["user"],
  "profile": "507f1f77bcf86cd799439012",
  "settings": "507f1f77bcf86cd799439013",
  "posts": ["507f1f77bcf86cd799439014", "507f1f77bcf86cd799439015"],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

### 2. UserProfiles Collection

**Model**: `UserProfile`  
**File**: `backend/models/user-profile.model.js`

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  image: {
    data: Buffer,
    contentType: String
  },
  bio: String,
  followings: [ObjectId] (ref: 'User'),
  followers: [ObjectId] (ref: 'User'),
  postCount: Number (default: 0),
  followingsCount: Number (default: 0),
  followersCount: Number (default: 0)
}
```

**Relationships:**
- One-to-One with User (via user field)
- Many-to-Many with Users (followings/followers)

**Notes:**
- Profile created automatically on user signup
- Counts maintained separately for performance (denormalization)
- Image stored as Buffer (base64 or binary)

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "user": "507f1f77bcf86cd799439011",
  "image": {
    "data": null,
    "contentType": ""
  },
  "bio": "Full-stack developer passionate about MERN stack",
  "followings": ["507f1f77bcf86cd799439020", "507f1f77bcf86cd799439021"],
  "followers": ["507f1f77bcf86cd799439022"],
  "postCount": 5,
  "followingsCount": 2,
  "followersCount": 1
}
```

---

### 3. Posts Collection

**Model**: `Post`  
**File**: `backend/models/post.model.js`

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  imageURL: String,
  title: String (required),
  slug: String (required),
  visibility: String (enum: ['draft', 'private', 'public'], default: 'draft'),
  content: String (required, MDX format),
  tags: [ObjectId] (ref: 'Tag'),
  categories: [ObjectId] (ref: 'Category'),
  views: [ObjectId] (ref: 'View'),
  likes: [ObjectId] (ref: 'Like'),
  comments: [ObjectId] (ref: 'Comment'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes** (Recommended):
- `user`: For fetching user's posts
- `visibility`: For filtering public posts
- `slug`: For URL-based lookup
- `title, content`: Text index for search

**Relationships:**
- Many-to-One with User
- Many-to-Many with Categories
- Many-to-Many with Tags
- One-to-Many with Comments
- One-to-Many with Likes
- One-to-Many with Views

**Visibility States:**
- `draft`: Not published, only visible to author
- `private`: Published but only visible to author
- `public`: Published and visible to everyone

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "user": "507f1f77bcf86cd799439011",
  "imageURL": "https://example.com/cover.jpg",
  "title": "Getting Started with MERN Stack",
  "slug": "getting-started-with-mern-stack",
  "visibility": "public",
  "content": "# Introduction\n\nMERN stack is...",
  "tags": ["507f1f77bcf86cd799439030"],
  "categories": ["507f1f77bcf86cd799439040", "507f1f77bcf86cd799439041"],
  "views": ["507f1f77bcf86cd799439050"],
  "likes": ["507f1f77bcf86cd799439060", "507f1f77bcf86cd799439061"],
  "comments": ["507f1f77bcf86cd799439070"],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

### 4. Comments Collection

**Model**: `Comment`  
**File**: `backend/models/comment.model.js`

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  message: String (required),
  likes: [ObjectId] (ref: 'User'),
  dislikes: [ObjectId] (ref: 'User'),
  replies: [ObjectId] (ref: 'Comment', self-referential),
  replyCount: Number (default: 0),
  date: Date (default: Date.now)
}
```

**Relationships:**
- Many-to-One with User
- Self-referential (replies are also Comments)
- Referenced by Post.comments array

**Structure:**
- Top-level comments stored in Post.comments
- Replies stored in Comment.replies (nested structure)
- Supports unlimited nesting depth

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439070",
  "user": "507f1f77bcf86cd799439022",
  "message": "Great article! Very helpful.",
  "likes": ["507f1f77bcf86cd799439011"],
  "dislikes": [],
  "replies": ["507f1f77bcf86cd799439071"],
  "replyCount": 1,
  "date": "2024-01-15T11:00:00.000Z"
}
```

---

### 5. Categories Collection

**Model**: `Category`  
**File**: `backend/models/category.model.js`

```javascript
{
  _id: ObjectId,
  name: String (required, unique),
  posts: [ObjectId] (ref: 'Post')
}
```

**Relationships:**
- Many-to-Many with Posts (bidirectional)

**Notes:**
- Categories managed by admin
- Posts can have multiple categories
- Categories track their posts for filtering

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439040",
  "name": "Technology",
  "posts": ["507f1f77bcf86cd799439014", "507f1f77bcf86cd799439015"]
}
```

---

### 6. Tags Collection

**Model**: `Tag`  
**File**: `backend/models/tag.model.js`

```javascript
{
  _id: ObjectId,
  name: String (required, unique),
  posts: [ObjectId] (ref: 'Post')
}
```

**Relationships:**
- Many-to-Many with Posts

**Notes:**
- Similar to categories but more flexible
- Users can create tags when writing posts

---

### 7. Likes Collection

**Model**: `Like`  
**File**: `backend/models/like.model.js`

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  post: ObjectId (ref: 'Post', required),
  createdAt: Date (auto)
}
```

**Indexes** (Recommended):
- Compound index on `(user, post)` for uniqueness
- `post`: For counting likes per post

**Relationships:**
- Many-to-One with User
- Many-to-One with Post

**Notes:**
- Separate collection for tracking likes
- Prevents duplicate likes (one user, one post)
- Referenced by Post.likes array

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439060",
  "user": "507f1f77bcf86cd799439022",
  "post": "507f1f77bcf86cd799439014",
  "createdAt": "2024-01-15T11:30:00.000Z"
}
```

---

### 8. Views Collection

**Model**: `View`  
**File**: `backend/models/view.model.js`

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', optional),
  post: ObjectId (ref: 'Post', required),
  ipAddress: String,
  userAgent: String,
  createdAt: Date (auto)
}
```

**Relationships:**
- Many-to-One with Post
- Many-to-One with User (optional, for logged-in users)

**Notes:**
- Tracks post views for analytics
- Can track anonymous views (no user)
- IP and user agent for uniqueness

---

### 9. UserSettings Collection

**Model**: `UserSettings`  
**File**: `backend/models/user-settings.model.js`

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  theme: String (enum: ['light', 'dark'], default: 'light'),
  emailNotifications: Boolean (default: true),
  language: String (default: 'en')
}
```

**Relationships:**
- One-to-One with User

**Notes:**
- User preferences and settings
- Created on user signup or first settings update

---

### 10. Settings Collection

**Model**: `Settings`  
**File**: `backend/models/settings.model.js`

```javascript
{
  _id: ObjectId,
  siteName: String,
  siteDescription: String,
  allowRegistration: Boolean (default: true),
  maintenanceMode: Boolean (default: false)
}
```

**Notes:**
- Site-wide settings
- Managed by admin
- Typically only one document in collection

---

### 11. Analytics Collection

**Model**: `Analytics`  
**File**: `backend/models/analytics.model.js`

```javascript
{
  _id: ObjectId,
  post: ObjectId (ref: 'Post', required),
  date: Date,
  views: Number,
  likes: Number,
  comments: Number,
  shares: Number
}
```

**Relationships:**
- Many-to-One with Post

**Notes:**
- Aggregated analytics data
- Can be calculated on-the-fly or pre-aggregated
- Used for performance dashboard

---

## Relationship Diagram

```
User ──────────────┬─────────────┬──────────────┐
  │                │             │              │
  │ (1:1)          │ (1:1)       │ (1:M)        │ (M:M)
  │                │             │              │
  ▼                ▼             ▼              ▼
UserProfile   UserSettings    Post         Followers/
                                │           Followings
                                │
                    ┌───────────┼───────────┬──────────┐
                    │           │           │          │
                    │ (M:M)     │ (1:M)     │ (1:M)    │ (1:M)
                    │           │           │          │
                    ▼           ▼           ▼          ▼
                Category    Comment      Like       View
                              │
                              │ (self-ref)
                              ▼
                           Comment
                          (replies)
```

---

## Data Integrity & Constraints

### Referential Integrity

**Maintained by Application Logic:**
- When deleting a post:
  - Remove post ID from User.posts
  - Remove post ID from Category.posts
  - Delete all associated Comments
  - Delete all associated Likes
  - Delete all associated Views

**Example from `post.controllers.deletePost`:**
```javascript
// 1. Find post with populated relationships
const post = await Post.findById(post_id)
  .populate('categories')
  .populate('comments')

// 2. Remove post from categories
await Category.updateMany(
  { _id: { $in: postAttachedCategoryIds } },
  { $pull: { posts: post_id } }
)

// 3. Delete all comments
await Comment.deleteMany({ _id: { $in: postAttachedCommentIds } })

// 4. Remove post from user
await User.updateOne(
  { _id: { $in: user_id } },
  { $pull: { posts: post_id } }
)

// 5. Delete post
await Post.findByIdAndDelete(post_id)

// 6. Update profile count
await Profile.findOneAndUpdate(
  { user: user_id },
  { $inc: { postCount: -1 } }
)
```

### Unique Constraints

- `User.email`: Unique
- `User.username`: Unique
- `Category.name`: Unique
- `Tag.name`: Unique
- `(Like.user, Like.post)`: Compound unique (inferred)

### Validation Rules

**User:**
- Email must be valid format (validated by express-validator)
- Password minimum length (validated by express-validator)
- Username required

**Post:**
- Title required
- Slug required
- Content required
- Visibility must be one of: draft, private, public

**Comment:**
- Message required
- User required

---

## Denormalization Strategy

### Counts Stored Separately

**UserProfile:**
- `postCount`: Instead of counting User.posts.length
- `followersCount`: Instead of counting followers.length
- `followingsCount`: Instead of counting followings.length

**Rationale:**
- Faster reads (no need to count array elements)
- Trade-off: Must update counts on every change
- Acceptable for this use case (reads >> writes)

### Arrays of References

**Post:**
- `likes`: Array of Like IDs
- `comments`: Array of Comment IDs
- `views`: Array of View IDs

**Rationale:**
- Easy to get count (array.length)
- Easy to check membership (array.includes)
- Can populate for full data when needed

---

## Query Patterns

### Common Queries

**Get all public posts:**
```javascript
Post.find({ visibility: 'public' })
  .populate('user', 'username')
  .populate('categories')
  .sort({ createdAt: -1 })
```

**Get single post with all relationships:**
```javascript
Post.findById(id)
  .populate('user', 'username')
  .populate({
    path: 'comments',
    populate: [
      { path: 'user', select: 'username' },
      { path: 'replies', populate: { path: 'user' } }
    ]
  })
  .populate('categories')
```

**Get user's posts:**
```javascript
Post.find({ user: userId, visibility: 'public' })
  .sort({ createdAt: -1 })
```

**Search posts:**
```javascript
Post.find({
  $or: [
    { title: { $regex: query, $options: 'i' } },
    { content: { $regex: query, $options: 'i' } }
  ],
  visibility: 'public'
})
```

**Check if user liked post:**
```javascript
Like.findOne({ user: userId, post: postId })
```

---

## Performance Considerations

### Indexes Needed (Recommendations)

```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ username: 1 }, { unique: true })

// Posts
db.posts.createIndex({ user: 1 })
db.posts.createIndex({ visibility: 1 })
db.posts.createIndex({ slug: 1 })
db.posts.createIndex({ title: "text", content: "text" })
db.posts.createIndex({ createdAt: -1 })

// Likes
db.likes.createIndex({ user: 1, post: 1 }, { unique: true })
db.likes.createIndex({ post: 1 })

// Comments
db.comments.createIndex({ user: 1 })

// Categories
db.categories.createIndex({ name: 1 }, { unique: true })
```

### Potential Bottlenecks

1. **Nested Population**: Getting post with comments + replies + users is expensive
2. **Array Growth**: Post.likes and Post.comments arrays can grow large
3. **Search**: Full-text search on content field without proper indexing
4. **Analytics**: Real-time calculation of metrics on every request

### Optimization Strategies

1. **Pagination**: Limit results per page
2. **Projection**: Select only needed fields
3. **Caching**: Cache frequently accessed data (popular posts)
4. **Aggregation**: Use MongoDB aggregation for complex analytics
5. **Lazy Loading**: Load comments/replies on demand

---

## Data Migration & Seeding

### Seed Script (`backend/seed.js`)

Creates sample data:
- 15 users with profiles
- 22 posts across 10 categories
- 99 comments with replies
- 177 likes
- Analytics data

**Usage:** `npm run seed`

**Note:** Clears existing data before seeding

---

## Summary

BlogHub's database schema follows a **hybrid approach**:
- **Normalized**: Separate collections for entities (User, Post, Comment, etc.)
- **Denormalized**: Counts stored separately for performance
- **Referenced**: ObjectId references for relationships
- **Embedded**: Some data embedded (e.g., image in UserProfile)

The schema supports:
- Complex relationships (many-to-many, self-referential)
- Flexible content (MDX in posts)
- Social features (likes, comments, follows)
- Analytics and tracking
- Role-based access control

Key design decisions:
- **Separate Like collection**: Prevents duplicates, enables analytics
- **Comment replies as references**: Supports unlimited nesting
- **Bidirectional relationships**: Post ↔ Category for efficient queries
- **Denormalized counts**: Faster reads at cost of write complexity
