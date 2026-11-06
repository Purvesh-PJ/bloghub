import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute, AdminRoute } from './features/auth';

import { Home } from './features/posts';

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
const AdminLayout = lazyPage(() => import('./features/admin'), 'AdminLayout');

// Public Pages (Home loaded eagerly for instant landing)
const Login = lazyPage(() => import('./features/auth'), 'Login');
const Register = lazyPage(() => import('./features/auth'), 'Register');
const PostDetail = lazyPage(() => import('./features/posts'), 'PostDetail');
const Search = lazyPage(() => import('./features/posts'), 'Search');
const NotFound = lazyPage(() => import('./components/layout/NotFound'), 'NotFound');
const UserProfile = lazyPage(() => import('./features/users'), 'UserProfile');

// User Pages (Protected)
const WritePost = lazyPage(() => import('./features/posts'), 'WritePost');
const Dashboard = lazyPage(() => import('./features/users'), 'Dashboard');
const Stories = lazyPage(() => import('./features/posts'), 'Stories');
const Responses = lazyPage(() => import('./features/comments'), 'Responses');
const Settings = lazyPage(() => import('./features/users'), 'Settings');

// Admin Pages
const AdminDashboard = lazyPage(() => import('./features/admin'), 'AdminDashboard');
const AdminPosts = lazyPage(() => import('./features/admin'), 'AdminPosts');
const AdminTags = lazyPage(() => import('./features/admin'), 'AdminTags');
const AdminUsers = lazyPage(() => import('./features/admin'), 'AdminUsers');
const AdminActivity = lazyPage(() => import('./features/admin'), 'AdminActivity');
const AdminPersonActivity = lazyPage(() => import('./features/admin'), 'AdminPersonActivity');

// Top route suspense progress bar
const TopProgressBar = () => (
  <div className="fixed top-0 left-0 right-0 h-[3px] bg-sky-500/15 overflow-hidden z-[9999]">
    <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-sky-400 to-sky-600 animate-top-progress" />
  </div>
);

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
