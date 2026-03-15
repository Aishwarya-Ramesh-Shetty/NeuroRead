import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import { createAttempt, getProgressSummary } from '../services/progressService.js';

export const recordAttempt = asyncHandler(async (req, res) => {
  const attempt = await createAttempt({
    userId: req.user._id,
    ...req.validated
  });

  res.status(201).json(
    successResponse({
      message: 'Attempt recorded successfully',
      data: { attempt }
    })
  );
});

export const getSummary = asyncHandler(async (req, res) => {
  const summary = await getProgressSummary({ userId: req.user._id });

  res.status(200).json(
    successResponse({
      message: 'Progress summary fetched successfully',
      data: summary
    })
  );
});
