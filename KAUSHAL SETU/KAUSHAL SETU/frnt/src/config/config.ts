/**
 * Kaushal Setu frontend configuration.
 * The API base URL is the only environment-dependent value; everything
 * else is static product identity.
 */

export const config = {
  appName: 'Kaushal Setu',
  appTagline: 'Bridge your skills to your career',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://kaushal-setu-yy27.onrender.com/api',
  tokenStorageKey: 'kaushalsetu_token',
  userStorageKey: 'kaushalsetu_user',
  routes: {
    home: '/',
    login: '/login',
    register: '/register',
    dashboard: '/dashboard',
    skills: '/skills',
    assessment: '/assessment',
    career: '/career',
    learning: '/learning',
    jobs: '/jobs',
    jobMatching: '/matching',
    market: '/market',
  },
} as const;

export default config;
