import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import logger from '../config/logger';

// General API rate limiter
const rateLimiter = new RateLimiterMemory({
    keyPrefix: 'api',
    points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    duration: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900'),
});

// Auth rate limiter (stricter)
const authRateLimiter = new RateLimiterMemory({
    keyPrefix: 'auth',
    points: 5,
    duration: 900, // 15 minutes
});

// Comment rate limiter
const commentRateLimiter = new RateLimiterMemory({
    keyPrefix: 'comment',
    points: 10,
    duration: 300, // 5 minutes
});

export const generalRateLimit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await rateLimiter.consume(req.ip || '');
        next();
    } catch (rejRes) {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            success: false,
            message: 'Too many requests. Please try again later.',
            retryAfter: Math.round((rejRes as any).msBeforeNext / 1000)
        });
    }
};

export const authRateLimit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await authRateLimiter.consume(req.ip || '');
        next();
    } catch (rejRes) {
        logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            success: false,
            message: 'Too many authentication attempts. Please try again later.',
            retryAfter: Math.round((rejRes as any).msBeforeNext / 1000)
        });
    }
};

export const commentRateLimit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await commentRateLimiter.consume(req.ip || '');
        next();
    } catch (rejRes) {
        logger.warn(`Comment rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            success: false,
            message: 'Too many comments. Please try again later.',
            retryAfter: Math.round((rejRes as any).msBeforeNext / 1000)
        });
    }
};