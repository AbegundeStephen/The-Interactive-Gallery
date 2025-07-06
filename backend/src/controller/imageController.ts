import { Request, Response } from 'express';
import { ImageService } from '../services/imageService';
import logger from '../config/logger';

export class ImageController {
    private imageService: ImageService;

    constructor() {
        this.imageService = new ImageService();
    }

    getImages = async (req: Request, res: Response): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 12;
            const query = req.query.q as string;

            let images;
            if (query) {
                images = await this.imageService.searchImages(query, page, limit);
            } else {
                images = await this.imageService.getImages(page, limit);
            }

            res.json({
                images: images,
                pagination: {
                    page,
                    limit,
                    hasMore: images.length === limit
                }
            });
        } catch (error) {
            logger.error('Error in getImages:', error);
            res.status(500).json({ error: 'Failed to fetch images' });
        }
    };

    getImageById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const image = await this.imageService.getImageById(id);
            res.json(image);
        } catch (error) {
            logger.error('Error in getImageById:', error);
            res.status(404).json({ error: 'Image not found' });
        }
    };
}
