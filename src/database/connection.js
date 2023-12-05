import Knex from "knex";

const knex = Knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
});

(async () => {
  if (!(await knex.schema.hasTable("users"))) {
    await knex.schema.createTable("users", (table) => {
      table.increments("id").primary().notNullable();
      table.string("name").notNullable();
      table.string("email").notNullable();
      table.string("password").notNullable();
    });
  }
  if (!(await knex.schema.hasTable("priorities"))) {
    await knex.schema.createTable("priorities", (table) => {
      table.increments("id").primary();
      table
        .integer("userId")
        .unsigned()
        .references("id")
        .inTable("users")
        .notNullable();
      table.string("conteudo").notNullable();
    });
  }
  if (!(await knex.schema.hasTable("to_dos"))) {
    await knex.schema.createTable("to_dos", (table) => {
      table.increments("id").primary();
      table
        .integer("userId")
        .unsigned()
        .references("id")
        .inTable("users")
        .notNullable();
      table.string("conteudo").notNullable();
    });
  }
  if (!(await knex.schema.hasTable("notes"))) {
    await knex.schema.createTable("notes", (table) => {
      table.increments("id").primary();
      table
        .integer("userId")
        .unsigned()
        .references("id")
        .inTable("users")
        .notNullable();
      table.string("conteudo").notNullable();
    });
  }
})();

export { knex };
