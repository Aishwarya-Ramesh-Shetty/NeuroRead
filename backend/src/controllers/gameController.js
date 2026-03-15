import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import { listGames, listQuestionsByGameId } from '../services/gameService.js';

export const getGames = asyncHandler(async (req, res) => {
  const games = await listGames();

  res.status(200).json(
    successResponse({
      message: 'Games fetched successfully',
      data: { games }
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
