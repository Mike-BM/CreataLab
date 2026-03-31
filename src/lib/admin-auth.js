// Admin authentication using JWT via backend
import { appConfig } from './config';

const ADMIN_TOKEN_KEY = 'admin_token';
const ADMIN_SESSION_KEY = 'admin_session';

export const adminAuth = {
  login: async (email, password) => {
    try {
      const apiBase = appConfig.api.base;
      const response = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          error: errorData.error || 'Server error', 
          details: errorData.details || '' 
        };
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
        return { success: true };
      }
      return { success: false, error: 'Token missing' };
    } catch (e) {
      console.error("Login failed:", e);
      return { success: false, error: 'Connection failure' };
    }
  },

  logout: () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_SESSION_KEY);
  },

  isAuthenticated: () => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return false;
    const session = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!session) return false;
    try {
      const parsed = JSON.parse(session);
      if (parsed.authenticated && Date.now() < parsed.expiresAt) return true;
      adminAuth.logout();
      return false;
    } catch { return false; }
  },

  getToken: () => localStorage.getItem(ADMIN_TOKEN_KEY),

  changePassword: async (currentPassword, newPassword) => {
    try {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY);
      const response = await fetch(`${appConfig.api.base}/auth/change-password`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Update failed' };
      }

      return { ok: true };
    } catch (e) {
      console.error("Password change failed:", e);
      return { success: false, error: 'Connection failure' };
    }
  }
};
