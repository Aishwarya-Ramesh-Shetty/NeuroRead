import mongoose from 'mongoose';
import Attempt from '../models/Attempt.js';
import Game from '../models/Game.js';
import UserProgress from '../models/UserProgress.js';
import AppError from '../utils/appError.js';

const GAME_SEQUENCE_SORT = { level: 1, order: 1, createdAt: 1 };

const unlockNextGame = async ({ userId, gameId }) => {
  const games = await Game.find({}).sort(GAME_SEQUENCE_SORT).select('_id');
  const gameIndex = games.findIndex((game) => game._id.toString() === gameId.toString());

  if (gameIndex === -1) {
    return;
  }

  const nextGame = games[gameIndex + 1];
  if (!nextGame) {
    return;
  }

  await UserProgress.findOneAndUpdate(
    { userId, gameId: nextGame._id },
    {
      $setOnInsert: {
        userId,
        gameId: nextGame._id,
        isCompleted: false,
        unlockedAt: new Date(),
        score: null
      }
    },
    { upsert: true, new: true }
  );
};

export const createAttempt = async ({ userId, gameId, score, timeTaken, isCompleted, accuracy }) => {
  if (!mongoose.Types.ObjectId.isValid(gameId)) {
    throw new AppError('Invalid gameId', 400);
  }

  const game = await Game.findById(gameId).select('_id');
  if (!game) {
    throw new AppError('Game not found', 404);
  }

  const attempt = await Attempt.create({
    userId,
    gameId,
    score,
    timeTaken,
    isCompleted,
    accuracy
  });

  await UserProgress.findOneAndUpdate(
    { userId, gameId },
    {
      $set: {
        isCompleted: Boolean(isCompleted),
        score
      },
      $setOnInsert: {
        userId,
        gameId,
        unlockedAt: new Date()
      }
    },
    { upsert: true, new: true }
  );

  if (isCompleted) {
    await unlockNextGame({ userId, gameId: game._id });
  }

  return attempt;
};

export const getProgressSummary = async ({ userId }) => {
  const objectUserId = new mongoose.Types.ObjectId(userId);

  const [summary] = await Attempt.aggregate([
    { $match: { userId: objectUserId } },
    {
      $group: {
        _id: '$userId',
        totalAttempts: { $sum: 1 },
        averageScore: { $avg: '$score' },
        bestScore: { $max: '$score' },
        totalTimeTaken: { $sum: '$timeTaken' },
        averageAccuracy: { $avg: '$accuracy' }
      }
    }
  ]);

  const attemptsByGame = await Attempt.aggregate([
    { $match: { userId: objectUserId } },
    {
      $lookup: {
        from: 'games',
        localField: 'gameId',
        foreignField: '_id',
        as: 'game'
      }
    },
    { $unwind: '$game' },
    {
      $group: {
        _id: '$gameId',
        gameName: { $first: '$game.gameName' },
        gameType: { $first: '$game.gameType' },
        attempts: { $sum: 1 },
        averageScore: { $avg: '$score' },
        bestScore: { $max: '$score' }
      }
    },
    { $sort: { attempts: -1 } }
  ]);

  const [progressStats] = await UserProgress.aggregate([
    { $match: { userId: objectUserId } },
    {
      $group: {
        _id: '$userId',
        totalCompletedGames: {
          $sum: {
            $cond: [{ $eq: ['$isCompleted', true] }, 1, 0]
          }
        },
        unlockedGames: { $sum: 1 }
      }
    }
  ]);

  const currentLevelData = await UserProgress.aggregate([
    { $match: { userId: objectUserId, isCompleted: true } },
    {
      $lookup: {
        from: 'games',
        localField: 'gameId',
        foreignField: '_id',
        as: 'game'
      }
    },
    { $unwind: '$game' },
    {
      $group: {
        _id: null,
        maxLevel: { $max: '$game.level' }
      }
    }
  ]);

  return {
    overview: {
      totalAttempts: summary?.totalAttempts || 0,
      averageScore: summary ? Number(summary.averageScore.toFixed(2)) : 0,
      bestScore: summary?.bestScore || 0,
      totalTimeTaken: summary?.totalTimeTaken || 0,
      averageAccuracy: summary?.averageAccuracy ? Number(summary.averageAccuracy.toFixed(2)) : 0
    },
    progression: {
      totalCompletedGames: progressStats?.totalCompletedGames || 0,
      currentLevel: (currentLevelData[0]?.maxLevel || 0) + 1,
      unlockedGames: progressStats?.unlockedGames || 0,
      averageScore: summary ? Number(summary.averageScore.toFixed(2)) : 0
    },
    attemptsByGame
  };
};
