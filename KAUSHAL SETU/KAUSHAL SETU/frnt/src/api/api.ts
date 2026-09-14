import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { config } from '../config/config';

/**
 * Axios instance for the Kaushal Setu Flask API.
 * Attaches the JWT from local storage and clears it on 401 responses.
 */
export const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  (reqConfig: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(config.tokenStorageKey);
    if (token && reqConfig.headers) {
      reqConfig.headers.Authorization = `Bearer ${token}`;
    }
    return reqConfig;
  },
  (error: AxiosError) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && !window.location.pathname.startsWith('/login')) {
      localStorage.removeItem(config.tokenStorageKey);
      localStorage.removeItem(config.userStorageKey);
    }
    return Promise.reject(error);
  },
);

/** Extract the backend's message field from an API error, with a friendly fallback. */
export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (data?.message) return data.message;
    if (error.code === 'ECONNABORTED') return 'The request timed out. Is the backend server running?';
    if (!error.response) return 'Cannot reach the server. Check your connection and that the backend is running.';
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

// ------------------------------------------------------------------
// Auth
// ------------------------------------------------------------------
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post('/auth/login', credentials),
  register: (userData: { name: string; email: string; password: string }) =>
    apiClient.post('/auth/register', userData),
  getCurrentUser: () => apiClient.get('/auth/me'),
  logout: () => apiClient.post('/auth/logout'),
};

// ------------------------------------------------------------------
// Skills
// ------------------------------------------------------------------
export interface UserSkill {
  id: number;
  user_id: number;
  skill: string;
  assessment_score: number | null;
}

export const skillsApi = {
  getAllSkills: () => apiClient.get('/skills'),
  getUserSkills: () => apiClient.get<UserSkill[]>('/skills/user'),
  addUserSkill: (data: { skill_name: string; proficiency_level: string }) =>
    apiClient.post('/skills/user', data),
  deleteUserSkill: (skillId: number | string) => apiClient.delete(`/skills/user/${skillId}`),
};

// ------------------------------------------------------------------
// Assessments
// ------------------------------------------------------------------
export interface AssessmentMeta {
  id: string;
  title: string;
  discipline: string;
  duration: string;
  level: string;
  primarySkill: string;
  skillsCovered: string[];
  status?: string;
}

export interface AssessmentQuestion {
  id: number;
  question: string;
  options: string[];
}

export interface AssessmentDetail extends AssessmentMeta {
  questions: AssessmentQuestion[];
}

export const assessmentApi = {
  getAssessments: () => apiClient.get('/assessments'),
  getAssessment: (id: string) => apiClient.get(`/assessments/${id}`),
  submitAssessment: (id: string, answers: Record<string, number>) =>
    apiClient.post(`/assessments/${id}/submit`, { answers }),
  getAssessmentResults: (id: string) => apiClient.get(`/assessments/${id}/results`),
};

// ------------------------------------------------------------------
// Jobs
// ------------------------------------------------------------------
export interface Job {
  id: number;
  job_id: string;
  title: string;
  company: string;
  location: string | null;
  required_skills: string[];
  experience: string | null;
  job_type: string | null;
  salary: string | null;
  source: string | null;
  posted_date: string | null;
  engineering_field: string | null;
}

export const jobsApi = {
  getJobs: (params?: { search?: string; location?: string; field?: string; job_type?: string }) =>
    apiClient.get('/jobs', { params }),
  getJob: (jobId: string) => apiClient.get(`/jobs/${jobId}`),
  applyForJob: (jobId: string) => apiClient.post(`/jobs/${jobId}/apply`),
  getMyApplications: () => apiClient.get('/applications'),
};

// ------------------------------------------------------------------
// Job matching
// ------------------------------------------------------------------
export interface JobMatch {
  id: number;
  job_id: string;
  title: string;
  company: string;
  location: string | null;
  required_skills: string[];
  matched_skills: string[];
  missing_skills: string[];
  match_score: number;
  experience: string | null;
  job_type: string | null;
  salary: string | null;
  engineering_field: string | null;
}

