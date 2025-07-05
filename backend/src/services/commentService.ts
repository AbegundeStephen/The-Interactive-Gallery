import {db} from '../config/database';
import { Comment } from '../types';
import logger from '../config/logger';

class CommentService {
    async createComment(imageId: string, userId: number, content: string): Promise<Comment> {
        try {
            const [comment] = await db('comments')
                .insert({
                    image_id: imageId,
                    user_id: userId,
                    content
                })
                .returning('*');

            return comment;
        } catch (error) {
            logger.error('Error creating comment:', error);
            throw new Error('Failed to create comment');
        }
    }

    async getCommentsByImageId(imageId: string, page: number = 1, limit: number = 20): Promise<{ comments: any[], total: number }> {
        try {
            const offset = (page - 1) * limit;

            const [comments, countResult] = await Promise.all([
                db('comments')
                    .select([
                        'comments.*',
                        'users.username',
                        'users.email'
                    ])
                    .join('users', 'comments.user_id', 'users.id')
                    .where('comments.image_id', imageId)
                    .orderBy('comments.created_at', 'desc')
                    .limit(limit)
                    .offset(offset),
                db('comments')
                    .where('image_id', imageId)
                    .count('* as count')
                    .first()
            ]);

            const total = parseInt(countResult?.count as string) || 0;

            return { comments, total };
        } catch (error) {
            logger.error(`Error fetching comments for image ${imageId}:`, error);
            throw new Error('Failed to fetch comments');
        }
    }

    async getCommentById(id: number): Promise<Comment | null> {
        try {
            const comment = await db('comments')
                .select([
                    'comments.*',
                    'users.username',
                    'users.email'
                ])
                .join('users', 'comments.user_id', 'users.id')
                .where('comments.id', id)
                .first();

            return comment || null;
        } catch (error) {
            logger.error(`Error fetching comment ${id}:`, error);
            throw new Error('Failed to fetch comment');
        }
    }

    async updateComment(id: number, userId: number, content: string): Promise<Comment> {
        try {
            const [comment] = await db('comments')
                .where('id', id)
                .andWhere('user_id', userId)
                .update({ content })
                .returning('*');

            if (!comment) {
                throw new Error('Comment not found or not authorized');
            }

            return comment;
        } catch (error) {
            logger.error(`Error updating comment ${id}:`, error);
            throw error;
        }
    }

    async deleteComment(id: number, userId: number): Promise<void> {
        try {
            const deletedRows = await db('comments')
                .where('id', id)
                .andWhere('user_id', userId)
                .delete();

            if (deletedRows === 0) {
                throw new Error('Comment not found or not authorized');
            }
        } catch (error) {
            logger.error(`Error deleting comment ${id}:`, error);
            throw error;
        }
    }

    async getCommentsByUserId(userId: number, page: number = 1, limit: number = 20): Promise<{ comments: any[], total: number }> {
        try {
            const offset = (page - 1) * limit;

            const [comments, countResult] = await Promise.all([
                db('comments')
                    .select([
                        'comments.*',
                        'images.title as image_title',
                        'images.url_thumb as image_thumb'
                    ])
                    .join('images', 'comments.image_id', 'images.id')
                    .where('comments.user_id', userId)
                    .orderBy('comments.created_at', 'desc')
                    .limit(limit)
                    .offset(offset),
                db('comments')
                    .where('user_id', userId)
                    .count('* as count')
                    .first()
            ]);

            const total = parseInt(countResult?.count as string) || 0;

            return { comments, total };
        } catch (error) {
            logger.error(`Error fetching comments for user ${userId}:`, error);
            throw new Error('Failed to fetch user comments');
        }
    }
}

export default new CommentService();