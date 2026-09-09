import apiClient from './apiClient';

export interface JobReadinessData {
  role_id?: string;
  match_score?: number;
  matched_skills?: unknown[];
  missing_skills?: unknown[];
  total_required_skills?: number;
  total_matched_skills?: number;
  mandatory_requirements_satisfied?: boolean;
  job_readiness?: string | number | boolean | Record<string, unknown>;
  readiness_status?: string;
  [key: string]: unknown;
}

export const jobReadinessApi = {
  getJobReadiness: (roleId: string) =>
    apiClient.get(`/roles/${roleId}/job-readiness`),

  getMatchScore: (roleId: string) =>
    apiClient.get(`/roles/${roleId}/match-score`),

  checkMandatoryRequirements: (roleId: string) =>
    apiClient.get(`/roles/${roleId}/mandatory-check`),
};

export default jobReadinessApi;
