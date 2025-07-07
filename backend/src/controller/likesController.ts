import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import logger from '../config/logger';
import LikeService from '../services/likeService';

export class LikeController {
    // Toggle like/unlike for an image
    toggleLike = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id: imageId } = req.params;
            const userId = req.user?.id;
            const ipAddress = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress || 'unknown';

            if (!userId) {
                res.status(401).json({ error: 'User authentication required' });
                return;
            }

            const result = await LikeService.toggleLike(String(imageId), String(userId), ipAddress);

            res.status(200).json({
                image_id: imageId,
                liked: result.liked,
                totalLikes: result.totalLikes
            });
        } catch (error) {
            logger.error('Error toggling like:', error);
            res.status(500).json({ error: 'Failed to toggle like' });
        }
    };

    // Get likes count for an image
    getLikes = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id: imageId } = req.params;

            const likesCount = await LikeService.getLikesCount(imageId);

            res.json({
                image_id: imageId,
                likes_count: likesCount
            });
        } catch (error) {
            logger.error('Error fetching likes:', error);
            res.status(500).json({ error: 'Failed to fetch likes' });
        }
    };

    // Get like status for an image (liked by user + total likes)
    getLikeStatus = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id: imageId } = req.params;
            const userId = req.user?.id;

            const status = await LikeService.getImageLikeStatus(imageId, userId ? String(userId) : undefined);
            console.log("like status..", status)

            res.json({
                image_id: imageId,
                liked: status.liked,
                totalLikes: status.totalLikes
            });
        } catch (error) {
            logger.error('Error fetching like status:', error);
            res.status(500).json({ error: 'Failed to fetch like status' });
        }
    };

    // Get images liked by the current user
    getLikedImagesByUser = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;

            if (!userId) {
                res.status(401).json({ error: 'User authentication required' });
                return;
            }

            const result = await LikeService.getLikedImagesByUser(String(userId), page, limit);

            res.json({
                images: result.images,
                total: result.total,
                page,
                limit,
                total_pages: Math.ceil(result.total / limit)
            });
        } catch (error) {
            logger.error('Error fetching liked images:', error);
            res.status(500).json({ error: 'Failed to fetch liked images' });
        }
    };

    // Get most liked images
    getMostLikedImages = async (req: Request, res: Response): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;

            const result = await LikeService.getMostLikedImages(page, limit);

            res.json({
                images: result.images,
                total: result.total,
                page,
                limit,
                total_pages: Math.ceil(result.total / limit)
            });
        } catch (error) {
            logger.error('Error fetching most liked images:', error);
            res.status(500).json({ error: 'Failed to fetch most liked images' });
        }
    };

    // like an image 
    likeImage = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id: imageId } = req.params;
            const userId = req.user?.id;
            const ipAddress = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress || 'unknown';

            if (!userId) {
                res.status(401).json({ error: 'User authentication required' });
                return;
            }

            // Check if already liked
            const existingLike = await LikeService.getUserLike(String(imageId), String(userId));

            if (existingLike) {
                res.status(400).json({ error: 'Already liked this image' });
                return;
            }

            const result = await LikeService.toggleLike(String(imageId), String(userId), ipAddress);

            res.status(201).json({
                image_id: imageId,
                liked: result.liked,
                totalLikes: result.totalLikes
            });
        } catch (error) {
            logger.error('Error liking image:', error);
            res.status(500).json({ error: 'Failed to like image' });
        }
    };
}