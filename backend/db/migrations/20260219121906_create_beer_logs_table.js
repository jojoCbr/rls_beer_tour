/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await knex.schema.createTable('beer_logs', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('beer_id').notNullable().references('id').inTable('beers').onDelete('CASCADE');
    table.uuid('bar_id').nullable().references('id').inTable('bars').onDelete('SET NULL');
    table.integer('score').checkBetween([1, 10]);
    table.timestamp('consumed_at').defaultTo(knex.fn.now());
    table.text('notes');
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable('beer_logs');
  await knex.schema.raw('DROP EXTENSION IF EXISTS "uuid-ossp"');
};