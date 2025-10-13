import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Routing } from './Routing';
import { AuthProvider } from './context/AuthContext';
import { ToggleProvider } from './context/ToggleContext';
import GlobalStyle from './components/common/theme/globalStyle';
import AppThemeProvider from './components/common/theme/appThemeProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <AppThemeProvider>
    <GlobalStyle />
    <ToastContainer />
    <BrowserRouter>
      <StrictMode>
        <ToggleProvider>
          <AuthProvider>
            <Routing />
          </AuthProvider>
        </ToggleProvider>
      </StrictMode>
    </BrowserRouter>
  </AppThemeProvider>,
);
