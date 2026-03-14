// Admin authentication using JWT via backend
import { appConfig } from './config';

const ADMIN_TOKEN_KEY = 'admin_token';
const ADMIN_SESSION_KEY = 'admin_session';

export const adminAuth = {
  login: async (email, password) => {
    try {
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();
      
      const response = await fetch(`${appConfig.api.base}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
      });

      if (!response.ok) {
        if (response.status === 401) return { ok: false, reason: 'invalid_credentials' };
        if (response.status >= 500) return { ok: false, reason: 'server_error' };
        return { ok: false, reason: 'unknown' };
      }

      const data = await response.json();
      if (data.token) {
        localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
        const session = {
          authenticated: true,
          timestamp: Date.now(),
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        };
        localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
        return { ok: true };
      }
      return { ok: false, reason: 'no_token' };
    } catch (e) {
      console.error("Login failed:", e);
      return { ok: false, reason: 'network_error' };
    }
  },

  logout: () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_SESSION_KEY);
  },

  isAuthenticated: () => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) {
      console.log('No admin token found in localStorage');
      return false;
    }

    // Check if simple session expired
    const session = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!session) {
      console.log('No admin session found in localStorage');
      return false;
    }

    try {
      const parsed = JSON.parse(session);
      if (parsed.authenticated && Date.now() < parsed.expiresAt) {
        console.log('Admin session is valid');
        return true;
      }
      console.warn('Admin session expired or invalid:', parsed);
      adminAuth.logout();
      return false;
    } catch (e) {
      console.error('Error parsing admin session:', e);
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

  // Change the admin password via the backend API
  changePassword: async (currentPassword, newPassword) => {
    try {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY);
      const response = await fetch(`${appConfig.api.base}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { ok: false, reason: data.reason || 'unknown' };
      }
      return { ok: true };
    } catch (e) {
      console.error('changePassword error:', e);
      return { ok: false, reason: 'network_error' };
    }
  },
  
  // Update admin account (email or password)
  updateAccount: async (currentPassword, newEmail, newPassword) => {
    try {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY);
      const response = await fetch(`${appConfig.api.base}/auth/update-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newEmail, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { ok: false, reason: data.reason || 'unknown' };
      }
      return { ok: true };
    } catch (e) {
      console.error('updateAccount error:', e);
      return { ok: false, reason: 'network_error' };
    }
  },
};
