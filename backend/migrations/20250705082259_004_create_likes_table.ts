import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('likes', (table) => {
        table.increments('id').primary();
        table.string('image_id').notNullable();
        table.integer('user_id').unsigned().nullable();
        table.string('ip_address').notNullable();
        table.timestamps(true, true);

        table.foreign('image_id').references('images.id').onDelete('CASCADE');
        table.foreign('user_id').references('users.id').onDelete('SET NULL');
        table.unique(['image_id', 'user_id', 'ip_address']);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('likes');
}