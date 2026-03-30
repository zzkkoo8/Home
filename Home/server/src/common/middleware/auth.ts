import { Request, Response, NextFunction } from 'express';
import { AppError, ErrorCodes } from '../utils/errors';

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const userId = req.headers['x-user-id'];
  
  if (!userId) {
    throw new AppError(
      ErrorCodes.USER_NOT_LOGGED_IN.code,
      ErrorCodes.USER_NOT_LOGGED_IN.message,
      401
    );
  }
  
  (req as any).userId = parseInt(userId as string);
  next();
};
