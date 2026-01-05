import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AdminLayout } from './components/layout/AdminLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AdminRoute } from './components/common/AdminRoute';

// Public Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { PostDetail } from './pages/PostDetail';
import { Search } from './pages/Search';
import { NotFound } from './pages/NotFound';
import { UserProfile } from './pages/UserProfile';

// User Pages (Protected)
import { WritePost } from './pages/WritePost';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { MyPosts } from './pages/MyPosts';
import { Analytics } from './pages/Analytics';

// Admin Pages
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminPosts } from './pages/admin/Posts';
import { AdminCategories } from './pages/admin/Categories';
import { AdminUsers } from './pages/admin/Users';
import { AdminSettings } from './pages/admin/Settings';

function App() {
  return (
    <Routes>
      {/* Public and User Routes */}
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="post/:id" element={<PostDetail />} />
        <Route path="user/:userId" element={<UserProfile />} />
        <Route path="search" element={<Search />} />

        {/* Protected User Routes */}
        <Route
          path="write"
          element={
            <ProtectedRoute>
              <WritePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="edit/:id"
          element={
            <ProtectedRoute>
              <WritePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-posts"
          element={
            <ProtectedRoute>
              <MyPosts />
            </ProtectedRoute>
          }
        />
        <Route
          path="analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="posts" element={<AdminPosts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}

export default App;
