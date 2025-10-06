import React, { StrictMode }  from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Routing } from './Routing';
import { AuthProvider } from '../src/context/AuthContext';
import { ToggleProvider } from './context/ToggleContext';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import GlobalStyle from './styles/theme/GlobalStyle';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ThemeProvider theme={theme}>
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
  </ThemeProvider>
);
