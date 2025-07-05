// src/routes/comments.ts
import express, { Response } from 'express';
import Joi from 'joi';
import { db } from '../config/database';
import { authenticateToken, optionalAuth, AuthRequest } from '../middleware/auth';
import { UnsplashService } from '../services/unsplashService';
import { Comment } from '../types';
import logger from '../config/logger';

const router = express.Router();
const unsplashService = new UnsplashService()

// Validation schemas
const createCommentSchema = Joi.object({
    content: Joi.string().min(1).max(1000).required().trim()
});

const getCommentsSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(20)
});

// POST /api/comments/:imageId - Create comment
router.post('/:imageId', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { error, value } = createCommentSchema.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }

        const { imageId } = req.params;
        const { content } = value;

        // Check if image exists (in cache or fetch from Unsplash)
        let image = await db('images').where('id', imageId).first();
        if (!image) {
            // Try to fetch from Unsplash to validate image exists
            try {
                const unsplashImage = await unsplashService.getImageById(imageId);
                const formattedImage = unsplashService.formatImageData(unsplashImage);
                await db('images').insert(formattedImage);
            } catch (unsplashError) {
                res.status(404).json({ error: 'Image not found' });
                return;
            }
        }

        const comment = await db('comments')
            .insert({
                image_id: imageId,
                user_id: req.user!.id,
                content
            })
            .returning('*') as Comment[];

        // Get comment with user info
        const commentWithUser = await db('comments')
            .select('comments.*', 'users.username')
            .join('users', 'comments.user_id', 'users.id')
            .where('comments.id', comment[0].id)
            .first() as Comment;

        res.status(201).json(commentWithUser);
    } catch (error) {
        logger.error('Create comment error:', error);
        res.status(500).json({ error: 'Failed to create comment' });
    }
});

// GET /api/comments/:imageId - Get comments for an image
router.get('/:imageId', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { error, value } = getCommentsSchema.validate(req.query);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }

        const { imageId } = req.params;
        const { page, limit } = value;
        const offset = (page - 1) * limit;

        const comments = await db('comments')
            .select('comments.*', 'users.username')
            .join('users', 'comments.user_id', 'users.id')
            .where('comments.image_id', imageId)
            .orderBy('comments.created_at', 'desc')
            .limit(limit)
            .offset(offset) as Comment[];

        const total = await db('comments')
            .where('image_id', imageId)
            .count('id as count')
            .first();

        const totalCount = parseInt(total?.count as string || '0');

        res.json({
            comments,
            pagination: {
                page,
                limit,
                total: totalCount,
                pages: Math.ceil(totalCount / limit)
            }
        });
    } catch (error) {
        logger.error('Get comments error:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

export default router;