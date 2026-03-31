import apiClient from '../../../lib/apiClient.js';

export async function fetchPronunciationByLetter(letter) {
  const response = await apiClient.get(`/pronunciation/${letter}`);
  return response.data.data;
}
