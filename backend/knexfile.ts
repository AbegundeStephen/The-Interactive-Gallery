import { Knex } from 'knex';
import dotenv from 'dotenv';
import logger from './src/config/logger';

dotenv.config();

interface KnexConfig {
    [key: string]: Knex.Config;
}

const databaseUrl = String(process.env.DATABASE_URL);
if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
}


export const knexConfig: KnexConfig = {
    development: {
        client: 'postgresql',
        connection: 'postgresql://neondb_owner:npg_d81bJVQocgOY@ep-soft-flower-ab55lafh-pooler.eu-west-2.aws.neon.tech/interractive_gallery_db?sslmode=require&channel_binding=require',
        migrations: {
            directory: './migrations'
        },
        seeds: {
            directory: './seeds'
        }
    },
    production: {
        client: 'postgresql',
        connection: {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'password',
            database: process.env.DB_NAME || 'interactive_gallery'
        },
        migrations: {
            directory: './migrations'
        },
        pool: {
            min: 2,
            max: 10
        }
    }
};

export default knexConfig;