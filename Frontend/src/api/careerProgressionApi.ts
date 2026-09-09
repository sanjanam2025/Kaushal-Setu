import apiClient from './apiClient';

export interface NextRole {
  role_id?: string;
  role_name?: string;
  level?: string;
  salary_range?: string;
  required_experience_years?: number;
  skills_needed?: string[];
  [key: string]: unknown;
}

export interface CareerPathway {
  pathway_id?: string;
  pathway_name?: string;
  description?: string;
  roles?: NextRole[];
  [key: string]: unknown;
}

export interface CareerProgressionData {
  role_id: string;
  role_name?: string;
  current_level?: string;
  progression_options?: NextRole[];
  next_roles?: NextRole[];
  pathways?: CareerPathway[];
  [key: string]: unknown;
}

export const careerProgressionApi = {
  getCareerProgression: (roleId: string) =>
    apiClient.get(`/roles/${roleId}/career-progression`),

  getNextRoles: (roleId: string) =>
    apiClient.get(`/roles/${roleId}/next-roles`),

  getCareerPathways: (roleId: string) =>
    apiClient.get(`/roles/${roleId}/career-pathways`),
};

export default careerProgressionApi;
