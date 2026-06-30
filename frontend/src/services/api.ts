import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api',
  withCredentials: true,
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nodus_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('nodus_token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(err);
  },
);

export const casesApi = {
  list: (params?: object) => api.get('/cases', { params }),
  get: (id: string) => api.get(`/cases/${id}`),
  create: (data: object) => api.post('/cases', data),
  update: (id: string, data: object) => api.patch(`/cases/${id}`, data),
  transition: (id: string, notes?: string) => api.patch(`/cases/${id}/status`, { notes }),
  auditLog: (id: string) => api.get(`/cases/${id}/audit-log`),
};

export const companiesApi = {
  list: () => api.get('/companies'),
  get: (id: string) => api.get(`/companies/${id}`),
  create: (data: object) => api.post('/companies', data),
};

export const consultantsApi = {
  list: () => api.get('/consultants'),
  bolsa: () => api.get('/bolsa'),
  apply: (caseId: string, data: object) => api.post(`/cases/${caseId}/applications`, data),
  assign: (caseId: string, consultantId: string) =>
    api.post(`/applications/${caseId}/evaluate`, { consultantId, decision: 'asignada' }),
};

export const proposalsApi = {
  create: (caseId: string, data: object) => api.post(`/cases/${caseId}/proposals`, data),
  update: (id: string, data: object) => api.put(`/proposals/${id}`, data),
  addReview: (id: string, data: object) => api.post(`/proposals/${id}/methodological-review`, data),
  authorize: (id: string) => api.post(`/proposals/${id}/authorize-send`),
};

export const contractingApi = {
  getChecklist: (caseId: string) => api.get(`/cases/${caseId}/checklist`),
  updateItem: (caseId: string, itemId: string, data: object) =>
    api.patch(`/cases/${caseId}/checklist/${itemId}`, data),
  saveFramework: (caseId: string, data: object) =>
    api.post(`/cases/${caseId}/operational-framework`, data),
};

export const slaApi = {
  getAlerts: () => api.get('/sla/alerts'),
  getRules: () => api.get('/sla/rules'),
  updateRules: (data: object) => api.put('/sla/rules', data),
};

export const pmoApi = {
  kpis: () => api.get('/pmo/kpis'),
};

export default api;
