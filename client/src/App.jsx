import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './guards/ProtectedRoute';
import { AdminRoute } from './guards/AdminRoute';

import styled, { keyframes } from 'styled-components';
import { Home } from './pages/Home';

// Helper for lazy loading named exports
const lazyPage = (importFn, name) =>
  lazy(() => importFn().then((module) => ({ default: module[name] })));

/*
  The two private shells are lazy as well.

  Only the public Layout is needed to render anything a signed-out visitor can reach, and both
  of these carry their own navigation, avatar menu and theme controls. Importing them eagerly
  put the creator workspace and the whole administration console into the bundle every reader
  downloads to look at the landing page.
*/
const WorkspaceLayout = lazyPage(
  () => import('./components/layout/WorkspaceLayout'),
  'WorkspaceLayout'
);
const AdminLayout = lazyPage(() => import('./components/layout/AdminLayout'), 'AdminLayout');

// Public Pages (Home loaded eagerly for instant landing)
const Login = lazyPage(() => import('./pages/Login'), 'Login');
const Register = lazyPage(() => import('./pages/Register'), 'Register');
const PostDetail = lazyPage(() => import('./pages/PostDetail'), 'PostDetail');
const Search = lazyPage(() => import('./pages/Search'), 'Search');
const NotFound = lazyPage(() => import('./pages/NotFound'), 'NotFound');
const UserProfile = lazyPage(() => import('./pages/UserProfile'), 'UserProfile');

// User Pages (Protected)
const WritePost = lazyPage(() => import('./pages/WritePost'), 'WritePost');
const Dashboard = lazyPage(() => import('./pages/Dashboard'), 'Dashboard');
const Stories = lazyPage(() => import('./pages/Stories'), 'Stories');
const Responses = lazyPage(() => import('./pages/Responses'), 'Responses');
const Settings = lazyPage(() => import('./pages/Settings'), 'Settings');

// Admin Pages
const AdminDashboard = lazyPage(() => import('./pages/admin/Dashboard'), 'AdminDashboard');
const AdminPosts = lazyPage(() => import('./pages/admin/Posts'), 'AdminPosts');
const AdminTags = lazyPage(() => import('./pages/admin/Tags'), 'AdminTags');
const AdminUsers = lazyPage(() => import('./pages/admin/Users'), 'AdminUsers');
const AdminActivity = lazyPage(() => import('./pages/admin/Activity'), 'AdminActivity');
const AdminPersonActivity = lazyPage(
  () => import('./pages/admin/PersonActivity'),
  'AdminPersonActivity'
);

const progressAnim = keyframes`
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0%); }
  100% { transform: translateX(100%); }
`;

const TopProgressBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(14, 165, 233, 0.15);
  overflow: hidden;
  z-index: 9999;

  &::after {
    content: '';
    display: block;
    width: 50%;
    height: 100%;
    background: ${({ theme }) => theme.gradients.brandBar};
    border-radius: 9999px;
    animation: ${progressAnim} 1.2s ease-in-out infinite;
  }
`;

function App() {
  return (
    <Suspense fallback={<TopProgressBar />}>
      <Routes>
        {/* Public Reader Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="post/:id" element={<PostDetail />} />
          <Route path="user/:userId" element={<UserProfile />} />
          <Route path="search" element={<Search />} />
        </Route>

        {/* Protected Creator Workspace Routes */}
        <Route
          element={
            <ProtectedRoute>
              <WorkspaceLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="stories" element={<Stories />} />
          <Route path="comments" element={<Responses />} />
          <Route path="write" element={<WritePost />} />
          <Route path="edit/:id" element={<WritePost />} />
          <Route path="settings" element={<Settings />} />

          {/* Legacy redirects */}
          <Route path="profile" element={<Navigate to="/dashboard" replace />} />
          {/* "My posts" is what /stories is now, so this one lands somewhere useful. */}
          <Route path="my-posts" element={<Navigate to="/stories" replace />} />
          <Route path="analytics" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* 404 Fallback under Reader Layout */}
        <Route path="/" element={<Layout />}>
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
          <Route path="tags" element={<AdminTags />} />
          <Route path="categories" element={<Navigate to="/admin/tags" replace />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="activity" element={<AdminActivity />} />
          <Route path="users/:userId/activity" element={<AdminPersonActivity />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
