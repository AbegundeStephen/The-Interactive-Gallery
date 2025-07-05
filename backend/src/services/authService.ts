import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '@/config/database';
import { User } from '@/types';
import logger from '@/config/logger';

class AuthService {
    private jwtSecret: string;
    private jwtExpiresIn: string | number;

    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
    }

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 12);
    }

    async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    generateToken(payload: { id: number; email: string; username: string }): string {
        return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn });
    }

    verifyToken(token: string): any {
        try {
            return jwt.verify(token, this.jwtSecret);
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    async register(email: string, username: string, password: string): Promise<{ user: Omit<User, 'password'>, token: string }> {
        try {
            // Check if user already exists
            const existingUser = await db('users')
                .where('email', email)
                .orWhere('username', username)
                .first();

            if (existingUser) {
                throw new Error('User already exists with this email or username');
            }

            // Hash password
            const hashedPassword = await this.hashPassword(password);

            // Create user
            const [user] = await db('users')
                .insert({
                    email,
                    username,
                    password: hashedPassword
                })
                .returning(['id', 'email', 'username', 'created_at', 'updated_at']);

            // Generate token
            const token = this.generateToken({
                id: user.id,
                email: user.email,
                username: user.username
            });

            logger.info(`User registered: ${user.email}`);

            return { user, token };
        } catch (error) {
            logger.error('Error registering user:', error);
            throw error;
        }
    }

    async login(email: string, password: string): Promise<{ user: Omit<User, 'password'>, token: string }> {
        try {
            // Find user by email
            const user = await db('users').where('email', email).first();

            if (!user) {
                throw new Error('Invalid credentials');
            }

            // Check password
            const isPasswordValid = await this.comparePassword(password, user.password);

            if (!isPasswordValid) {
                throw new Error('Invalid credentials');
            }

            // Generate token
            const token = this.generateToken({
                id: user.id,
                email: user.email,
                username: user.username
            });

            // Remove password from response
            const { password: _, ...userWithoutPassword } = user;

            logger.info(`User logged in: ${user.email}`);

            return { user: userWithoutPassword, token };
        } catch (error) {
            logger.error('Error logging in user:', error);
            throw error;
        }
    }

    async getUserById(id: number): Promise<Omit<User, 'password'> | null> {
        try {
            const user = await db('users')
                .select(['id', 'email', 'username', 'created_at', 'updated_at'])
                .where('id', id)
                .first();

            return user || null;
        } catch (error) {
            logger.error(`Error fetching user ${id}:`, error);
            throw new Error('Failed to fetch user');
        }
    }

    async updateUser(id: number, updates: Partial<Pick<User, 'email' | 'username'>>): Promise<Omit<User, 'password'>> {
        try {
            const [user] = await db('users')
                .where('id', id)
                .update(updates)
                .returning(['id', 'email', 'username', 'created_at', 'updated_at']);

            if (!user) {
                throw new Error('User not found');
            }

            return user;
        } catch (error) {
            logger.error(`Error updating user ${id}:`, error);
            throw new Error('Failed to update user');
        }
    }
}

export default new AuthService();