import apiClient from '../../../lib/apiClient.js';

export async function createAttempt(payload) {
  const response = await apiClient.post('/progress/attempt', payload);
  return response.data.data.attempt;
}

export async function fetchProgressSummary() {
  const response = await apiClient.get('/progress/summary');
  return response.data.data;
}
