# Frontend Flow Documentation

## Overview

The frontend is a React 19 single-page application built with Vite, using modern patterns like hooks, context, and TanStack Query for data management.

---

## Component Architecture

### Component Hierarchy

```
App.jsx (Root)
├─ BrowserRouter
│  ├─ AuthProvider (Context)
│  │  ├─ ThemeProvider (Styled Components)
│  │  │  ├─ QueryClientProvider (TanStack Query)
│  │  │  │  └─ Routes
│  │  │  │     ├─ Layout (Public/User Routes)
│  │  │  │     │  ├─ Header
│  │  │  │     │  ├─ Outlet (Page Content)
│  │  │  │     │  └─ Footer
│  │  │  │     └─ AdminLayout (Admin Routes)
│  │  │  │        ├─ AdminSidebar
│  │  │  │        └─ Outlet (Admin Page Content)
```

---

## Routing Structure

### Route Configuration (App.jsx)

```javascript
<Routes>
  {/* Public and User Routes */}
  <Route path="/" element={<Layout />}>
    {/* Public */}
    <Route index element={<Home />} />
    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
    <Route path="post/:id" element={<PostDetail />} />
    <Route path="user/:userId" element={<UserProfile />} />
    <Route path="search" element={<Search />} />
    
    {/* Protected */}
    <Route path="write" element={<ProtectedRoute><WritePost /></ProtectedRoute>} />
    <Route path="edit/:id" element={<ProtectedRoute><WritePost /></ProtectedRoute>} />
    <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    <Route path="my-posts" element={<ProtectedRoute><MyPosts /></ProtectedRoute>} />
    <Route path="analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
    <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
    
    <Route path="*" element={<NotFound />} />
  </Route>

  {/* Admin Routes */}
  <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
    <Route index element={<AdminDashboard />} />
    <Route path="posts" element={<AdminPosts />} />
    <Route path="categories" element={<AdminCategories />} />
    <Route path="users" element={<AdminUsers />} />
    <Route path="settings" element={<AdminSettings />} />
  </Route>
</Routes>
```

### Route Protection

**ProtectedRoute Component:**
```javascript
export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}
```

**AdminRoute Component:**
```javascript
export function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (!isAdmin()) {
    return <Navigate to="/" replace />
  }
  
  return children
}
```

---

## State Management

### 1. Authentication State (Context API)

**AuthContext.jsx** provides global auth state:

```javascript
// State Structure
{
  user: {
    user_id: string,
    username: string,
    email: string,
    roles: string[]
  },
  accessToken: string,
  refreshToken: string,
  isAuthenticated: boolean
}

// Methods
setAuth(data)          // Set auth after login
setAccessToken(token)  // Update access token
setUser(user)          // Update user data
logout()               // Clear auth state
isLoggedIn()           // Check if authenticated
isAdmin()              // Check if admin
```

**Special Feature: authState Object**

Separate from React context, accessible outside React:

```javascript
// Used by axios interceptors
export const authState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  
  getState() { /* ... */ },
  setState(newState) { /* ... */ },
  setAccessToken(token) { /* ... */ },
  logout() { /* ... */ },
  persist() { /* saves to localStorage */ },
  subscribe(listener) { /* ... */ }
}
```

**Why?** Axios interceptors run outside React component lifecycle, so they need access to auth state without using hooks.

### 2. Server State (TanStack Query)

**Query Keys:**
```javascript
['posts']              // All posts
['post', postId]       // Single post
['categories']         // All categories
['user', userId]       // User profile
['analytics']          // User analytics
['myPosts']            // Current user's posts
```

**Common Patterns:**

**Fetching Data:**
```javascript
const { data, isLoading, error } = useQuery({
  queryKey: ['posts'],
  queryFn: postService.getPosts
})
```

**Mutations:**
```javascript
const mutation = useMutation({
  mutationFn: postService.createPost,
  onSuccess: () => {
    queryClient.invalidateQueries(['posts'])
    toast.success('Post created!')
    navigate(`/post/${data.postId}`)
  },
  onError: (error) => {
    toast.error(error.message)
  }
})
```

**Optimistic Updates:**
```javascript
const likeMutation = useMutation({
  mutationFn: likeService.likePost,
  onMutate: async (postId) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(['post', postId])
    
    // Snapshot previous value
    const previousPost = queryClient.getQueryData(['post', postId])
    
    // Optimistically update
    queryClient.setQueryData(['post', postId], (old) => ({
      ...old,
      likes: [...old.likes, currentUserId]
    }))
    
    return { previousPost }
  },
  onError: (err, postId, context) => {
    // Rollback on error
    queryClient.setQueryData(['post', postId], context.previousPost)
  },
  onSettled: (postId) => {
    // Refetch to confirm
    queryClient.invalidateQueries(['post', postId])
  }
})
```

