import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    // Ensures UUID generation is supported
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    return knex.schema.createTable('likes', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.uuid('image_id').notNullable();
        table.uuid('user_id').nullable();
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
