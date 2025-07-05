// src/routes/likes.ts
import express, { Response } from 'express';
import db from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import unsplashService from '../services/unsplashService';

const router = express.Router();

// POST /api/likes/:imageId - Toggle like
router.post('/:imageId', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { imageId } = req.params;
        const userId = req.user!.id;

        // Check if image exists
        let image = await db('images').where('id', imageId).first();
        if (!image) {
            try {
                const unsplashImage = await unsplashService.getImageById(imageId);
                const formattedImage = unsplashService.formatImageData(unsplashImage);
                await db('images').insert(formattedImage);
            } catch (unsplashError) {
                res.status(404).json({ error: 'Image not found' });
                return;
            }
        }

        // Check if already liked
        const existingLike = await db('likes')
            .where({ image_id: imageId, user_id: userId })
            .first();

        if (existingLike) {
            // Unlike
            await db('likes')
                .where({ image_id: imageId, user_id: userId })
                .del();

            res.json({ liked: false, message: 'Image unliked' });
        } else {
            // Like
            await db('likes').insert({
                image_id: imageId,
                user_id: userId
            });

            res.json({ liked: true, message: 'Image liked' });
        }
    } catch (error) {
        logger.error('Toggle like error:', error);
        res.status(500).json({ error: 'Failed to toggle like' });
    }
});

// GET /api/likes/:imageId - Get likes count
router.get('/:imageId', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { imageId } = req.params;

        const result = await db('likes')
            .where('image_id', imageId)
            .count('id as count')
            .first();

        const count = parseInt(result?.count as string || '0');

        res.json({ likes: count });
    } catch (error) {
        logger.error('Get likes error:', error);
        res.status(500).json({ error: 'Failed to fetch likes' });
    }
});

export default router;