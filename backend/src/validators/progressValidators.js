export const createAttemptValidator = (req) => {
  const { gameId, score, timeTaken, isCompleted = false, accuracy = null } = req.body;

  if (!gameId || typeof gameId !== 'string') {
    return { error: { field: 'gameId', message: 'gameId is required' } };
  }

  if (typeof score !== 'number' || score < 0 || score > 100) {
    return { error: { field: 'score', message: 'score must be a number between 0 and 100' } };
  }

  if (typeof timeTaken !== 'number' || timeTaken < 1) {
    return { error: { field: 'timeTaken', message: 'timeTaken must be a positive number' } };
  }

  if (typeof isCompleted !== 'boolean') {
    return { error: { field: 'isCompleted', message: 'isCompleted must be a boolean value' } };
  }

  if (accuracy !== null && (typeof accuracy !== 'number' || accuracy < 0 || accuracy > 100)) {
    return { error: { field: 'accuracy', message: 'accuracy must be a number between 0 and 100' } };
  }

  return {
    value: {
      gameId,
      score,
      timeTaken,
      isCompleted,
      accuracy
    }
  };
};
