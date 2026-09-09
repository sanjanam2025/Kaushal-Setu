import apiClient from './apiClient';

export const skillVerificationApi = {
  getVerificationStatus: (skillId: string) =>
    apiClient.get(`/skills/${skillId}/verification`),

  verifySkill: (skillId: string) =>
    apiClient.post(`/skills/${skillId}/verify`),

  getVerifiedSkills: () =>
    apiClient.get('/skills/verified'),
};

export default skillVerificationApi;
