import apiClient from './apiClient';

export interface SkillLearningProgress {
  skill_id?: string;
  skill_name?: string;
  progress_percentage?: number;
  status?: string;
  started_at?: string;
  completed_at?: string | null;
  milestones?: unknown[];
  completed_milestones?: number;
  learning_time?: string | number;
  last_activity?: string;
  [key: string]: unknown;
}

export interface UserLearningProgressData {
  user_id?: string;
  total_skills_in_progress?: number;
  completed_skills_count?: number;
  overall_progress_percentage?: number;
  skills_progress?: SkillLearningProgress[];
  [key: string]: unknown;
}

export interface UpdateLearningProgressPayload {
  progress_percentage?: number;
  status?: string;
  completed_milestones?: number;
  learning_time?: string | number;
  [key: string]: unknown;
}

export const learningProgressApi = {
  getUserLearningProgress: () =>
    apiClient.get('/learning-progress'),

  getSkillLearningProgress: (skillId: string) =>
    apiClient.get(`/learning-progress/skills/${skillId}`),

  startSkillLearning: (skillId: string, data?: unknown) =>
    apiClient.post(`/learning-progress/skills/${skillId}/start`, data),

  updateSkillLearningProgress: (skillId: string, data?: UpdateLearningProgressPayload) =>
    apiClient.put(`/learning-progress/skills/${skillId}`, data),

  completeSkillLearning: (skillId: string, data?: unknown) =>
    apiClient.post(`/learning-progress/skills/${skillId}/complete`, data),
};

export default learningProgressApi;
