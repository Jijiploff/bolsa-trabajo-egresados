import { Request, Response, NextFunction } from 'express';
import { notificationService } from '../services/notificationService';
import { AuthRequest } from '../middleware/authMiddleware';

export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await notificationService.findByUser(req.user.id, page, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });
    const id = parseInt(req.params.id as string);
    const notif = await notificationService.markAsRead(id, req.user.id);
    res.json(notif);
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });
    const result = await notificationService.markAllAsRead(req.user.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const countUnread = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });
    const count = await notificationService.countUnread(req.user.id);
    res.json({ unread: count });
  } catch (error) {
    next(error);
  }
};