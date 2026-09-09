import apiClient from './apiClient';

export interface ReassessmentAnswer {
  question_id?: string;
  selected_option?: string | number;
  answer_text?: string;
  [key: string]: unknown;
}

export interface ReassessmentData {
  reassessment_id?: string;
  skill_id?: string;
  skill_name?: string;
  assessment_id?: string;
  answers?: ReassessmentAnswer[] | unknown[];
  score?: number;
  previous_score?: number;
  passing_score?: number;
  passed?: boolean;
  verification_status?: string;
  attempted_at?: string;
  completed_at?: string | null;
  attempt_number?: number;
  [key: string]: unknown;
}

export interface VerificationEligibilityData {
  skill_id?: string;
  is_eligible?: boolean;
  can_reassess?: boolean;
  next_eligible_date?: string | null;
  attempts_remaining?: number;
  [key: string]: unknown;
}

export const reassessmentApi = {
  startReassessment: (skillId: string, data?: unknown) =>
    apiClient.post(`/reassessments/skills/${skillId}/start`, data),

  submitReassessment: (reassessmentId: string, data: unknown) =>
    apiClient.post(`/reassessments/${reassessmentId}/submit`, data),

  getReassessmentResult: (reassessmentId: string) =>
    apiClient.get(`/reassessments/${reassessmentId}/result`),

  getReassessmentHistory: (skillId: string) =>
    apiClient.get(`/reassessments/skills/${skillId}/history`),

  getLatestReassessmentStatus: (skillId: string) =>
    apiClient.get(`/reassessments/skills/${skillId}/status`),

  checkVerificationEligibility: (skillId: string) =>
    apiClient.get(`/reassessments/skills/${skillId}/eligibility`),
};

export default reassessmentApi;
