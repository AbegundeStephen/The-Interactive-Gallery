export interface User {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    created_at: string;
    updated_at: string;
}

export interface Image {
    id: string;
    title: string;
    author: string;
    description: string | null;
    tags: string[];
    url_regular: string;
    url_small: string;
    url_thumb: string;
    width: number;
    height: number;
    likes_count: number;
    created_at: string;
    updated_at: string;
    liked_by_user?: boolean;
    comments_count?: number;
}

export interface Comment {
    id: number;
    image_id: string;
    user_id: number;
    content: string;
    created_at: string;
    updated_at: string;
    username?: string;
}

export interface Like {
    id: number;
    image_id: string;
    user_id: number;
    created_at: string;
    updated_at: string;
}

export interface UnsplashImage {
    id: string;
    alt_description: string | null;
    description: string | null;
    user: {
        name: string;
    };
    tags?: Array<{
        title: string;
    }>;
    urls: {
        regular: string;
        small: string;
        thumb: string;
    };
    width: number;
    height: number;
    likes: number;
}

export interface UnsplashSearchResponse {
    results: UnsplashImage[];
    total: number;
    total_pages: number;
}

export interface AuthRequest extends Request {
    user?: User;
}

export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginationResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}
  