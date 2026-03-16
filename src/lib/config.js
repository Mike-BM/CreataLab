/**
 * Application configuration
 * Centralized configuration for URLs and external resources
 */

export const appConfig = {
  // Brand Assets
  branding: {
    name: import.meta.env.VITE_COMPANY_NAME || 'creatalab',
    logoUrl: import.meta.env.VITE_LOGO_URL || '/Logo.png',
    tagline: import.meta.env.VITE_COMPANY_TAGLINE || 'Creative-Tech Innovation Lab',
  },

  socialLinks: {
    instagram: import.meta.env.VITE_SOCIAL_INSTAGRAM || 'https://www.instagram.com/creatalab',
    tiktok: import.meta.env.VITE_SOCIAL_TIKTOK || 'https://www.tiktok.com/@creatalab_ltd',
    whatsapp: import.meta.env.VITE_SOCIAL_WHATSAPP || 'https://wa.me/0753436729',
  },

  // API endpoints (set these via environment variables in production)
  api: {
    get base() {
      const isLocal = typeof window !== 'undefined' && 
        (window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1');
      return isLocal ? 'http://localhost:4000/api' : '/api';
    },
    get contact() { return `${this.base}/contact`; },
    get bookings() { return `${this.base}/bookings`; },
    postsBase: import.meta.env.VITE_POSTS_API_BASE || '',
  },
};

/**
 * Updates the global appConfig with settings fetched from the backend.
 * This allows administrators to override environment variables via the Admin Portal.
 */
export const syncAppConfig = (settings) => {
  if (settings.branding) {
    appConfig.branding = { ...appConfig.branding, ...settings.branding };
  }
  if (settings.socials) {
    appConfig.socialLinks = { ...appConfig.socialLinks, ...settings.socials };
  }
};
