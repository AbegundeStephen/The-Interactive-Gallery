import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    // Enable uuid-ossp extension if not already done in another migration
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    return knex.schema.createTable('images', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('title').notNullable();
        table.text('description');
        table.string('author').notNullable();
        table.string('author_username').notNullable();
        table.string('url_regular').notNullable();
        table.string('url_thumb').notNullable();
        table.string('url_full').notNullable();
        table.json('tags').defaultTo(knex.raw(`'[]'::json`));
        table.integer('likes_count').defaultTo(0);
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('images');
}
