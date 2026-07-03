import type { Request, Response, NextFunction } from 'express';
import { config } from '../config/index.js';

export function validatePrinterToken(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const token =
    req.headers['x-printer-token'] ??
    req.headers.authorization?.replace('Bearer ', '');

  if (!token || token !== config.printerClientToken) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
}
