export const createAttemptValidator = (req) => {
  const { gameId, score, timeTaken } = req.body;

  if (!gameId || typeof gameId !== 'string') {
    return { error: { field: 'gameId', message: 'gameId is required' } };
  }

  if (typeof score !== 'number' || score < 0 || score > 100) {
    return { error: { field: 'score', message: 'score must be a number between 0 and 100' } };
  }

  if (typeof timeTaken !== 'number' || timeTaken < 1) {
    return { error: { field: 'timeTaken', message: 'timeTaken must be a positive number' } };
  }

  return {
    value: {
      gameId,
      score,
      timeTaken
    }
  };
};
