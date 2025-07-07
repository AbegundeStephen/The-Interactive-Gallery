// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Core modules
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Middleware
import { generalRateLimit } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import logger, { requestLogger } from './config/logger';

// Routes
import imageRoutes from './routes/images';
import authRoutes from './routes/auth';
import commentRoutes from './routes/comments';
import likesRoutes from './routes/likes';

const app = express();
const PORT = parseInt(process.env.PORT || '8080', 10);

// Trust proxy (for rate limiting, IP logging, etc.)
app.set('trust proxy', 1);

// Middleware
app.use(requestLogger);
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(generalRateLimit);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/images', imageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likesRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 Server running on port ${PORT}`);
    logger.info(`📱 Environment: ${process.env.NODE_ENV}`);
});

export default app;