### 3. Local Component State (useState)

Used for:
- Form inputs
- UI toggles (modals, dropdowns)
- Temporary data
- Component-specific state

```javascript
const [isOpen, setIsOpen] = useState(false)
const [formData, setFormData] = useState({ title: '', content: '' })
const [selectedCategory, setSelectedCategory] = useState('all')
```

---

## Data Fetching Patterns

### Pattern 1: Simple Fetch

```javascript
function Home() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: postService.getPosts
  })
  
  if (isLoading) return <Loading />
  
  return (
    <div>
      {posts.map(post => <PostCard key={post._id} post={post} />)}
    </div>
  )
}
```

### Pattern 2: Fetch with Parameters

```javascript
function PostDetail() {
  const { id } = useParams()
  
  const { data: post, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postService.getPost(id)
  })
  
  if (isLoading) return <Loading />
  
  return <div>{post.title}</div>
}
```

### Pattern 3: Dependent Queries

```javascript
function UserProfile() {
  const { userId } = useParams()
  
  // First query
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getUserProfile(userId)
  })
  
  // Second query depends on first
  const { data: posts } = useQuery({
    queryKey: ['userPosts', userId],
    queryFn: () => postService.getUserPosts(userId),
    enabled: !!user  // Only run if user exists
  })
  
  return <div>...</div>
}
```

### Pattern 4: Mutation with Invalidation

```javascript
function WritePost() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  
  const mutation = useMutation({
    mutationFn: postService.createPost,
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries(['posts'])
      queryClient.invalidateQueries(['myPosts'])
      
      // Navigate to new post
      navigate(`/post/${data.postId}`)
      
      // Show success message
      toast.success('Post created successfully!')
    }
  })
  
  const handleSubmit = (formData) => {
    mutation.mutate(formData)
  }
  
  return <form onSubmit={handleSubmit}>...</form>
}
```

---

## Form Handling

### Pattern 1: Controlled Components

```javascript
function Login() {
  const [credential, setCredential] = useState('')
  const [password, setPassword] = useState('')
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await authService.signIn(credential, password)
      setAuth(response.data)
      navigate('/')
    } catch (error) {
      toast.error(error.message)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={credential}
        onChange={(e) => setCredential(e.target.value)}
      />
      <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  )
}
```

### Pattern 2: React Hook Form (if used)

```javascript
import { useForm } from 'react-hook-form'

function WritePost() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  
  const onSubmit = (data) => {
    mutation.mutate(data)
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title', { required: true })} />
      {errors.title && <span>Title is required</span>}
      
      <textarea {...register('content', { required: true })} />
      {errors.content && <span>Content is required</span>}
      
      <button type="submit">Publish</button>
    </form>
  )
}
```

---

## API Communication

### Service Layer Pattern

**postService.js:**
```javascript
import api from '../config/api'

export const postService = {
  getPosts: async () => {
    const response = await api.get('/posts')
    return response.data
  },
  
  getPost: async (id) => {
    const response = await api.get(`/posts/${id}`)
    return response.data
  },
  
  createPost: async (postData) => {
    const response = await api.post('/posts', postData)
    return response.data
  },
  
  updatePost: async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData)
    return response.data
  },
  
  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`)
    return response.data
  }
}
```

### Axios Configuration (api.js)

```javascript
import axios from 'axios'
import { authState } from '../context/AuthContext'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request Interceptor: Add auth token
api.interceptors.request.use(
  (config) => {
    const token = authState.accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const refreshToken = authState.refreshToken
        if (refreshToken) {
          // Call refresh endpoint
          const response = await axios.post(
            `${api.defaults.baseURL}/auth/refreshToken`,
            { refreshToken }
          )
          
          if (response.data.success) {
            // Update token
            const { accessToken } = response.data.data
            authState.setAccessToken(accessToken)
            
            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
            return api(originalRequest)
          }
        }
      } catch (refreshError) {
        // Refresh failed, logout
        authState.logout()
        window.location.href = '/login'
      }
    }
    
    return Promise.reject(error)
  }
)

export default api
```

---

## Styling with Styled Components

### Theme Structure

**tokens.js:**
```javascript
export const tokens = {
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    // ...
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    // ...
  },
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    // ...
  }
}
```

**lightTheme.js / darkTheme.js:**
```javascript
export const lightTheme = {
  ...tokens,
  colors: {
    ...tokens.colors,
    bgPrimary: '#ffffff',
    bgSecondary: '#f9fafb',
    textPrimary: '#111827',
    textSecondary: '#6b7280',
    // ...
  }
}

