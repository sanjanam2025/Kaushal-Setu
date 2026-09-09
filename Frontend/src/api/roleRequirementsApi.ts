import apiClient from './apiClient';

export interface RoleRequirement {
  id?: string;
  skill_id?: string;
  skill_name?: string;
  competency_name?: string;
  required_level?: string;
  is_mandatory?: boolean;
  importance?: number;
}

export const roleRequirementsApi = {
  getRoleRequirements: (roleId: string) =>
    apiClient.get(`/roles/${roleId}/requirements`),

  getRequiredCompetencies: (roleId: string) =>
    apiClient.get(`/roles/${roleId}/competencies`),

  getMandatoryRequirements: (roleId: string) =>
    apiClient.get(`/roles/${roleId}/mandatory-requirements`),
};

export default roleRequirementsApi;
