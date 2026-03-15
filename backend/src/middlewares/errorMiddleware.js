import env from '../config/env.js';
import { errorResponse } from '../utils/apiResponse.js';

export const notFoundHandler = (req, res) => {
  res.status(404).json(errorResponse({ message: 'Route not found' }));
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal server error';

  const response = errorResponse({
    message,
    errors: err.details || null
  });

  if (env.nodeEnv !== 'production' && !err.isOperational) {
    response.debug = err.message;
  }

  res.status(statusCode).json(response);
};
