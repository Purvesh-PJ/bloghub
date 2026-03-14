# Backend Flow Documentation

## Overview

The backend is a Node.js/Express REST API following a layered architecture pattern with clear separation of concerns.

---

## Request Lifecycle

### Complete Request Flow

```
HTTP Request
    ↓
Express Server (index.js)
    ↓
Logger Middleware (morgan)
    ↓
CORS Middleware
    ↓
Body Parser (express.json, express.urlencoded)
    ↓
Route Handler (routes/*.routes.js)
    ↓
Authentication Middleware (if protected route)
    ↓
Validation Middleware (if applicable)
    ↓
Controller (controllers/*.controllers.js)
    ↓
Service (services/*.js) [if complex logic]
    ↓
Model (models/*.model.js)
    ↓
MongoDB (via Mongoose)
    ↓
Response back through layers
    ↓
Error Handler Middleware (if error occurred)
    ↓
HTTP Response
```

---

## Layer Breakdown

### 1. Entry Point (index.js)

**Responsibilities:**
- Initialize Express app
- Connect to database
- Register middleware (order matters!)
- Register routes
- Register error handler (must be last)
- Start server

**Code Structure:**
```javascript
const express = require('express')
const app = express()

// 1. Database connection
const { connectDB } = require('./config/db')
connectDB()

// 2. Middleware (order matters!)
app.use(logger)           // Request logging
app.use(cors())           // Cross-origin requests
app.use(express.json())   // Parse JSON bodies
app.use(express.urlencoded({ extended: true }))

// 3. Routes
app.use('/posts', postRoutes)
app.use('/users', userRoutes)
app.use('/auth', authRoutes)
// ... more routes

// 4. Error handler (MUST be last)
app.use(errorHandler)

// 5. Start server
app.listen(PORT, () => console.log(`Server on port ${PORT}`))
```

**Why this order?**
- Logger first to log all requests
- CORS before routes to handle preflight
- Body parsers before routes to parse request bodies
- Routes before error handler
- Error handler last to catch all errors

---

### 2. Routes Layer

**Purpose:** Define API endpoints and map to controllers

**Pattern:**
```javascript
// post.routes.js
const express = require('express')
const router = express.Router()
const postController = require('../controllers/post.controllers')
const { authenticateUser } = require('../middlewares/authenticateUser')

// Public routes
router.get('/', postController.getBlogs)
router.get('/:id', postController.getSinglePost)

// Protected routes
router.post('/', authenticateUser, postController.postBlogs)
router.put('/:id', authenticateUser, postController.putBlogs)
router.delete('/:id', authenticateUser, postController.deletePost)

module.exports = router
```

**Key Points:**
- Each route file handles one resource
- Middleware applied per route or router
- Export router for use in index.js

---

### 3. Middleware Layer

#### Authentication Middleware (authenticateUser.js)

```javascript
const jwt = require('jsonwebtoken')

exports.authenticateUser = (req, res, next) => {
  // 1. Extract token from header
  const authHeader = req.header('authorization') || req.header('Authorization')
  
  if (!authHeader) {
    req.user = null
    return next()
  }
  
  // 2. Parse Bearer token
  const token = authHeader.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ message: 'Token missing' })
  }
  
  try {
    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // 4. Attach user ID to request
    req.user = decoded.user
    
    // 5. Continue to next middleware/controller
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}
```

**Flow:**
```
Request with Authorization: Bearer <token>
    ↓
Extract token from header
    ↓
Verify with JWT secret
    ↓
If valid: Attach user ID to req.user, call next()
If invalid: Return 401 error
```

#### Validation Middleware (SignupValidation.js)

```javascript
const { body } = require('express-validator')

exports.signupValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username required')
    .isLength({ min: 3 }).withMessage('Min 3 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email required')
    .isEmail().withMessage('Invalid email'),
  
  body('password')
    .notEmpty().withMessage('Password required')
    .isLength({ min: 6 }).withMessage('Min 6 characters'),
  
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords must match')
]
```

**Usage:**
```javascript
router.post('/signup', signupValidation, authController.signUp)
```

**Flow:**
```
Request body
    ↓
Validation rules applied
    ↓
If errors: Stored in req (checked in controller)
If valid: Continue to controller
```

#### Error Handler Middleware (errorHandler.js)

```javascript
module.exports = (err, req, res, next) => {
  console.error('Error:', err)
  
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal server error'
  
  res.status(statusCode).json({
    success: false,
    message,
    error: err.name || 'ServerError'
  })
}
```

**Usage:** Automatically catches errors from routes

---

### 4. Controllers Layer

