// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../config/database';
import { User } from '../types';

export interface AuthRequest extends Request {
    user?: User;
}

interface JwtPayload {
    userId: number;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers['authorization'];
    console.log("auth", authHeader)
    const token = authHeader && authHeader.split(' ')[1];
    console.log("token", token)

    if (!token) {
        res.status(401).json({ error: 'Access token required' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        const user = await db('users').where('id', decoded.userId).first() as User;

        if (!user) {
            res.status(401).json({ error: 'User not found' });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid token' });
    }
};

