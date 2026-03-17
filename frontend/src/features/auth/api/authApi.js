import apiClient from '../../../lib/apiClient.js';
import { mapEntityId } from '../../../utils/api.js';

export async function loginStudent(payload) {
  const response = await apiClient.post('/auth/login', payload);
  const session = response.data.data;

  return {
    token: session.token,
    user: mapEntityId(session.user)
  };
}

export async function registerStudent(payload) {
  const response = await apiClient.post('/auth/register', payload);
  const session = response.data.data;

  return {
    token: session.token,
    user: mapEntityId(session.user)
  };
}

export async function fetchCurrentStudent() {
  const response = await apiClient.get('/auth/me');
  return mapEntityId(response.data.data.user);
}
