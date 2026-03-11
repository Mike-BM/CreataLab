// Admin authentication using JWT via backend
import { appConfig } from './config';

const ADMIN_TOKEN_KEY = 'admin_token';
const ADMIN_SESSION_KEY = 'admin_session';

export const adminAuth = {
  login: async (email, password) => {
    try {
      const apiBaseUrl = appConfig.api.postsBase ? appConfig.api.postsBase.replace('/posts', '') : '/api';
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      if (data.token) {
        localStorage.setItem(ADMIN_TOKEN_KEY, data.token);

        // Also set a session object for legacy compatibility/frontend quick checks
        const session = {
          authenticated: true,
          timestamp: Date.now(),
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        };
        localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
        return true;
      }
      return false;
    } catch (e) {
      console.error("Login failed:", e);
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_SESSION_KEY);
  },

  isAuthenticated: () => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return false;

    // Check if simple session expired
    const session = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!session) return false;

    try {
      const parsed = JSON.parse(session);
      if (parsed.authenticated && Date.now() < parsed.expiresAt) {
        return true;
      }
      adminAuth.logout();
      return false;
    } catch {
      return false;
    }
  },

  getToken: () => {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  },

  getSession: () => {
    const session = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!session) return null;
    try {
      return JSON.parse(session);
    } catch {
      return null;
    }
  },
};
