import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import { loginStudent, registerStudent } from '../services/authService.js';

export const register = asyncHandler(async (req, res) => {
  const result = await registerStudent(req.validated);

  res.status(201).json(
    successResponse({
      message: 'Student registered successfully',
      data: result
    })
  );
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginStudent(req.validated);

  res.status(200).json(
    successResponse({
      message: 'Login successful',
      data: result
    })
  );
});

export const me = asyncHandler(async (req, res) => {
  res.status(200).json(
    successResponse({
      message: 'Current student profile fetched',
      data: {
        user: req.user
      }
    })
  );
});
