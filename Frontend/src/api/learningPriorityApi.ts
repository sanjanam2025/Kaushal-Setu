import apiClient from './apiClient';

export interface LearningPriorityData {
  role_id: string;
  role_name?: string;
  priority_skills?: unknown[];
  recommended_skills?: unknown[];
  next_best_skill?: unknown;
  learning_priorities?: unknown[];
  priority_order?: number;
  readiness_impact?: unknown;
  recommendation_reason?: string;
}

export const learningPriorityApi = {
  getLearningPriorities: (roleId: string) =>
    apiClient.get(`/roles/${roleId}/learning-priorities`),

  getNextBestSkill: (roleId: string) =>
    apiClient.get(`/roles/${roleId}/next-best-skill`),

  getRecommendedSkills: (roleId: string) =>
    apiClient.get(`/roles/${roleId}/recommended-skills`),
};

export default learningPriorityApi;
