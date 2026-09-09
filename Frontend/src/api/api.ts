import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { config } from '../config/config';

/**
 * Axios instance configured for KaushalSetu Flask REST API.
 * Uses environment variable VITE_API_BASE_URL (defaults to http://localhost:5000/api).
 */
export const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor: Attach JWT authentication token if available
apiClient.interceptors.request.use(
  (reqConfig: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(config.tokenStorageKey);
    if (token && reqConfig.headers) {
      reqConfig.headers.Authorization = `Bearer ${token}`;
    }
    return reqConfig;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle common response states
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized: clear local credentials if expired
      localStorage.removeItem(config.tokenStorageKey);
      localStorage.removeItem(config.userStorageKey);
    }
    return Promise.reject(error);
  }
);

// API Service definitions mapped to the Flask REST API endpoints
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post('/auth/login', credentials),
  register: (userData: { name: string; email: string; password: string; role?: string }) =>
    apiClient.post('/auth/register', userData),
  getCurrentUser: () => apiClient.get('/auth/me'),
  logout: () => apiClient.post('/auth/logout'),
};

export const skillsApi = {
  getAllSkills: () => apiClient.get('/skills'),
  getUserSkills: (userId?: string) => apiClient.get(userId ? `/skills/user/${userId}` : '/skills/user'),
  addUserSkill: (data: { skill_name: string; proficiency_level: string; experience_years?: number }) =>
    apiClient.post('/skills/user', data),
  deleteUserSkill: (skillId: string) => apiClient.delete(`/skills/user/${skillId}`),
};

export const assessmentApi = {
  getAssessments: () => apiClient.get('/assessments'),
  getAssessmentById: (id: string) => apiClient.get(`/assessments/${id}`),
  submitAssessment: (id: string, answers: Record<string, unknown>) =>
    apiClient.post(`/assessments/${id}/submit`, { answers }),
  getAssessmentResults: (id: string) => apiClient.get(`/assessments/${id}/results`),
};

export const jobsApi = {
  getJobs: (params?: { search?: string; location?: string; skill?: string }) =>
    apiClient.get('/jobs', { params }),
  getJobById: (id: string) => apiClient.get(`/jobs/${id}`),
  applyForJob: (id: string, applicationData?: Record<string, unknown>) =>
    apiClient.post(`/jobs/${id}/apply`, applicationData),
};

export const jobMatchingApi = {
  getMatchingJobs: (params?: { threshold?: number }) =>
    apiClient.get('/matching/jobs', { params }),
  getSkillGapAnalysis: (jobId: string) =>
    apiClient.get(`/matching/analysis/${jobId}`),
};

export const labourMarketApi = {
  getMarketTrends: (params?: { sector?: string; region?: string }) =>
    apiClient.get('/market/trends', { params }),
  getInDemandSkills: (params?: { limit?: number }) =>
    apiClient.get('/market/in-demand-skills', { params }),
  getSalaryInsights: (params?: { role?: string }) =>
    apiClient.get('/market/salaries', { params }),
};

export const curriculumApi = {
  getCurricula: (params?: { skill?: string; level?: string }) =>
    apiClient.get('/curriculum', { params }),
  getCurriculumDetails: (id: string) => apiClient.get(`/curriculum/${id}`),
  getRecommendedRoadmap: () => apiClient.get('/curriculum/recommendations'),
};

// Health check endpoint helper for verifying Flask connection
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    await apiClient.get('/health', { timeout: 3000 });
    return true;
  } catch {
    return false;
  }
};

export default apiClient;
