import knex from 'knex';
import knexConfig from '../../knexfile'

const environment = process.env.NODE_ENV || 'development';
const config = knexConfig[environment]
console.log("Attempting database connection with the following params...",config.connection)

export const db = knex(config)
