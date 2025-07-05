// src/types/index.ts

export interface Image {
    id: string;
    title: string;
    description: string;
    author: string;
    author_username: string;
    url_regular: string;
    url_thumb: string;
    url_full: string;
    tags: string[];
    likes_count: number;
    created_at: string;
    updated_at: string;
}

export interface Comment {
    id: string;
    image_id: string;
    user_id?: string;
    content: string;
    author_name: string;
    author_email: string;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    created_at: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ImageListResponse {
    images: Image[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface CommentFormData {
    content: string;
    author_name: string;
    author_email: string;
}

export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData {
    username: string;
    email: string;
    password: string;
}

export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
    error: string | null;
}

export interface ApiError {
    message: string;
    status: number;
    field?: string;
}

export interface LikeResponse {
    likes_count: number;
    user_liked: boolean;
}

export interface SearchFilters {
    query?: string;
    tags?: string[];
    author?: string;
    sortBy?: 'created_at' | 'likes_count' | 'title';
    sortOrder?: 'asc' | 'desc';
}

export interface LoadingState {
    isLoading: boolean;
    error: string | null;
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export interface FormValidationErrors {
    [key: string]: string;
}

// Environment variables
export interface AppConfig {
    apiUrl: string;
    unsplashAccessKey: string;
    environment: 'development' | 'production' | 'test';
}

// Component Props Types
export interface ImageCardProps {
    image: Image;
    onClick: (image: Image) => void;
    loading?: boolean;
}

export interface ImageModalProps {
    image: Image;
    onClose: () => void;
}

export interface CommentFormProps {
    onSubmit: (data: CommentFormData) => Promise<void>;
    loading?: boolean;
    error?: string | null;
}

export interface HeaderProps {
    onSearch: (query: string) => void;
    onAuthClick: () => void;
    user?: User | null;
}

export interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode?: 'login' | 'register';
}

export interface GalleryProps {
    images: Image[];
    loading: boolean;
    error: string | null;
    onImageClick: (image: Image) => void;
    onLoadMore?: () => void;
    hasMore?: boolean;
}

// Hook return types
export interface UseAuthReturn {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
    error: string | null;
}

export interface UseImagesReturn {
    images: Image[];
    loading: boolean;
    error: string | null;
    page: number;
    hasMore: boolean;
    loadMore: () => void;
    search: (query: string) => void;
    refresh: () => void;
}

export interface UseCommentsReturn {
    comments: Comment[];
    loading: boolean;
    error: string | null;
    addComment: (data: CommentFormData) => Promise<void>;
    refresh: () => void;
}

// API Service types
export interface ApiServiceConfig {
    baseURL: string;
    timeout: number;
    defaultHeaders: Record<string, string>;
}

export interface RequestConfig {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    url: string;
    data?: unknown;
    headers?: Record<string, string>;
    params?: Record<string, unknown>;
}

// Storage types
export interface StorageKeys {
    AUTH_TOKEN: 'auth_token';
    USER_DATA: 'user_data';
    THEME: 'theme';
    LANGUAGE: 'language';
}

// Theme types
export interface ThemeConfig {
    mode: 'light' | 'dark';
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        surface: string;
        text: string;
    };
}

// Constants
export const API_ENDPOINTS = {
    IMAGES: '/api/images',
    COMMENTS: '/api/comments',
    LIKES: '/api/likes',
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/signup',
        LOGOUT: '/api/auth/logout',
        REFRESH: '/api/auth/refresh',
    },
} as const;

export const STORAGE_KEYS: StorageKeys = {
    AUTH_TOKEN: 'auth_token',
    USER_DATA: 'user_data',
    THEME: 'theme',
    LANGUAGE: 'language',
} as const;

export const VALIDATION_RULES = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD_MIN_LENGTH: 6,
    COMMENT_MIN_LENGTH: 5,
    COMMENT_MAX_LENGTH: 1000,
    USERNAME_MIN_LENGTH: 3,
    USERNAME_MAX_LENGTH: 50,
} as const;

export const PAGINATION = {
    DEFAULT_LIMIT: 12,
    MAX_LIMIT: 50,
} as const;