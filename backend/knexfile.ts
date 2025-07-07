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
        connection: databaseUrl,
        migrations: {
            directory: './migrations'
        },
        seeds: {
            directory: './seeds'
        }
    },
    production: {
        client: 'postgresql',
        connection: databaseUrl,
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