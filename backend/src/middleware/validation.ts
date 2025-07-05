import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const validateComment = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        content: Joi.string().min(5).max(500).required(),
        author_name: Joi.string().min(2).max(100).required(),
        author_email: Joi.string().email().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

export const validateAuth = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};