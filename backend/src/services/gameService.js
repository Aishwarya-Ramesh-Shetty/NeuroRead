import mongoose from 'mongoose';
import Game from '../models/Game.js';
import Question from '../models/Question.js';
import UserProgress from '../models/UserProgress.js';
import AppError from '../utils/appError.js';

const GAME_SEQUENCE_SORT = { level: 1, order: 1, createdAt: 1 };

const ensureInitialUnlockedGame = async (userId, games) => {
  if (!games.length) {
    return;
  }

  const firstGame = games[0];
  await UserProgress.findOneAndUpdate(
    { userId, gameId: firstGame._id },
    {
      $setOnInsert: {
        userId,
        gameId: firstGame._id,
        isCompleted: false,
        unlockedAt: new Date(),
        score: null
      }
    },
    { upsert: true, new: true }
  );
};

export const listGames = async () => {
  const games = await Game.find({}).sort({ createdAt: -1 });
  return games;
};

export const listPersonalizedGames = async ({ userId }) => {
  const games = await Game.find({}).sort(GAME_SEQUENCE_SORT);

  await ensureInitialUnlockedGame(userId, games);

  const progressItems = await UserProgress.find({ userId }).lean();
  const progressMap = new Map(progressItems.map((item) => [item.gameId.toString(), item]));

  const currentProgress = games.map((game, index) => {
    const progress = progressMap.get(game._id.toString());
    const previousGame = index > 0 ? games[index - 1] : null;
    const previousProgress = previousGame
      ? progressMap.get(previousGame._id.toString())
      : { isCompleted: true };

    const isUnlocked = index === 0 || Boolean(progress) || Boolean(previousProgress?.isCompleted);

    return {
      ...game.toObject(),
      isLocked: !isUnlocked,
      isCompleted: Boolean(progress?.isCompleted)
    };
  });

  const completedLevels = currentProgress
    .filter((entry) => entry.isCompleted)
    .map((entry) => entry.level);

  const currentLevel = completedLevels.length ? Math.max(...completedLevels) + 1 : 1;

  return {
    currentLevel,
    games: currentProgress
  };
};

export const assertGameIsUnlocked = async ({ userId, gameId }) => {
  if (!mongoose.Types.ObjectId.isValid(gameId)) {
    throw new AppError('Invalid gameId', 400);
  }

  const games = await Game.find({}).sort(GAME_SEQUENCE_SORT).select('_id');
  await ensureInitialUnlockedGame(userId, games);

  const gameIndex = games.findIndex((game) => game._id.toString() === gameId);
  if (gameIndex === -1) {
    throw new AppError('Game not found', 404);
  }

  if (gameIndex === 0) {
    return;
  }

  const previousGame = games[gameIndex - 1];
  const previousProgress = await UserProgress.findOne({ userId, gameId: previousGame._id }).lean();

  if (!previousProgress?.isCompleted) {
    throw new AppError('This game is locked. Complete previous game first.', 403);
  }
};

export const listQuestionsByGameId = async (gameId) => {
  if (!mongoose.Types.ObjectId.isValid(gameId)) {
    throw new AppError('Invalid gameId', 400);
  }

  const gameExists = await Game.exists({ _id: gameId });
  if (!gameExists) {
    throw new AppError('Game not found', 404);
  }

  const questions = await Question.find({ gameId }).sort({ createdAt: 1 });
  return questions;
};
