import axios, { AxiosResponse } from 'axios';
import { UnsplashImage, UnsplashSearchResponse, Image } from '../types';

class UnsplashService {
    private baseURL = 'https://api.unsplash.com';
    private accessKey = process.env.UNSPLASH_ACCESS_KEY!;

    async getImages(page: number = 1, perPage: number = 20, query?: string): Promise<UnsplashImage[]> {
        try {
            const endpoint = query ? '/search/photos' : '/photos';
            const params = {
                client_id: this.accessKey,
                page,
                per_page: perPage,
                order_by: 'latest'
            };

            if (query) {
                (params as any).query = query;
            }

            const response: AxiosResponse<UnsplashImage[] | UnsplashSearchResponse> =
                await axios.get(`${this.baseURL}${endpoint}`, { params });

            return query
                ? (response.data as UnsplashSearchResponse).results
                : (response.data as UnsplashImage[]);
        } catch (error) {
            console.error('Unsplash API error:', error);
            throw new Error('Failed to fetch images from Unsplash');
        }
    }

    async getImageById(id: string): Promise<UnsplashImage> {
        try {
            const response: AxiosResponse<UnsplashImage> = await axios.get(`${this.baseURL}/photos/${id}`, {
                params: { client_id: this.accessKey }
            });
            return response.data;
        } catch (error) {
            console.error('Unsplash API error:', error);
            throw new Error('Failed to fetch image details from Unsplash');
        }
    }

    formatImageData(unsplashImage: UnsplashImage): Omit<Image, 'created_at' | 'updated_at'> {
        return {
            id: unsplashImage.id,
            title: unsplashImage.alt_description || unsplashImage.description || 'Untitled',
            author: unsplashImage.user.name,
            description: unsplashImage.description,
            tags: unsplashImage.tags?.map(tag => tag.title) || [],
            url_regular: unsplashImage.urls.regular,
            url_small: unsplashImage.urls.small,
            url_thumb: unsplashImage.urls.thumb,
            width: unsplashImage.width,
            height: unsplashImage.height,
            likes_count: unsplashImage.likes || 0
        };
    }
}

export default new UnsplashService();