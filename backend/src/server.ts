import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { generalRateLimit } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import imageRoutes from './routes/images';
import authRoutes from './routes/auth';
import commentRoutes from "./routes/comments"
import likesRoutes from "./routes/likes"
import * as Sentry from "@sentry/node"

import logger, { requestLogger } from './config/logger';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '8080', 10);

app.use(requestLogger)

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));


app.use(generalRateLimit);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Trust proxy for rate limiting and IP detection
app.set('trust proxy', 1);

// Routes
app.use('/api/images', imageRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/comments", commentRoutes)
app.use("/api/likes", likesRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use(errorHandler);
Sentry.init({
    dsn: "https://90bd477436c6ab5ed43b21b93edb7882@o4509627687829504.ingest.us.sentry.io/4509627688091648",

    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,
});


app.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 Server running on port ${PORT}`);
    logger.info(`📱 Environment: ${process.env.NODE_ENV}`);
});

export default app;
