// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Core modules
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { db } from './config/database';

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

const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:5173']; // fallback

// Trust proxy
app.set('trust proxy', 1);

// Middleware
app.use(requestLogger);
app.use(helmet());
app.use(cors({ origin: corsOrigins, credentials: true }));
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

// 404
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

// Function to check DB connection
async function verifyDatabaseConnection() {
    try {

        await db.raw('SELECT 1+1 AS result');
        logger.info('✅ Database connected successfully.');
        return true;
    } catch (error) {
        logger.error('❌ Failed to connect to the database:', error);
        return false;
    }
}

// Start server only after DB is ready
async function startServer() {
    const isDbConnected = await verifyDatabaseConnection();

    if (!isDbConnected) {
        logger.error('🛑 Exiting due to DB connection failure.');
        process.exit(1);
    }

    app.listen(PORT, '0.0.0.0', () => {
        logger.info(`🚀 Server running on port ${PORT}`);
        logger.info(`📱 Environment: ${process.env.NODE_ENV}`);
    });
}

startServer();

export default app;
