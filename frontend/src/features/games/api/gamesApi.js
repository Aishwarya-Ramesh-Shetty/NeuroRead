import apiClient from '../../../lib/apiClient.js';
import { mapEntityId } from '../../../utils/api.js';

export async function fetchGames() {
  const response = await apiClient.get('/games');
  return response.data.data.games.map((game) => mapEntityId(game));
}

export async function fetchPersonalizedGames() {
  const response = await apiClient.get('/games/personalized');

  return {
    currentLevel: response.data.data.currentLevel,
    games: response.data.data.games.map((game) => mapEntityId(game))
  };
}

export async function fetchGameQuestions(gameId, personalized = false) {
  const suffix = personalized ? 'personalized-questions' : 'questions';
  const response = await apiClient.get(`/games/${gameId}/${suffix}`);
  return response.data.data.questions.map((question) => mapEntityId(question));
}
