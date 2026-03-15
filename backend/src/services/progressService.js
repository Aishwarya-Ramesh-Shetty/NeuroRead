import mongoose from 'mongoose';
import Attempt from '../models/Attempt.js';
import Game from '../models/Game.js';
import AppError from '../utils/appError.js';

export const createAttempt = async ({ userId, gameId, score, timeTaken }) => {
  if (!mongoose.Types.ObjectId.isValid(gameId)) {
    throw new AppError('Invalid gameId', 400);
  }

  const gameExists = await Game.exists({ _id: gameId });
  if (!gameExists) {
    throw new AppError('Game not found', 404);
  }

  const attempt = await Attempt.create({ userId, gameId, score, timeTaken });
  return attempt;
};

export const getProgressSummary = async ({ userId }) => {
  const [summary] = await Attempt.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$userId',
        totalAttempts: { $sum: 1 },
        averageScore: { $avg: '$score' },
        bestScore: { $max: '$score' },
        totalTimeTaken: { $sum: '$timeTaken' }
      }
    }
  ]);

  const attemptsByGame = await Attempt.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
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

  return {
    overview: {
      totalAttempts: summary?.totalAttempts || 0,
      averageScore: summary ? Number(summary.averageScore.toFixed(2)) : 0,
      bestScore: summary?.bestScore || 0,
      totalTimeTaken: summary?.totalTimeTaken || 0
    },
    attemptsByGame
  };
};