**Purpose:** Handle HTTP requests and responses

**Pattern:**
```javascript
exports.controllerName = async (req, res) => {
  try {
    // 1. Extract data from request
    const { param } = req.params
    const { body } = req.body
    const userId = req.user  // From auth middleware
    
    // 2. Validate input (if not done by middleware)
    if (!param) {
      return res.status(400).json({
        success: false,
        message: 'Param required'
      })
    }
    
    // 3. Call service or model
    const result = await Service.doSomething(param, body)
    
    // 4. Send response
    return res.status(200).json({
      success: true,
      message: 'Success',
      data: result
    })
  } catch (error) {
    // 5. Handle errors
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
```

**Example: Post Creation (post.controllers.js)**
```javascript
exports.postBlogs = async (req, res) => {
  const user_id = req.user  // From authenticateUser middleware
  
  try {
    // Call service for business logic
    const newPost = await createPost(user_id, req.body)
    
    // Update profile count
    await Profile.findOneAndUpdate(
      { user: user_id },
      { $inc: { postCount: 1 } }
    )
    
    return res.status(201).json({
      success: true,
      message: 'Post created',
      postId: newPost._id
    })
  } catch (error) {
    const statusCode = error.message === 'User not found' ? 400 : 500
    return res.status(statusCode).json({
      success: false,
      message: error.message
    })
  }
}
```

**Key Points:**
- Controllers are thin - delegate to services
- Always return consistent response format
- Handle errors gracefully
- Use appropriate HTTP status codes

---

### 5. Services Layer

**Purpose:** Encapsulate business logic, reusable across controllers

**Pattern:**
```javascript
// postService.js
exports.createPost = async (userId, postData) => {
  // 1. Validate inputs
  if (!userId || !postData) {
    throw new Error('Missing required data')
  }
  
  // 2. Perform business logic
  const newPost = new Post({
    user: userId,
    title: postData.title,
    slug: postData.slug,
    content: postData.content,
    imageURL: postData.imageURL
  })
  
  await newPost.save()
  
  // 3. Update related entities
  const user = await User.findById(userId)
  if (!user) {
    await Post.findByIdAndDelete(newPost._id)
    throw new Error('User not found')
  }
  
  user.posts.push(newPost._id)
  await user.save()
  
  // 4. Return result
  return newPost
}
```

**Why Services?**
- Reusable logic across multiple controllers
- Easier to test in isolation
- Handles multi-step operations
- Keeps controllers thin

---

### 6. Models Layer

**Purpose:** Define database schemas and data validation

**Pattern:**
```javascript
const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  visibility: {
    type: String,
    enum: ['draft', 'private', 'public'],
    default: 'draft'
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }]
}, {
  timestamps: true  // Adds createdAt, updatedAt
})

module.exports = mongoose.model('Post', PostSchema)
```

**Key Features:**
- Schema validation
- Relationships via ObjectId refs
- Timestamps
- Enums for restricted values
- Default values

---

## Common Flows

### Authentication Flow

**Signup:**
```
POST /auth/signup
    ↓
SignupValidation middleware
    ↓
auth.controllers.signUp
    ├─ Check if user exists
    ├─ Hash password with bcrypt
    ├─ Create User document
    ├─ Create UserProfile document
    └─ Return success
```

**Login:**
```
POST /auth/signin
    ↓
auth.controllers.signIn
    ├─ Find user by email/username
    ├─ Compare password with bcrypt
    ├─ Generate JWT tokens (access + refresh)
    └─ Return tokens + user data
```

**Token Refresh:**
```
POST /auth/refreshToken
    ↓
auth.controllers.refreshToken
    ├─ Verify refresh token
    ├─ Generate new access token
    └─ Return new access token
```

### CRUD Flow (Posts)

**Create:**
```
POST /posts
    ↓
authenticateUser middleware
    ↓
post.controllers.postBlogs
    ↓
postService.createPost
    ├─ Create Post document
    ├─ Add post to User.posts
    ├─ Update Profile.postCount
    └─ Return post
```

**Read (Single):**
```
GET /posts/:id
    ↓
post.controllers.getSinglePost
    ├─ Post.findById(id)
    ├─ .populate('user', 'username')
    ├─ .populate('comments')
    ├─ .populate('categories')
    └─ Return populated post
```

**Update:**
```
PUT /posts/:id
    ↓
authenticateUser middleware
    ↓
post.controllers.putBlogs
    ↓
postService.updatePost
    ├─ Validate fields
    ├─ Post.findByIdAndUpdate
    └─ Return updated post
```

