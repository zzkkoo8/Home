import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
    });
  }

  console.error('Unexpected error:', err);
  return res.status(500).json({
    code: 500,
    message: '服务器内部错误',
  });
};
