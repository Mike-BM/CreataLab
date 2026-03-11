/**
 * Application configuration
 * Centralized configuration for URLs and external resources
 */

export const appConfig = {
  // Logo URL - can be overridden via environment variable
  logoUrl: import.meta.env.VITE_LOGO_URL || '/Logo.png',

  socialLinks: {
    instagram: import.meta.env.VITE_SOCIAL_INSTAGRAM || 'https://www.instagram.com/creatalab?igsh=NjM5cG9yajJhdzE1',
    tiktok: import.meta.env.VITE_SOCIAL_TIKTOK || 'https://www.tiktok.com/@creatalab_ltd',
    whatsapp: import.meta.env.VITE_SOCIAL_WHATSAPP || 'https://wa.me/0753436729',
  },

  // API endpoints (automatically handles both local dev and Vercel production)
  api: {
    contact: typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:4000/api/contact' : '/api/contact',
    bookings: typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:4000/api/bookings' : '/api/bookings',
    postsBase: typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:4000/api/posts' : '/api/posts',
  },

  // Company information
  company: {
    name: import.meta.env.VITE_COMPANY_NAME || 'CreataLab',
    tagline: import.meta.env.VITE_COMPANY_TAGLINE || 'Creative-Tech Innovation Lab',
  },
};
