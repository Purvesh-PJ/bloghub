import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AdminLayout } from './components/layout/AdminLayout';
import { ProtectedRoute } from './guards/ProtectedRoute';
import { AdminRoute } from './guards/AdminRoute';
import { Spinner } from './components/ui/Spinner';

// Helper for lazy loading named exports
const lazyPage = (importFn, name) =>
  lazy(() => importFn().then((module) => ({ default: module[name] })));

// Public Pages
const Home = lazyPage(() => import('./pages/Home'), 'Home');
const Login = lazyPage(() => import('./pages/Login'), 'Login');
const Register = lazyPage(() => import('./pages/Register'), 'Register');
const PostDetail = lazyPage(() => import('./pages/PostDetail'), 'PostDetail');
const Search = lazyPage(() => import('./pages/Search'), 'Search');
const NotFound = lazyPage(() => import('./pages/NotFound'), 'NotFound');
const UserProfile = lazyPage(() => import('./pages/UserProfile'), 'UserProfile');

// User Pages (Protected)
const WritePost = lazyPage(() => import('./pages/WritePost'), 'WritePost');
const Dashboard = lazyPage(() => import('./pages/Dashboard'), 'Dashboard');
const Settings = lazyPage(() => import('./pages/Settings'), 'Settings');

// Admin Pages
const AdminDashboard = lazyPage(() => import('./pages/admin/Dashboard'), 'AdminDashboard');
const AdminPosts = lazyPage(() => import('./pages/admin/Posts'), 'AdminPosts');
const AdminCategories = lazyPage(() => import('./pages/admin/Categories'), 'AdminCategories');
const AdminUsers = lazyPage(() => import('./pages/admin/Users'), 'AdminUsers');
const AdminSettings = lazyPage(() => import('./pages/admin/Settings'), 'AdminSettings');

function App() {
  return (
    <Suspense
      fallback={
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
          <Spinner size="40px" />
        </div>
      }
    >
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
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
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

          {/*
            /profile, /my-posts and /analytics were three views of one question and are now
            the dashboard. They are kept as redirects because they are in browser histories,
            in the old header menu, and quite possibly in somebody's bookmarks.
          */}
          <Route path="profile" element={<Navigate to="/dashboard" replace />} />
          <Route path="my-posts" element={<Navigate to="/dashboard" replace />} />
          <Route path="analytics" element={<Navigate to="/dashboard" replace />} />

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
    </Suspense>
  );
}

export default App;
