import { Request, Response } from 'express';
import { db } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import logger from '../config/logger';
export class LikeController {
    likeImage = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id: imageId } = req.params;
            const userId = req.user?.id;
            const ipAddress = req.ip;

            // Check if already liked
            const existingLike = await db('likes')
                .where('image_id', imageId)
                .where(function () {
                    this.where('user_id', userId).orWhere('ip_address', ipAddress);
                })
                .first();

            if (existingLike) {
                res.status(400).json({ error: 'Already liked this image' });
                return
            }

            const like = await db('likes').insert({
                image_id: imageId,
                user_id: userId,
                ip_address: ipAddress
            }).returning('*');

            res.status(201).json(like[0]);
        } catch (error) {
            logger.error('Error liking image:', error);
            res.status(500).json({ error: 'Failed to like image' });
        }
    };

    getLikes = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id: imageId } = req.params;

            const likesCount = await db('likes')
                .where('image_id', imageId)
                .count('* as count')
                .first();

            res.json({
                image_id: imageId,
                likes: parseInt(likesCount?.count as string) || 0
            });
        } catch (error) {
            logger.error('Error fetching likes:', error);
            res.status(500).json({ error: 'Failed to fetch likes' });
        }
    };
}