export const jobMatchingApi = {
  getMatchingJobs: (params?: { threshold?: number }) =>
    apiClient.get('/matching/jobs', { params }),
  getAnalysis: (jobId: string) => apiClient.get(`/matching/analysis/${jobId}`),
};

// ------------------------------------------------------------------
// Career
// ------------------------------------------------------------------
export const careerApi = {
  getRecommendations: () => apiClient.get('/career/recommendations'),
  getFields: () => apiClient.get('/career/fields'),
  discoverByField: (engineeringField: string | null) =>
    apiClient.post('/career/discover', { engineering_field: engineeringField }),
  getTargetRole: () => apiClient.get('/career/target-role'),
  setTargetRole: (targetRole: string) =>
    apiClient.post('/career/target-role', { target_role: targetRole }),
};

// ------------------------------------------------------------------
// Roles (role requirements / readiness)
// ------------------------------------------------------------------
export const rolesApi = {
  getRoles: () => apiClient.get('/roles'),
  getSkillGap: (roleId: number | string) => apiClient.get(`/roles/${roleId}/skill-gap`),
  getJobReadiness: (roleId: number | string) => apiClient.get(`/roles/${roleId}/job-readiness`),
  getLearningRoadmap: (roleId: number | string) => apiClient.get(`/roles/${roleId}/roadmap`),
};

// ------------------------------------------------------------------
// Learning progress
// ------------------------------------------------------------------
export interface LearningProgressRecord {
  id: number;
  skill_name: string;
  progress_percentage: number;
  status: string;
  completed_at: string | null;
}

export const learningApi = {
  getProgress: () => apiClient.get('/learning-progress'),
  startLearning: (skill: string) =>
    apiClient.post(`/learning-progress/skills/${encodeURIComponent(skill)}/start`),
  updateProgress: (skill: string, progressPercentage: number) =>
    apiClient.put(`/learning-progress/skills/${encodeURIComponent(skill)}`, {
      progress_percentage: progressPercentage,
    }),
  completeLearning: (skill: string) =>
    apiClient.post(`/learning-progress/skills/${encodeURIComponent(skill)}/complete`),
};

// ------------------------------------------------------------------
// Curriculum
// ------------------------------------------------------------------
export const curriculumApi = {
  getCurricula: () => apiClient.get('/curriculum'),
  getRecommendations: () => apiClient.get('/curriculum/recommendations'),
};

// ------------------------------------------------------------------
// Labour market
// ------------------------------------------------------------------
export const labourMarketApi = {
  getMarketTrends: () => apiClient.get('/market/trends'),
  getInDemandSkills: () => apiClient.get('/market/in-demand-skills'),
  getSalaries: () => apiClient.get('/market/salaries'),
};

// ------------------------------------------------------------------
// Dashboard summary
// ------------------------------------------------------------------
export interface DashboardSummary {
  skills: {
    items: { skill: string; score: number | null }[];
    total: number;
    verified: number;
    average_score: number;
  };
  assessments: {
    items: { assessment_id: string; attempts: number; best_score: number | null; passed: boolean }[];
    total: number;
    passed: number;
  };
  learning: {
    items: { skill: string; progress: number; status: string }[];
    total: number;
    in_progress: number;
    completed: number;
    average_progress: number;
  };
  target_role: { role_id: number; role_name: string } | null;
  applications: { total: number; by_status: Record<string, number> };
  job_matches: {
    items: JobMatch[];
    average_score: number;
    total: number;
  };
  next_step: { action: string; title: string; description: string; link: string } | null;
}

export const dashboardApi = {
  getSummary: () => apiClient.get<DashboardSummary>('/dashboard'),
};

// ------------------------------------------------------------------
// Health check
// ------------------------------------------------------------------
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    await apiClient.get('/health', { timeout: 3000 });
    return true;
  } catch {
    return false;
  }
};

export default apiClient;
