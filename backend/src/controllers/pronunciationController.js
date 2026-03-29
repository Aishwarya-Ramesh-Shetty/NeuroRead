import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import { getPronunciationByLetter } from '../services/pronunciationService.js';

export const getPronunciation = asyncHandler(async (req, res) => {
  const pronunciation = await getPronunciationByLetter(req.params.letter);

  res.status(200).json(
    successResponse({
      message: 'Pronunciation fetched successfully',
      data: {
        letter: pronunciation.letter,
        audioUrl: pronunciation.audioUrl
      }
    })
  );
});
