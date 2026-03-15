import User from '../models/User.js';
import AppError from '../utils/appError.js';
import { verifyToken } from '../utils/jwt.js';

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return next(new AppError('Authorization token missing', 401));
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId).select('_id name email createdAt');

    if (!user) {
      return next(new AppError('User no longer exists', 401));
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(new AppError('Invalid or expired token', 401));
  }
};
