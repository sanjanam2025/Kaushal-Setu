import apiClient from './apiClient';

export interface RoleSkillComparison {
  role_id?: string;
  matched_skills?: unknown[];
  missing_skills?: unknown[];
  partially_matched_skills?: unknown[];
  total_required_skills?: number;
  total_matched_skills?: number;
}

export const roleSkillComparisonApi = {
  compareRoleSkills: (roleId: string) =>
    apiClient.get(`/roles/${roleId}/skill-comparison`),

  getMatchedSkills: (roleId: string) =>
    apiClient.get(`/roles/${roleId}/matched-skills`),

  getMissingSkills: (roleId: string) =>
    apiClient.get(`/roles/${roleId}/missing-skills`),
};

export default roleSkillComparisonApi;
