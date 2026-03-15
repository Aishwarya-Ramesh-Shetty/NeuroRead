import mongoose from 'mongoose';
import Game from '../models/Game.js';
import Question from '../models/Question.js';
import AppError from '../utils/appError.js';

export const listGames = async () => {
  const games = await Game.find({}).sort({ createdAt: -1 });
  return games;
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
