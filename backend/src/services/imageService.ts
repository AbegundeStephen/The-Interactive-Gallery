import { db } from '../config/database';
import { UnsplashService } from './unsplashService';
import { Image, UnsplashImage } from '../types';

export class ImageService {
    private unsplashService: UnsplashService;

    constructor() {
        this.unsplashService = new UnsplashService();
    }

    async getImages(page: number = 1, limit: number = 12): Promise<Image[]> {
        try {
            // First try to get from cache
            const cachedImages = await db('images')
                .select('*')
                .orderBy('created_at', 'desc')
                .limit(limit)
                .offset((page - 1) * limit);

            if (cachedImages.length > 0) {
                return cachedImages;
            }

            // If no cache, fetch from Unsplash and cache
            const unsplashImages = await this.unsplashService.fetchImages(page, limit);
            const imagesToCache = unsplashImages.map(this.transformUnsplashImage);

            await this.cacheImages(imagesToCache);
            return imagesToCache;
        } catch (error) {
            console.error('Error getting images:', error);
            throw error;
        }
    }

    async getImageById(id: string): Promise<Image> {
        try {
            // Try cache first
            const cachedImage = await db('images').where('id', id).first();
            if (cachedImage) {
                return cachedImage;
            }

            // Fetch from Unsplash
            const unsplashImage = await this.unsplashService.getImageById(id);
            const transformedImage = this.transformUnsplashImage(unsplashImage);

            await this.cacheImages([transformedImage]);
            return transformedImage;
        } catch (error) {
            console.error('Error getting image by ID:', error);
            throw error;
        }
    }

    async searchImages(query: string, page: number = 1, limit: number = 12): Promise<Image[]> {
        try {
            const unsplashImages = await this.unsplashService.searchImages(query, page, limit);
            return unsplashImages.map(this.transformUnsplashImage);
        } catch (error) {
            console.error('Error searching images:', error);
            throw error;
        }
    }

    private transformUnsplashImage(unsplashImage: UnsplashImage): Image {
        return {
            id: unsplashImage.id,
            title: unsplashImage.description || unsplashImage.alt_description || 'Untitled',
            description: unsplashImage.description,
            author: unsplashImage.user.name,
            author_username: unsplashImage.user.username,
            url_regular: unsplashImage.urls.regular,
            url_thumb: unsplashImage.urls.thumb,
            url_full: unsplashImage.urls.full,
            tags: unsplashImage.tags?.map(tag => tag.title) || [],
            likes_count: unsplashImage.likes,
            created_at: new Date(unsplashImage.created_at),
            updated_at: new Date()
        };
    }

    private async cacheImages(images: Image[]): Promise<void> {
        try {
            const existingIds = await db('images').whereIn('id', images.map(img => img.id)).pluck('id');
            const newImages = images.filter(img => !existingIds.includes(img.id));

            if (newImages.length > 0) {
                await db('images').insert(newImages);
            }
        } catch (error) {
            console.error('Error caching images:', error);
        }
    }
}