import { unsplashClient } from '../config/unsplash';
import { UnsplashImage } from '../types';

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
            console.error('Error fetching images from Unsplash:', error);
            throw new Error('Failed to fetch images from Unsplash');
        }
    }

    async getImageById(id: string): Promise<UnsplashImage> {
        try {
            const response = await unsplashClient.get(`/photos/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching image from Unsplash:', error);
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
            console.error('Error searching images on Unsplash:', error);
            throw new Error('Failed to search images on Unsplash');
        }
    }
}