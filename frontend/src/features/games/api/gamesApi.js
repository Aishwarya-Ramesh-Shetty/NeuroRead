import apiClient from '../../../lib/apiClient.js';
import { mapEntityId } from '../../../utils/api.js';

export async function fetchGames() {
  const response = await apiClient.get('/games');
  return response.data.data.games.map((game) => mapEntityId(game));
}

export async function fetchGameQuestions(gameId) {
  const response = await apiClient.get(`/games/${gameId}/questions`);
  return response.data.data.questions.map((question) => mapEntityId(question));
}
