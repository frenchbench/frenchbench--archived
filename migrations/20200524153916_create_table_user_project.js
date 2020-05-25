const tableName = 'user_project';

exports.up = (knex) => {
  return knex.schema.createTable(tableName, (table) => {
    table.uuid('id').notNullable().primary()
      .references('id').inTable('entity')
      .onDelete('cascade');
    table.uuid('user_id').notNullable().index()
      .references('id').inTable('user')
      .onDelete('cascade');
    table.string('summary', 100).notNullable();
    table.string('organisation', 100).nullable();
    table.date('date_from').nullable();
    table.date('date_to').nullable();
    table.text('info').nullable();
    table.jsonb('skills').nullable().defaultTo('[]');
    table.integer('order_idx').notNullable().defaultTo(0).index();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable(tableName);
};
