import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';

const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admins only.',
    });
    return;
  }
  next();
};

const salesOrAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }
  next();
};

export { adminOnly, salesOrAdmin };