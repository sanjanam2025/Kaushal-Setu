import apiClient from './apiClient';

export interface RoadmapMilestone {
  id?: string;
  stage_number?: number;
  title?: string;
  description?: string;
  skills_covered?: string[];
  estimated_duration?: string;
  resources?: unknown[];
  [key: string]: unknown;
}

export interface LearningRoadmapData {
  role_id: string;
  role_name?: string;
  total_stages?: number;
  estimated_completion_time?: string;
  milestones?: RoadmapMilestone[];
  learning_path?: unknown[];
  recommended_courses?: unknown[];
  [key: string]: unknown;
}

export const learningRoadmapApi = {
  getLearningRoadmap: (roleId: string) =>
    apiClient.get(`/roles/${roleId}/roadmap`),

  getRecommendedLearningPath: (roleId: string) =>
    apiClient.get(`/roles/${roleId}/recommended-path`),

  getRoadmapMilestones: (roleId: string) =>
    apiClient.get(`/roles/${roleId}/milestones`),
};

export default learningRoadmapApi;
