import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    return knex.schema.createTable('comments', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('image_id').notNullable();
        table.uuid('user_id').nullable(); // user_id should be UUID now
        table.text('content').notNullable();
        table.string('author_name').notNullable();
        table.string('author_email').notNullable();
        table.timestamps(true, true);

        table.foreign('image_id').references('images.id').onDelete('CASCADE');
        table.foreign('user_id').references('users.id').onDelete('SET NULL');
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('comments');
}
