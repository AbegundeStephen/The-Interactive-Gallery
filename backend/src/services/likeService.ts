import { db } from '../config/database';
import { Like } from '../types';
import logger from '../config/logger';

class LikeService {
    async toggleLike(imageId: string, userId: number): Promise<{ liked: boolean, totalLikes: number }> {
        try {
            const existingLike = await db('likes')
                .where('image_id', imageId)
                .andWhere('user_id', userId)
                .first();

            if (existingLike) {
                // Unlike
                await db('likes')
                    .where('image_id', imageId)
                    .andWhere('user_id', userId)
                    .delete();
            } else {
                // Like
                await db('likes').insert({
                    image_id: imageId,
                    user_id: userId
                });
            }

            const totalLikes = await this.getLikesCount(imageId);

            return {
                liked: !existingLike,
                totalLikes
            };
        } catch (error) {
            logger.error('Error toggling like:', error);
            throw new Error('Failed to toggle like');
        }
    }

    async getLikesCount(imageId: string): Promise<number> {
        try {
            const result = await db('likes')
                .where('image_id', imageId)
                .count('* as count')
                .first();

            return parseInt(result?.count as string) || 0;
        } catch (error) {
            logger.error(`Error getting likes count for image ${imageId}:`, error);
            throw new Error('Failed to get likes count');
        }
    }

    async getUserLike(imageId: string, userId: number): Promise<Like | null> {
        try {
            const like = await db('likes')
                .where('image_id', imageId)
                .andWhere('user_id', userId)
                .first();

            return like || null;
        } catch (error) {
            logger.error(`Error getting user like for image ${imageId}:`, error);
            throw new Error('Failed to get user like');
        }
    }

    async getLikedImagesByUser(userId: number, page: number = 1, limit: number = 20): Promise<{ images: any[], total: number }> {
        try {
            const offset = (page - 1) * limit;

            const [images, countResult] = await Promise.all([
                db('likes')
                    .select([
                        'images.*',
                        'likes.created_at as liked_at'
                    ])
                    .join('images', 'likes.image_id', 'images.id')
                    .where('likes.user_id', userId)
                    .orderBy('likes.created_at', 'desc')
                    .limit(limit)
                    .offset(offset),
                db('likes')
                    .where('user_id', userId)
                    .count('* as count')
                    .first()
            ]);

            const total = parseInt(countResult?.count as string) || 0;

            return { images, total };
        } catch (error) {
            logger.error(`Error fetching liked images for user ${userId}:`, error);
            throw new Error('Failed to fetch liked images');
        }
    }

    async getMostLikedImages(page: number = 1, limit: number = 20): Promise<{ images: any[], total: number }> {
        try {
            const offset = (page - 1) * limit;

            const [images, countResult] = await Promise.all([
                db('images')
                    .select([
                        'images.*',
                        db.raw('COUNT(likes.id) as likes_count')
                    ])
                    .leftJoin('likes', 'images.id', 'likes.image_id')
                    .groupBy('images.id')
                    .orderBy('likes_count', 'desc')
                    .limit(limit)
                    .offset(offset),
                db('images')
                    .count('* as count')
                    .first()
            ]);

            const total = parseInt(countResult?.count as string) || 0;

            return { images, total };
        } catch (error) {
            logger.error('Error fetching most liked images:', error);
            throw new Error('Failed to fetch most liked images');
        }
    }

    async getImageLikeStatus(imageId: string, userId?: number): Promise<{ liked: boolean, totalLikes: number }> {
        try {
            const totalLikes = await this.getLikesCount(imageId);
            let liked = false;

            if (userId) {
                const userLike = await this.getUserLike(imageId, userId);
                liked = !!userLike;
            }

            return { liked, totalLikes };
        } catch (error) {
            logger.error(`Error getting like status for image ${imageId}:`, error);
            throw new Error('Failed to get like status');
        }
    }
}

export default new LikeService();