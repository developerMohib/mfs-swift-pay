import { NextFunction, Request, Response } from 'express';

/**
 * Restricts a route to specific roles. Must run AFTER `authenticate`,
 * since it relies on `req.user` being populated from the JWT.
 *
 * Usage: router.get('/admin-only', authenticate, authorize('admin'), handler)
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const role = (req.user as { role?: string } | undefined)?.role;

    if (!role) {
      res.status(401).json({ success: false, message: 'Unauthorized: No role found on token' });
      return;
    }

    if (!allowedRoles.includes(role)) {
      res.status(403).json({ success: false, message: 'Forbidden: insufficient permissions' });
      return;
    }

    next();
  };
};