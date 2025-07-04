// src/routes/images.ts
import express, { Request, Response } from 'express';
import Joi from 'joi';
import db from '../config/database';
import unsplashService from '../services/unsplashService';
import { optionalAuth, AuthRequest } from '../middleware/auth';
import { Image } from '../types';

const router = express.Router();

// Validation schemas
const getImagesSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(20),
    query: Joi.string().max(100)
});

const imageIdSchema = Joi.object({
    id: Joi.string().required()
});