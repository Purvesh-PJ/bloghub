import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AUTH_STORAGE_KEY = 'auth-storage';

// Helper to get initial state from localStorage
const getInitialState = () => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        user: parsed.user || null,
        accessToken: parsed.accessToken || null,
        refreshToken: parsed.refreshToken || null,
        isAuthenticated: parsed.isAuthenticated || false,
      };
    }
  } catch (e) {
    console.error('Failed to parse auth storage:', e);
  }
  return {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
  };
};

// Simple state holder for use outside React (api interceptors)
export const authState = {
  ...getInitialState(),
  listeners: new Set(),

  getState() {
    return {
      user: this.user,
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      isAuthenticated: this.isAuthenticated,
    };
  },

  setState(newState) {
    Object.assign(this, newState);
    this.persist();
    this.listeners.forEach((listener) => listener(this.getState()));
  },

  setAccessToken(token) {
    this.accessToken = token;
    this.persist();
    this.listeners.forEach((listener) => listener(this.getState()));
  },

  logout() {
    this.user = null;
    this.accessToken = null;
    this.refreshToken = null;
    this.isAuthenticated = false;
    this.persist();
    this.listeners.forEach((listener) => listener(this.getState()));
  },

  persist() {
    try {
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          user: this.user,
          accessToken: this.accessToken,
          refreshToken: this.refreshToken,
          isAuthenticated: this.isAuthenticated,
        })
      );
    } catch (e) {
      console.error('Failed to persist auth state:', e);
    }
  },

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, setState] = useState(() => authState.getState());

  useEffect(() => {
    // Sync React state with authState changes
    const unsubscribe = authState.subscribe((newState) => {
      setState({ ...newState });
    });
    return unsubscribe;
  }, []);

  const setAuth = useCallback((data) => {
    authState.setState({
      user: data.userdata,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      isAuthenticated: true,
    });
  }, []);

  const setAccessToken = useCallback((token) => {
    authState.setAccessToken(token);
  }, []);

  const setUser = useCallback((user) => {
    authState.setState({ ...authState.getState(), user });
  }, []);

  const logout = useCallback(() => {
    authState.logout();
  }, []);

  const isLoggedIn = useCallback(() => {
    return state.isAuthenticated && state.accessToken;
  }, [state.isAuthenticated, state.accessToken]);

  const isAdmin = useCallback(() => {
    return state.user?.roles?.includes('admin') || false;
  }, [state.user]);

  const value = {
    ...state,
    setAuth,
    setAccessToken,
    setUser,
    logout,
    isLoggedIn,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
