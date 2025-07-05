import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('comments', (table) => {
        table.increments('id').primary();
        table.string('image_id').notNullable();
        table.integer('user_id').unsigned().nullable();
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
