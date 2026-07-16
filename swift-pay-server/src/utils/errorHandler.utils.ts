import { NextFunction, Request, Response } from 'express';

/**
 * Catches any request that didn't match a route.
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

/**
 * Centralized error handler. Any `next(error)` call in a controller
 * (or a thrown error in an async route not caught locally) ends up here.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): void => {
  console.error('Unhandled error:', error);

  const status = error?.statusCode || 500;
  res.status(status).json({
    success: false,
    message: error?.message || 'Something went wrong on the server',
    ...(process.env.NODE_ENV === 'development' && { stack: error?.stack }),
  });
};