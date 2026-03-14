# Architecture Overview

## System Type

BlogHub is a **full-stack MERN blogging platform** with role-based access control, real-time analytics, and social features. It follows a traditional client-server architecture with clear separation between frontend (React SPA) and backend (REST API).

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│  React 19 + Vite + React Router + TanStack Query            │
│  Styled Components + Context API                            │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST (Axios)
                       │ JWT Bearer Token
┌──────────────────────▼──────────────────────────────────────┐
│                      API LAYER (Express)                    │
│  Routes → Middleware → Controllers → Services               │
│  JWT Auth + Validation + Error Handling                     │
└──────────────────────┬──────────────────────────────────────┘
                       │ Mongoose ODM
┌──────────────────────▼──────────────────────────────────────┐
│                    DATABASE LAYER                           │
│                    MongoDB (NoSQL)                          │
│  Collections: Users, Posts, Comments, Categories, etc.      │
└─────────────────────────────────────────────────────────────┘
```

## Major Layers & Modules

### 1. Frontend Layer (Client)

**Technology Stack:**
- React 19 with functional components and hooks
- Vite for build tooling and HMR
- React Router v7 for client-side routing
- TanStack Query (React Query) for server state management
- Styled Components for CSS-in-JS styling
- Axios for HTTP requests with interceptors

**Key Responsibilities:**
- User interface rendering and interaction
- Client-side routing and navigation
- Authentication state management (Context API)
- API communication with automatic token refresh
- Form validation and user input handling
- Theme management (light/dark mode)

### 2. Backend Layer (Server)

**Technology Stack:**
- Node.js runtime
- Express.js web framework
- JWT for authentication
- bcryptjs for password hashing
- Express Validator for input validation
- Morgan for HTTP request logging

**Key Responsibilities:**
- RESTful API endpoints
- Request validation and sanitization
- Authentication and authorization
- Business logic execution
- Database operations coordination
- Error handling and logging

### 3. Data Layer

**Technology Stack:**
- MongoDB (NoSQL document database)
- Mongoose ODM for schema modeling

**Key Responsibilities:**
- Data persistence
- Relationship management
- Query optimization
- Data validation at schema level

## Architecture Patterns

### Backend Architecture Pattern: Layered Architecture

```
Request Flow:
Routes → Middleware → Controllers → Services → Models → Database
                ↓
         Error Handler
```

**Layer Breakdown:**

1. **Routes Layer** (`backend/routes/`)
   - Defines API endpoints
   - Maps HTTP methods to controller functions
   - Groups related endpoints

2. **Middleware Layer** (`backend/middlewares/`)
   - `authenticateUser.js`: JWT token verification
   - `SignupValidation.js`: Input validation rules
   - `errorHandler.js`: Centralized error handling
   - `logger.js`: Request/response logging
   - `tokenRenewal.js`: Token refresh logic

3. **Controllers Layer** (`backend/controllers/`)
   - Request/response handling
   - Input validation result checking
   - Calls service layer for business logic
   - Formats responses

4. **Services Layer** (`backend/services/`)
   - Business logic implementation
   - Complex operations coordination
   - Reusable logic across controllers
   - Example: `postService.js` handles post creation/update logic

5. **Models Layer** (`backend/models/`)
   - Mongoose schemas
   - Data validation rules
   - Virtual properties and methods
   - Database relationships

### Frontend Architecture Pattern: Component-Based with Service Layer

```
Pages → Components → Services → API → Backend
  ↓         ↓
Context   Hooks
```

**Structure:**

1. **Pages** (`client/src/pages/`)
   - Route-level components
   - Page-specific logic
   - Compose smaller components

2. **Components** (`client/src/components/`)
   - `common/`: Reusable UI components (PostCard, Avatar, Loading, etc.)
   - `layout/`: Layout wrappers (Layout, AdminLayout)
   - Presentational and container components

3. **Services** (`client/src/services/`)
   - API communication layer
   - Encapsulates HTTP requests
   - Returns promises for async operations

4. **Context** (`client/src/context/`)
   - Global state management
   - `AuthContext`: User authentication state
   - Provides auth methods to entire app

5. **Hooks**
   - TanStack Query hooks for data fetching
   - Custom hooks from context (useAuth)

## Data Flow Patterns

### Authentication Flow

```
1. User Login
   ├─ Frontend: Login form submission
   ├─ Service: authService.signIn(credential, password)
   ├─ API: POST /auth/signin
   ├─ Backend: auth.controllers.signIn
   │   ├─ Find user by email/username
   │   ├─ Verify password with bcrypt
   │   ├─ Generate JWT tokens (access + refresh)
   │   └─ Return tokens + user data
   ├─ Frontend: Store in AuthContext + localStorage
   └─ API Interceptor: Attach token to future requests

2. Token Refresh (Automatic)
   ├─ API Interceptor: Detects 401 response
   ├─ Service: authService.refreshToken(refreshToken)
   ├─ API: POST /auth/refreshToken
   ├─ Backend: Verify refresh token, issue new access token
   ├─ Frontend: Update token in AuthContext
   └─ Retry original request with new token
```

### Post Creation Flow

```
User Action → WritePost Page → Form Submit
    ↓
postService.createPost(postData)
    ↓
POST /posts (with JWT in header)
    ↓
authenticateUser middleware → Verify JWT
    ↓
