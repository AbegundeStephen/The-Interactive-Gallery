import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('images', (table) => {
        table.string('id').primary();
        table.string('title').notNullable();
        table.text('description');
        table.string('author').notNullable();
        table.string('author_username').notNullable();
        table.string('url_regular').notNullable();
        table.string('url_thumb').notNullable();
        table.string('url_full').notNullable();
        table.json('tags').defaultTo('[]');
        table.integer('likes_count').defaultTo(0);
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('images');
}