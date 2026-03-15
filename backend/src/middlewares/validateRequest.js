import AppError from '../utils/appError.js';

const validateRequest = (schema) => (req, res, next) => {
  const { value, error } = schema(req);

  if (error) {
    return next(new AppError('Validation failed', 400, error));
  }

  req.validated = value;
  return next();
};

export default validateRequest;