post.controllers.postBlogs
    ↓
postService.createPost(userId, postData)
    ↓
1. Create Post document
2. Update User.posts array
3. Update Profile.postCount
    ↓
Return success + postId
    ↓
Frontend: Invalidate query cache, redirect to post
```

### Post Display Flow (with Relationships)

```
User visits /post/:id
    ↓
postService.getPost(id)
    ↓
GET /posts/:id
    ↓
post.controllers.getSinglePost
    ↓
Post.findById(id)
  .populate('user', 'username')
  .populate('comments')
    .populate('user')
    .populate('replies')
  .populate('categories')
    ↓
Return populated post with nested data
    ↓
Frontend: Render post with author, comments, categories
```

## Key Architectural Decisions

### 1. JWT with Refresh Token Strategy
- **Access Token**: Short-lived (2 minutes) for security
- **Refresh Token**: Longer-lived (20 minutes) for UX
- **Rationale**: Balance between security and user experience
- **Implementation**: Axios interceptor handles refresh automatically

### 2. Service Layer Separation
- **Decision**: Extract business logic from controllers
- **Rationale**: Reusability, testability, cleaner controllers
- **Example**: `postService.js` handles post creation logic used by multiple controllers

### 3. TanStack Query for Data Fetching
- **Decision**: Use React Query instead of Redux
- **Rationale**: 
  - Automatic caching and background refetching
  - Reduces boilerplate
  - Built-in loading/error states
  - Server state vs client state separation

### 4. Styled Components for Styling
- **Decision**: CSS-in-JS with styled-components
- **Rationale**:
  - Component-scoped styles
  - Dynamic theming support
  - Type-safe props
  - No CSS class name conflicts

### 5. MongoDB with Mongoose
- **Decision**: NoSQL document database
- **Rationale**:
  - Flexible schema for blog content
  - Easy relationship modeling with refs
  - Good fit for read-heavy operations
  - JSON-like documents match JavaScript objects

### 6. Role-Based Access Control
- **Decision**: User roles stored in User model
- **Implementation**: 
  - Default role: 'user'
  - Admin role: 'admin'
  - Middleware checks role for protected routes
- **Rationale**: Simple but effective authorization

## Security Architecture

### Authentication Security
- Passwords hashed with bcryptjs (salt rounds: 10)
- JWT tokens signed with secret key
- Tokens stored in localStorage (with XSS considerations)
- Authorization header: `Bearer <token>`

### API Security
- CORS enabled for cross-origin requests
- Input validation with express-validator
- JWT verification middleware on protected routes
- Error messages sanitized (no sensitive data leakage)

### Authorization Levels
1. **Public**: Anyone can access (posts, search, categories)
2. **Authenticated**: Logged-in users (create post, comment, like)
3. **Owner**: User can only modify their own content
4. **Admin**: Full access to admin panel and management features

## Scalability Considerations

### Current Architecture Strengths
- Stateless API (JWT-based, no session storage)
- Separation of concerns (easy to scale layers independently)
- Service layer allows logic reuse

### Potential Bottlenecks
- MongoDB single instance (no replication mentioned)
- No caching layer (Redis) for frequently accessed data
- File uploads handled in-memory (no CDN)
- No rate limiting on API endpoints

### Future Improvements
- Add Redis for caching popular posts
- Implement CDN for images
- Add database indexing for search queries
- Implement pagination for large datasets
- Add rate limiting middleware
- Consider microservices for analytics

## Development vs Production

### Development Setup
- Frontend: Vite dev server (port 5173)
- Backend: Nodemon with hot reload (port 5000)
- Database: Local MongoDB instance
- CORS: Permissive for local development

### Production Considerations (Inferred)
- Environment variables for sensitive config
- Build frontend with `npm run build`
- Serve static files from Express
- Use production MongoDB (Atlas)
- Implement proper CORS whitelist
- Enable compression middleware
- Add helmet.js for security headers

## Folder Structure Philosophy

### Backend Structure
```
backend/
├── config/       # Configuration (DB connection)
├── controllers/  # Request handlers
├── middlewares/  # Reusable middleware
├── models/       # Mongoose schemas
├── routes/       # API route definitions
├── services/     # Business logic
└── index.js      # Server entry point
```

**Philosophy**: Separation by technical concern (MVC-like pattern)

### Frontend Structure
```
client/src/
├── components/   # UI components (common, layout)
├── pages/        # Route-level components
├── services/     # API communication
├── context/      # Global state
├── config/       # Configuration
└── styles/       # Theme and global styles
```

**Philosophy**: Separation by feature and reusability

## Summary

BlogHub follows a **traditional three-tier architecture** with clear boundaries:
- **Presentation Tier**: React SPA with component-based UI
- **Application Tier**: Express REST API with layered architecture
- **Data Tier**: MongoDB with Mongoose ODM

The architecture prioritizes:
- **Separation of Concerns**: Each layer has distinct responsibilities
- **Maintainability**: Clear structure, service layer for reusability
- **Developer Experience**: Hot reload, clear patterns, modern tooling
- **Security**: JWT auth, password hashing, input validation
- **User Experience**: Automatic token refresh, optimistic updates, caching

This is a well-structured monolithic application suitable for small to medium-scale blogging platforms. The architecture can evolve toward microservices if specific features (e.g., analytics, search) require independent scaling.
