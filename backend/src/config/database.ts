import knex, { Knex } from 'knex';
import { knexConfig } from '../knexfile';

const environment = process.env.NODE_ENV || 'development';
const config = knexConfig[environment];

const db: Knex = knex(config);

export default db;

// src/knexfile.ts
import { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

interface KnexConfig {
    [key: string]: Knex.Config;
}

export const knexConfig: KnexConfig = {
    development: {
        client: 'postgresql',
        connection: process.env.DATABASE_URL,
        migrations: {
            directory: './migrations'
        },
        seeds: {
            directory: './seeds'
        }
    },
    production: {
        client: 'postgresql',
        connection: process.env.DATABASE_URL,
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