import apiClient from './apiClient';

export interface EmploymentOutcomeData {
  outcome_id?: string;
  application_id?: string;
  job_id?: string;
  user_id?: string;
  employment_status?: string;
  outcome?: string;
  selected?: boolean;
  employer_feedback?: string;
  decision_date?: string;
  start_date?: string | null;
  rejection_reason?: string | null;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export const employmentOutcomeApi = {
  getUserEmploymentOutcomes: () =>
    apiClient.get('/employment-outcomes'),

  getApplicationOutcome: (applicationId: string) =>
    apiClient.get(`/employment-outcomes/applications/${applicationId}`),

  getJobApplicationOutcome: (jobId: string, applicationId?: string) =>
    applicationId
      ? apiClient.get(`/jobs/${jobId}/applications/${applicationId}/outcome`)
      : apiClient.get(`/jobs/${jobId}/outcome`),

  getLatestEmploymentStatus: () =>
    apiClient.get('/employment-outcomes/latest-status'),
};

export default employmentOutcomeApi;
