const tableName = 'user_profile';

exports.up = (knex) => {
  return knex.schema.createTable(tableName, (table) => {
    table.uuid('id').primary()
      .references('id').inTable('entity')
      .onDelete('cascade');
    table.uuid('user_id').index()
      .references('id').inTable('user')
      .onDelete('cascade');
    table.string('first_name', 50).nullable();
    table.string('middle_name', 50).nullable();
    table.string('last_name', 50).nullable();
    table.string('job_title', 100).nullable().index();
    table.string('organisation', 100).nullable().index();
    table.string('industry', 100).nullable().index();
    table.string('city', 100).nullable().index();
    table.string('country', 100).nullable().index();
    table.integer('dob_year').nullable().index();
    table.integer('min_salary').nullable().index();
    table.text('summary').nullable();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable(tableName);
};