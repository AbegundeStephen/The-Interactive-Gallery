/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import type { AxiosInstance, AxiosError } from "axios"
import type { Image, Comment, User } from "../types";
import { API_CONFIG, isDevelopment } from '../config';
import { toast } from 'sonner';

class ApiService {
    private api: AxiosInstance;
    private token: string | null = null;


    constructor() {
        this.token = localStorage.getItem('auth_token');

        // Create axios instance with base configuration
        this.api = axios.create({
            baseURL: API_CONFIG.baseURL,
            timeout: API_CONFIG.timeout,
            headers: API_CONFIG.defaultHeaders,
        });

        // A request interceptor to include auth token
        this.api.interceptors.request.use((config) => {
            if (this.token) {
                config.headers.Authorization = `Bearer ${this.token}`;
            }
            return config;
        });

        // Add response interceptor for error handling
        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    this.logout();
                }
                return Promise.reject(error);
            }
        );
    }

    // Error handling method
    private handleApiError(error: unknown, defaultMessage: string = 'An error occurred'): string {
        let errorMessage = defaultMessage;

        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;

            // Extract error message from response data
            if (axiosError.response?.data) {
                const responseData = axiosError.response.data as any;

                // Try different possible error message fields
                if (responseData.error) {
                    errorMessage = responseData.error;
                } else if (responseData.message) {
                    errorMessage = responseData.message;
                } else if (responseData.details) {
                    errorMessage = responseData.details;
                } else if (typeof responseData === 'string') {
                    errorMessage = responseData;
                }
            } else if (axiosError.message) {
                // Fallback to axios error message
                errorMessage = axiosError.message;
            }
        } else if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        }

        // Display toast notification
        toast.info(errorMessage);

        return errorMessage;
    }

    // Mock data generators (for development)
    private generateMockImages(count: number, page: number = 1): Image[] {
        return Array.from({ length: count }, (_, i) => {
            const imageId = `img_${page}_${i + 1}`;
            const imageNumber = (page - 1) * count + i + 1;
            return {
                id: imageId,
                title: `Beautiful Landscape ${imageNumber}`,
                description: `A stunning view of nature captured in perfect light. This image showcases the beauty of our natural world with vibrant colors and composition.`,
                author: `Photographer ${imageNumber}`,
                author_username: `photographer${imageNumber}`,
                url_regular: `https://picsum.photos/600/400?random=${imageNumber}`,
                url_thumb: `https://picsum.photos/300/200?random=${imageNumber}`,
                url_full: `https://picsum.photos/1200/800?random=${imageNumber}`,
                tags: ['nature', 'landscape', 'photography', 'outdoor', 'scenic'],
                likes_count: Math.floor(Math.random() * 1000) + 50,
                created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
                updated_at: new Date().toISOString()
            };
        });
    }

    private generateMockComments(imageId: string, count: number = 3): Comment[] {
        return Array.from({ length: count }, (_, i) => ({
            id: `comment_${imageId}_${i + 1}`,
            image_id: imageId,
            content: [
                "Amazing shot! The lighting is perfect.",
                "This captures the essence of nature beautifully.",
                "Incredible composition and colors!",
                "Love the depth and perspective in this image.",
                "This makes me want to visit this place!"
            ][i % 5],
            author_name: `User ${i + 1}`,
            author_email: `user${i + 1}@example.com`,
            created_at: new Date(Date.now() - Math.random() * 86400000).toISOString(),
            updated_at: new Date().toISOString()
        }));
    }

    async getImages(page: number = 1, limit: number = 12, query?: string): Promise<{ images: Image[]; total: number; page: number; totalPages: number }> {

        if (isDevelopment) {
            // Use mock data in development
            await new Promise(resolve => setTimeout(resolve, 500));
            const images = this.generateMockImages(limit, page);
            const total = 120; // Mock total

            return {
                images,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };
        }

        // Production API call
        try {
            const params: any = { page, limit };
            if (query) {
                params.q = query;
            }

            const response = await this.api.get('/api/images',);
            return response.data;
        } catch (error) {
            this.handleApiError(error, 'Failed to fetch images');
            throw error;
        }
    }

    async getImage(id: string): Promise<Image> {
        if (isDevelopment) {
            await new Promise(resolve => setTimeout(resolve, 300));
            return this.generateMockImages(1, 1)[0];
        }

        try {
            const response = await this.api.get(`/api/images/${id}`);
            return response.data;
        } catch (error) {
            this.handleApiError(error, 'Failed to fetch image');
            throw error;
        }
    }

    async getComments(imageId: string): Promise<Comment[]> {
        if (isDevelopment) {
            await new Promise(resolve => setTimeout(resolve, 200));
            return this.generateMockComments(imageId);
        }

        try {
            const response = await this.api.get(`/api/comments/${imageId}`);
            return Array.isArray(response.data.data) ? response.data.data : [];
        } catch (error) {
            this.handleApiError(error, 'Failed to fetch comments');
            throw error;
        }
    }

    async addComment(imageId: string, content: string, authorName: string, authorEmail: string): Promise<Comment> {
        if (isDevelopment) {
            await new Promise(resolve => setTimeout(resolve, 300));
            return {
                id: `comment_${imageId}_${Date.now()}`,
                image_id: imageId,
                content,
                author_name: authorName,
                author_email: authorEmail,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
        }

        try {
            const response = await this.api.post(`/api/comments/${imageId}`, {
                content,
                author_name: authorName,
                author_email: authorEmail
            });
            return response.data;
        } catch (error) {
            this.handleApiError(error, 'Failed to add comment');
            throw error;
        }
    }

    async likeImage(imageId: string): Promise<{ likes_count: number }> {
        if (isDevelopment) {
            await new Promise(resolve => setTimeout(resolve, 200));
            return { likes_count: Math.floor(Math.random() * 1000) + 1 };
        }

        try {
            const response = await this.api.post(`/api/likes/${imageId}/like`);
            return response.data;
        } catch (error) {
            this.handleApiError(error, 'Failed to like image');
            throw error;
        }
    }

    async getLikesCount(imageId: string): Promise<{ likes_count: number }> {
        if (isDevelopment) {
            await new Promise(resolve => setTimeout(resolve, 200));
            return { likes_count: Math.floor(Math.random() * 1000) + 50 };
        }

        try {
            const response = await this.api.get(`/api/likes/${imageId}/likes`);
            return response.data;
        } catch (error) {
            this.handleApiError(error, 'Failed to fetch likes count');
            throw error;
        }
    }
    async toggleLike(imageId: string): Promise<{ liked: boolean; totalLikes: number }> {
        if (isDevelopment) {
            await new Promise(resolve => setTimeout(resolve, 200));
            const liked = Math.random() > 0.5;
            return {
                liked,
                totalLikes: Math.floor(Math.random() * 1000) + (liked ? 1 : 0)
            };
        }

        try {
            const response = await this.api.post(`/api/likes/${imageId}/toggle`);
            return response.data;
        } catch (error) {
            this.handleApiError(error, 'Failed to toggle like');
            throw error;
        }
    }
    async getLikeStatus(imageId: string): Promise<{ liked: boolean; totalLikes: number }> {
        if (isDevelopment) {
            await new Promise(resolve => setTimeout(resolve, 200));
            return {
                liked: Math.random() > 0.5,
                totalLikes: Math.floor(Math.random() * 1000)
            };
        }

        try {
            const response = await this.api.get(`/api/likes/${imageId}/status`);
            return response.data;
        } catch (error) {
            this.handleApiError(error, 'Failed to fetch like status');
            throw error;
        }
    }

    async login(email: string, password: string): Promise<{ user: User; token: string }> {
        if (isDevelopment) {
            await new Promise(resolve => setTimeout(resolve, 800));

            const user = {
                id: 'user_123',
                username: 'johndoe',
                email: email,
                created_at: new Date().toISOString()
            };

            const token = 'mock_jwt_token_' + Date.now();
            this.token = token;
            localStorage.setItem('auth_token', token);

            return { user, token };
        }

        try {
            const response = await this.api.post('/api/auth/login', {
                email,
                password
            });

            const { user, token } = response.data;
            this.token = token;
            localStorage.setItem('auth_token', token);

            return { user, token };
        } catch (error) {
            this.handleApiError(error, 'Login failed');
            throw error;
        }
    }

    async register(username: string, email: string, password: string): Promise<{ user: User; token: string }> {
        if (isDevelopment) {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const user = {
                id: 'user_' + Date.now(),
                username,
                email,
                created_at: new Date().toISOString()
            };

            const token = 'mock_jwt_token_' + Date.now();
            this.token = token;
            localStorage.setItem('auth_token', token);

            return { user, token };
        }

        try {
            const response = await this.api.post('/api/auth/signup', {
                username,
                email,
                password
            });

            const { user, token } = response.data;
            this.token = token;
            localStorage.setItem('auth_token', token);

            return { user, token };
        } catch (error) {
            this.handleApiError(error, 'Registration failed');
            throw error;
        }
    }

    logout() {
        this.token = null;
        localStorage.removeItem('auth_token');
    }
}

export default ApiService;