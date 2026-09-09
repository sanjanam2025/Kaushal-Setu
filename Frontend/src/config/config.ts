/**
 * KaushalSetu Frontend Configuration
 * Manages environment configurations and Flask backend API endpoints
 */

export const config = {
  appName: 'KaushalSetu',
  appTagline: 'Bridge to Skills, Careers & Future Readiness',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  tokenStorageKey: 'kaushalsetu_token',
  userStorageKey: 'kaushalsetu_user',
  routes: {
    dashboard: '/',
    login: '/login',
    register: '/register',
    assessment: '/assessment',
    skills: '/skills',
    jobs: '/jobs',
    jobMatching: '/job-matching',
    labourMarket: '/labour-market',
    curriculum: '/curriculum',
  },
} as const;

export default config;
