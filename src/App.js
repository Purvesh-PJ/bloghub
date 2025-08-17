import React from 'react';
import Page_Posts from './Pages/Posts/Page_Posts';
import Page_Categories from './Pages/Categories/Page_Categories';
import Page_Tags from './Pages/Tags/Page_Tags';
import Page_UserProfile from './Pages/UserProfile/Page_UserProfile';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary'; // Import ErrorBoundary
import { AuthProvider } from './context/AuthContext';
import Page_Home from './Pages/Home-Pages/Home_Main/Page_Home';
// Import your other pages here

function App() {
  return (
    <AuthProvider>
      <Router>
        <ErrorBoundary> {/* Wrap routes with ErrorBoundary */}
        </ErrorBoundary> {/* Closing tag for ErrorBoundary */}
        <Routes>
          <Route path="/" element={<Page_Home />} />
          <Route path="/posts" element={<Page_Posts />} />
          <Route path="/categories" element={<Page_Categories />} />
          <Route path="/tags" element={<Page_Tags />} />
          <Route path="/user-profile" element={<Page_UserProfile />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
