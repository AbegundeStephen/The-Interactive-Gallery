import { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

interface KnexConfig {
    [key: string]: Knex.Config;
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
}

console.log("database url...", databaseUrl)
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