export const darkTheme = {
  ...tokens,
  colors: {
    ...tokens.colors,
    bgPrimary: '#1f2937',
    bgSecondary: '#111827',
    textPrimary: '#f9fafb',
    textSecondary: '#d1d5db',
    // ...
  }
}
```

### Component Styling

```javascript
import styled from 'styled-components'

const Button = styled.button`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

// Usage
<Button onClick={handleClick}>Click Me</Button>
```

### Dynamic Styling with Props

```javascript
const Card = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme, $variant }) => 
    $variant === 'primary' ? theme.colors.primary : theme.colors.bgPrimary
  };
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
`

// Usage
<Card $variant="primary">Primary Card</Card>
```

---

## Component Patterns

### Pattern 1: Container-Presentational

**Container (Page):**
```javascript
function Home() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: postService.getPosts
  })
  
  if (isLoading) return <Loading />
  
  return <PostList posts={posts} />
}
```

**Presentational (Component):**
```javascript
function PostList({ posts }) {
  return (
    <div>
      {posts.map(post => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  )
}
```

### Pattern 2: Compound Components

```javascript
function Tabs({ children }) {
  const [activeTab, setActiveTab] = useState(0)
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  )
}

Tabs.List = function TabsList({ children }) {
  return <div>{children}</div>
}

Tabs.Tab = function Tab({ index, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext)
  return (
    <button 
      onClick={() => setActiveTab(index)}
      className={activeTab === index ? 'active' : ''}
    >
      {children}
    </button>
  )
}

Tabs.Panel = function TabPanel({ index, children }) {
  const { activeTab } = useContext(TabsContext)
  return activeTab === index ? <div>{children}</div> : null
}

// Usage
<Tabs>
  <Tabs.List>
    <Tabs.Tab index={0}>Tab 1</Tabs.Tab>
    <Tabs.Tab index={1}>Tab 2</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel index={0}>Content 1</Tabs.Panel>
  <Tabs.Panel index={1}>Content 2</Tabs.Panel>
</Tabs>
```

### Pattern 3: Render Props

```javascript
function DataFetcher({ url, render }) {
  const { data, isLoading, error } = useQuery({
    queryKey: [url],
    queryFn: () => fetch(url).then(r => r.json())
  })
  
  return render({ data, isLoading, error })
}

// Usage
<DataFetcher 
  url="/api/posts"
  render={({ data, isLoading }) => 
    isLoading ? <Loading /> : <PostList posts={data} />
  }
/>
```

---

## Error Handling

### Error Boundary

```javascript
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong</h1>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      )
    }
    
    return this.props.children
  }
}
```

### API Error Handling

```javascript
function PostDetail() {
  const { id } = useParams()
  const { data, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postService.getPost(id)
  })
  
  if (isLoading) return <Loading />
  
  if (error) {
    return (
      <ErrorMessage>
        <h2>Failed to load post</h2>
        <p>{error.message}</p>
        <button onClick={() => queryClient.invalidateQueries(['post', id])}>
          Try Again
        </button>
      </ErrorMessage>
    )
  }
  
  return <div>{data.title}</div>
}
```

---

## Performance Optimization

### 1. Code Splitting

```javascript
import { lazy, Suspense } from 'react'

const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Suspense>
  )
}
```

### 2. Memoization

```javascript
import { memo, useMemo, useCallback } from 'react'

// Memoize component
const PostCard = memo(function PostCard({ post }) {
  return <div>{post.title}</div>
})

// Memoize expensive calculation
function PostList({ posts }) {
  const sortedPosts = useMemo(() => {
    return posts.sort((a, b) => b.likes.length - a.likes.length)
  }, [posts])
  
  return <div>{sortedPosts.map(post => <PostCard post={post} />)}</div>
}

// Memoize callback
function Parent() {
  const handleClick = useCallback(() => {
    console.log('clicked')
  }, [])
  
  return <Child onClick={handleClick} />
}
```

### 3. Virtual Scrolling (if implemented)

```javascript
import { FixedSizeList } from 'react-window'

function PostList({ posts }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <PostCard post={posts[index]} />
    </div>
  )
  
  return (
    <FixedSizeList
      height={600}
      itemCount={posts.length}
      itemSize={200}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  )
}
```

---

## Summary

The frontend follows modern React patterns:
- **Hooks-based**: Functional components with hooks
- **Context for global state**: Auth state shared across app
- **TanStack Query for server state**: Automatic caching and refetching
- **Service layer**: Encapsulated API calls
- **Styled Components**: Component-scoped styling with theming
- **Protected routes**: Authentication and authorization checks
- **Optimistic updates**: Instant UI feedback
- **Error boundaries**: Graceful error handling
- **Code splitting**: Lazy loading for performance

The architecture is maintainable, testable, and follows React best practices.
