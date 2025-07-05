import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error('Error:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip
    });

    // Default error
    let error = {
        success: false,
        message: 'Internal server error'
    };

    // Validation errors
    if (err.name === 'ValidationError') {
        error.message = err.message;
        return res.status(400).json(error);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        error.message = 'Invalid token';
        return res.status(401).json(error);
    }

    if (err.name === 'TokenExpiredError') {
        error.message = 'Token expired';
        return res.status(401).json(error);
    }

    // Database errors
    if (err.message.includes('duplicate key')) {
        error.message = 'Resource already exists';
        return res.status(409).json(error);
    }

    // Custom application errors
    if (err.message.includes('not found')) {
        error.message = err.message;
        return res.status(404).json(error);
    }

    if (err.message.includes('unauthorized') || err.message.includes('Invalid credentials')) {
        error.message = err.message;
        return res.status(401).json(error);
    }

    if (err.message.includes('forbidden')) {
        error.message = err.message;
        return res.status(403).json(error);
    }

    // Default 500 error
    res.status(500).json(error);
};

export const notFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
};