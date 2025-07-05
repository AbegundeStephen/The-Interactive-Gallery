import type { AppConfig } from "../types";

const config: AppConfig = {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001',
    unsplashAccessKey: process.env.REACT_APP_UNSPLASH_ACCESS_KEY || '',
    environment: (process.env.REACT_APP_ENVIRONMENT as 'development' | 'production' | 'test') || 'development',
};

export default config;


// Validation
if (!config.apiUrl) {
    throw new Error('REACT_APP_API_URL environment variable is required');
}

if (!config.unsplashAccessKey && config.environment === 'production') {
    console.warn('REACT_APP_UNSPLASH_ACCESS_KEY is not set. Using mock data.');
}

export const isDevelopment = config.environment === 'development';
export const isProduction = config.environment === 'production';
export const isTest = config.environment === 'test';

// API Configuration
export const API_CONFIG = {
    baseURL: config.apiUrl,
    timeout: 10000,
    defaultHeaders: {
        'Content-Type': 'application/json',
    },
};

// Feature flags
export const FEATURES = {
    ENABLE_COMMENTS: true,
    ENABLE_LIKES: true,
    ENABLE_AUTH: true,
    ENABLE_SEARCH: true,
    ENABLE_INFINITE_SCROLL: true,
    ENABLE_OFFLINE_MODE: isDevelopment,
    ENABLE_ANALYTICS: isProduction,
};

// UI Configuration
export const UI_CONFIG = {
    IMAGES_PER_PAGE: 12,
    COMMENTS_PER_PAGE: 10,
    DEBOUNCE_DELAY: 300,
    ANIMATION_DURATION: 300,
    TOAST_DURATION: 3000,
    MODAL_TRANSITION_DURATION: 200,
};

// Cache Configuration
export const CACHE_CONFIG = {
    IMAGES_TTL: 5 * 60 * 1000, // 5 minutes
    COMMENTS_TTL: 2 * 60 * 1000, // 2 minutes
    USER_DATA_TTL: 30 * 60 * 1000, // 30 minutes
};

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your internet connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access denied.',
    NOT_FOUND: 'Resource not found.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    SERVER_ERROR: 'Something went wrong on our end. Please try again later.',
    GENERIC_ERROR: 'An unexpected error occurred.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Successfully logged in!',
    REGISTER_SUCCESS: 'Account created successfully!',
    COMMENT_ADDED: 'Comment added successfully!',
    LIKE_ADDED: 'Image liked!',
    PROFILE_UPDATED: 'Profile updated successfully!',
};

// Validation Messages
export const VALIDATION_MESSAGES = {
    REQUIRED: 'This field is required.',
    EMAIL_INVALID: 'Please enter a valid email address.',
    PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long.',
    PASSWORDS_NO_MATCH: 'Passwords do not match.',
    USERNAME_TOO_SHORT: 'Username must be at least 3 characters long.',
    COMMENT_TOO_SHORT: 'Comment must be at least 5 characters long.',
    COMMENT_TOO_LONG: 'Comment cannot exceed 1000 characters.',
};

// Routes
export const ROUTES = {
    HOME: '/',
    GALLERY: '/gallery',
    IMAGE: '/image/:id',
    PROFILE: '/profile',
    LOGIN: '/login',
    REGISTER: '/register',
    ABOUT: '/about',
    PRIVACY: '/privacy',
    TERMS: '/terms',
} as const;

// Local Storage Keys
export const LOCAL_STORAGE_KEYS = {
    AUTH_TOKEN: 'interactive_gallery_auth_token',
    USER_DATA: 'interactive_gallery_user_data',
    THEME: 'interactive_gallery_theme',
    LANGUAGE: 'interactive_gallery_language',
    CACHED_IMAGES: 'interactive_gallery_cached_images',
    SEARCH_HISTORY: 'interactive_gallery_search_history',
} as const;

// Theme Configuration
export const THEME_CONFIG = {
    light: {
        mode: 'light' as const,
        colors: {
            primary: '#3b82f6',
            secondary: '#6b7280',
            accent: '#10b981',
            background: '#ffffff',
            surface: '#f9fafb',
            text: '#111827',
        },
    },
    dark: {
        mode: 'dark' as const,
        colors: {
            primary: '#60a5fa',
            secondary: '#9ca3af',
            accent: '#34d399',
            background: '#111827',
            surface: '#1f2937',
            text: '#f9fafb',
        },
    },
  };