import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../config/database';

export class AuthController {
    signup = async (req: Request, res: Response): Promise<void> => {
        try {
            const { username, email, password } = req.body;

            // Check if user exists
            const existingUser = await db('users')
                .where('email', email)
                .orWhere('username', username)
                .first();

            if (existingUser) {
                res.status(400).json({ error: 'User already exists' });
                return
            }

            // Hash password
            const passwordHash = await bcrypt.hash(password, 10);

            // Create user
            const user = await db('users').insert({
                username,
                email,
                password_hash: passwordHash
            }).returning(['id', 'username', 'email', 'created_at']);

            // Generate token
            const token = jwt.sign(
                { userId: user[0].id },
                process.env.JWT_SECRET!,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                user: user[0],
                token
            });
        } catch (error) {
            console.error('Error in signup:', error);
            res.status(500).json({ error: 'Failed to create user' });
        }
    };

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;

            // Find user
            const user = await db('users').where('email', email).first();
            if (!user) {
                res.status(400).json({ error: 'Invalid credentials' });
                return
            }

            // Check password
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);
            if (!isPasswordValid) {
                res.status(400).json({ error: 'Invalid credentials' });
                return
            }

            // Generate token
            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET!,
                { expiresIn: '24h' }
            );

            res.json({
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    created_at: user.created_at
                },
                token
            });
        } catch (error) {
            console.error('Error in login:', error);
            res.status(500).json({ error: 'Failed to login' });
        }
    };
}