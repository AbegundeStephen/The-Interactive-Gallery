import { Request, Response } from 'express';
import { db } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import logger from '../config/logger';
export class CommentController {
    createComment = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id: imageId } = req.params;
            const { content, author_name, author_email } = req.body;

            const comment = await db('comments').insert({
                image_id: imageId,
                user_id: req.user?.id || null,
                content,
                author_name,
                author_email
            }).returning('*');

            res.status(201).json(comment[0]);
        } catch (error) {
            logger.error('Error creating comment:', error);
            res.status(500).json({ error: 'Failed to create comment' });
        }
    };

    getComments = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id: imageId } = req.params;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const comments = await db('comments')
                .where('image_id', imageId)
                .orderBy('created_at', 'desc')
                .limit(limit)
                .offset((page - 1) * limit);

            const totalComments = await db('comments')
                .where('image_id', imageId)
                .count('* as count')
                .first();

            res.json({
                data: comments,
                pagination: {
                    page,
                    limit,
                    total: parseInt(totalComments?.count as string) || 0,
                    hasMore: comments.length === limit
                }
            });
        } catch (error) {
            logger.error('Error fetching comments:', error);
            res.status(500).json({ error: 'Failed to fetch comments' });
        }
    };
}