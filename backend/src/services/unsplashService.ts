import { unsplashClient } from '../config/unsplash';
import { UnsplashImage } from '../types';
import logger from '../config/logger';

export class UnsplashService {
    async fetchImages(page: number = 1, perPage: number = 12): Promise<UnsplashImage[]> {
        try {
            const response = await unsplashClient.get('/photos', {
                params: {
                    page,
                    per_page: perPage,
                    order_by: 'popular'
                }
            });
            return response.data;
        } catch (error) {
            logger.error('Error fetching images from Unsplash:', error);
            throw new Error('Failed to fetch images from Unsplash');
        }
    }

    async getImageById(id: string): Promise<UnsplashImage> {
        try {
            const response = await unsplashClient.get(`/photos/${id}`);
            return response.data;
        } catch (error) {
            logger.error('Error fetching image from Unsplash:', error);
            throw new Error('Failed to fetch image from Unsplash');
        }
    }

    async searchImages(query: string, page: number = 1, perPage: number = 12): Promise<UnsplashImage[]> {
        try {
            const response = await unsplashClient.get('/search/photos', {
                params: {
                    query,
                    page,
                    per_page: perPage
                }
            });
            return response.data.results;
        } catch (error) {
            logger.error('Error searching images on Unsplash:', error);
            throw new Error('Failed to search images on Unsplash');
        }
    }

    formatImageData(unsplashImage: UnsplashImage): any {
        return {
            id: unsplashImage.id,
            description: unsplashImage.description || unsplashImage.alt_description,
            urls: {
                raw: unsplashImage.urls.raw,
                full: unsplashImage.urls.full,
                regular: unsplashImage.urls.regular,
                small: unsplashImage.urls.small,
                thumb: unsplashImage.urls.thumb
            },
            user: {
                id: unsplashImage.user.id,
                name: unsplashImage.user.name,
                username: unsplashImage.user.username,
                profile_image: unsplashImage.user.profile_image
            },
            width: unsplashImage.width,
            height: unsplashImage.height,
            color: unsplashImage.color,
            likes: unsplashImage.likes,
            created_at: unsplashImage.created_at,
            updated_at: unsplashImage.updated_at
        };
    }
}