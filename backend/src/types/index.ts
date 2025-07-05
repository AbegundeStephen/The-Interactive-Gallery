export interface UnsplashImage {
    id: string;
    urls: {
        raw: string;
        full: string;
        regular: string;
        small: string;
        thumb: string;
    };
    user: {
        id: string;
        name: string;
        username: string;
    };
    description: string | null;
    alt_description: string | null;
    tags?: Array<{ title: string }>;
    likes: number;
    created_at: string;
}

export interface Image {
    id: string;
    title: string;
    description: string | null;
    author: string;
    author_username: string;
    url_regular: string;
    url_thumb: string;
    url_full: string;
    tags: string[];
    likes_count: number;
    created_at: Date;
    updated_at: Date;
}

export interface Comment {
    id: number;
    image_id: string;
    user_id?: number;
    content: string;
    author_name: string;
    author_email: string;
    created_at: Date;
}

export interface User {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    created_at: Date;
}

export interface Like {
    id: number;
    image_id: string;
    user_id?: number;
    ip_address: string;
    created_at: Date;
  }