import apiClient from './apiClient';

export interface CareerDiscoveryData {
  interests?: string[];
  preferences?: string[];
  engineering_field?: string;
  location?: string;
}

export const careerApi = {
  discoverRoles: (data: CareerDiscoveryData) =>
    apiClient.post('/career/discover', data),

  getRecommendedRoles: () =>
    apiClient.get('/career/recommendations'),

  selectTargetRole: (roleId: string) =>
    apiClient.post('/career/target-role', {
      role_id: roleId,
    }),

  getTargetRole: () =>
    apiClient.get('/career/target-role'),
};

export default careerApi;
