import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import {
  assertGameIsUnlocked,
  listGames,
  listPersonalizedGames,
  listQuestionsByGameId
} from '../services/gameService.js';

export const getGames = asyncHandler(async (req, res) => {
  const games = await listGames();

  res.status(200).json(
    successResponse({
      message: 'Games fetched successfully',
      data: { games }
    })
  );
});

export const getPersonalizedGames = asyncHandler(async (req, res) => {
  const personalized = await listPersonalizedGames({ userId: req.user._id });

  res.status(200).json(
    successResponse({
      message: 'Personalized games fetched successfully',
      data: personalized
    })
  );
});

export const getGameQuestions = asyncHandler(async (req, res) => {
  const { gameId } = req.params;
  const questions = await listQuestionsByGameId(gameId);

  res.status(200).json(
    successResponse({
      message: 'Questions fetched successfully',
      data: { questions }
    })
  );
});

export const getPersonalizedGameQuestions = asyncHandler(async (req, res) => {
  const { gameId } = req.params;

  await assertGameIsUnlocked({ userId: req.user._id, gameId });
  const questions = await listQuestionsByGameId(gameId);

  res.status(200).json(
    successResponse({
      message: 'Personalized questions fetched successfully',
      data: { questions }
    })
  );
});