**Delete:**
```
DELETE /posts/:id
    ↓
authenticateUser middleware
    ↓
post.controllers.deletePost
    ├─ Find post with populated relationships
    ├─ Remove post from categories
    ├─ Delete all comments
    ├─ Remove post from user
    ├─ Delete post
    ├─ Update profile count
    └─ Return success
```

---

## Database Operations

### Basic Queries

**Find all:**
```javascript
const posts = await Post.find()
```

**Find with filter:**
```javascript
const publicPosts = await Post.find({ visibility: 'public' })
```

**Find by ID:**
```javascript
const post = await Post.findById(postId)
```

**Find one:**
```javascript
const user = await User.findOne({ email: 'user@example.com' })
```

### Population (Relationships)

**Simple populate:**
```javascript
const post = await Post.findById(id)
  .populate('user', 'username email')
```

**Nested populate:**
```javascript
const post = await Post.findById(id)
  .populate('user', 'username')
  .populate({
    path: 'comments',
    populate: {
      path: 'user',
      select: 'username'
    }
  })
```

### Create

**Single document:**
```javascript
const newPost = new Post({ title, content, user })
await newPost.save()
```

**Or:**
```javascript
const newPost = await Post.create({ title, content, user })
```

### Update

**Find and update:**
```javascript
const updated = await Post.findByIdAndUpdate(
  postId,
  { title: 'New Title' },
  { new: true }  // Return updated document
)
```

**Update many:**
```javascript
await Category.updateMany(
  { _id: { $in: categoryIds } },
  { $pull: { posts: postId } }
)
```

### Delete

**Find and delete:**
```javascript
await Post.findByIdAndDelete(postId)
```

**Delete many:**
```javascript
await Comment.deleteMany({ _id: { $in: commentIds } })
```

### Array Operations

**Push to array:**
```javascript
user.posts.push(postId)
await user.save()
```

**Or:**
```javascript
await User.findByIdAndUpdate(
  userId,
  { $push: { posts: postId } }
)
```

**Pull from array:**
```javascript
await User.findByIdAndUpdate(
  userId,
  { $pull: { posts: postId } }
)
```

**Increment/Decrement:**
```javascript
await Profile.findOneAndUpdate(
  { user: userId },
  { $inc: { postCount: 1 } }
)
```

---

## Error Handling Patterns

### Try-Catch in Controllers

```javascript
exports.someController = async (req, res) => {
  try {
    const result = await someOperation()
    res.status(200).json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    })
  }
}
```

### Throwing Errors in Services

```javascript
exports.createPost = async (userId, postData) => {
  if (!userId) {
    throw new Error('User ID required')
  }
  
  const user = await User.findById(userId)
  if (!user) {
    throw new Error('User not found')
  }
  
  // ... rest of logic
}
```

### Error Handler Middleware

```javascript
// Catches all errors passed to next(error)
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server error'
  })
})
```

---

## Validation Patterns

### Express Validator

```javascript
const { body, validationResult } = require('express-validator')

// Validation rules
const validatePost = [
  body('title').notEmpty().withMessage('Title required'),
  body('content').notEmpty().withMessage('Content required')
]

// In controller
exports.createPost = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  // ... rest of logic
}
```

### Manual Validation

```javascript
exports.createPost = async (req, res) => {
  const { title, content } = req.body
  
  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: 'Title and content required'
    })
  }
  
  // ... rest of logic
}
```

---

## Security Practices

### Password Hashing

```javascript
const bcrypt = require('bcryptjs')

// Hash password
const salt = await bcrypt.genSalt(10)
const hashedPassword = await bcrypt.hash(password, salt)

// Compare password
const isValid = await bcrypt.compare(password, user.password)
```

### JWT Token Generation

```javascript
const jwt = require('jsonwebtoken')

// Generate token
const token = jwt.sign(
  { user: userId },
  process.env.JWT_SECRET,
  { expiresIn: '2m' }
)

// Verify token
const decoded = jwt.verify(token, process.env.JWT_SECRET)
```

### Input Sanitization

```javascript
const { body } = require('express-validator')

body('email')
  .trim()
  .normalizeEmail()
  .isEmail()
```

---

## Summary

The backend follows a **layered architecture**:

1. **Routes**: Define endpoints
2. **Middleware**: Cross-cutting concerns (auth, validation, logging)
3. **Controllers**: Request/response handling
4. **Services**: Business logic
5. **Models**: Data layer

**Key principles:**
- Separation of concerns
- Single responsibility
- DRY (Don't Repeat Yourself)
- Consistent error handling
- Security best practices

This structure makes the code maintainable, testable, and scalable.
