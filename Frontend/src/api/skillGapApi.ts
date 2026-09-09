import apiClient from './apiClient';

export interface SkillGapData {
  role_id: string;
  role_name?: string;
  verified_skills?: unknown[];
  required_skills?: unknown[];
  matched_skills?: unknown[];
  missing_skills?: unknown[];
  partially_matched_skills?: unknown[];
  total_required_skills?: number;
  total_matched_skills?: number;
  skill_gap_percentage?: number;
}

export const skillGapApi = {
  getSkillGap: (roleId: string) =>
    apiClient.get(`/roles/${roleId}/skill-gap`),

  getMissingSkills: (roleId: string) =>
    apiClient.get(`/roles/${roleId}/missing-skills`),

  getSkillGapSummary: (roleId: string) =>
    apiClient.get(`/roles/${roleId}/skill-gap-summary`),
};

export default skillGapApi;
