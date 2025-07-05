/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Image, Comment, User } from "../types";

class ApiService {
    private baseUrl = '/api';
    private token: string | null = null;

    constructor() {
        this.token = localStorage.getItem('auth_token');
    }

    private getHeaders() {
        return {
            'Content-Type': 'application/json',
            ...(this.token && { Authorization: `Bearer ${this.token}` })
        };
    }

    // Mock data generators
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
        // Simulate API delay
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getImage(id: string): Promise<Image> {
        await new Promise(resolve => setTimeout(resolve, 300));
        return this.generateMockImages(1, 1)[0];
    }

    async getComments(imageId: string): Promise<Comment[]> {
        await new Promise(resolve => setTimeout(resolve, 200));
        return this.generateMockComments(imageId);
    }

    async addComment(imageId: string, content: string, authorName: string, authorEmail: string): Promise<Comment> {
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

    async likeImage(imageId: string): Promise<{ likes_count: number }> {
        await new Promise(resolve => setTimeout(resolve, 200));
        return { likes_count: Math.floor(Math.random() * 1000) + 1 };
    }

    async login(email: string, password: string): Promise<{ user: User; token: string }> {
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

    async register(username: string, email: string, password: string): Promise<{ user: User; token: string }> {
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

    logout() {
        this.token = null;
        localStorage.removeItem('auth_token');
    }
}
  
export default ApiService