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
    whatsapp: import.meta.env.VITE_SOCIAL_WHATSAPP || 'https://wa.me/254753436729?text=Hello%20Welcome%20to%20CreataLab%20%E2%80%93%20Where%20Creativity%20Meets%20Data!%20We%20craft%20Graphic%20Design%2C%20Branding%2C%20Data%20Analysis%2C%20AI%2C%20and%20Web%20Development%20solutions%20that%20elevate%20your%20ideas.%20Let%E2%80%99s%20create%20something%20extraordinary%20%E2%80%93%20how%20can%20we%20help%20you%20today%3F',
  },

  // API endpoints (automatically handles both local dev and Vercel production)
  api: {
    base: import.meta.env.VITE_POSTS_API_BASE || (import.meta.env.DEV ? 'http://localhost:4000/api' : '/api'),
    contact: import.meta.env.VITE_CONTACT_API_URL || (import.meta.env.DEV ? 'http://localhost:4000/api/contact' : '/api/contact'),
    bookings: import.meta.env.VITE_BOOKING_API_URL || (import.meta.env.DEV ? 'http://localhost:4000/api/bookings' : '/api/bookings'),
  },

  // Company information
  company: {
    name: import.meta.env.VITE_COMPANY_NAME || 'CreataLab',
    tagline: import.meta.env.VITE_COMPANY_TAGLINE || 'Creative-Tech Innovation Lab',
  },
};
