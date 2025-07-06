import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('images', (table) => {
        table.string('id').primary();
        table.text('title').notNullable(); 
        table.text('description');          
        table.string('author').notNullable(); 
        table.string('author_username').notNullable(); 
        table.text('url_regular').notNullable(); 
        table.text('url_thumb').notNullable();  
        table.text('url_full').notNullable();    
        table.json('tags').defaultTo(knex.raw(`'[]'::json`));
        table.integer('likes_count').defaultTo(0);
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('images');
}
