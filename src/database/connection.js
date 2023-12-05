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
  const [hasTableUsers, hasTablePriorities, hasTableToDos, hasTableNotes] = await Promise.all([
    knex.schema.hasTable("users"),
    knex.schema.hasTable("priorities"),
    knex.schema.hasTable("to_dos"),
    knex.schema.hasTable("notes"),
  ])

  if (!hasTableUsers)
    await knex.schema.createTable("users", (table) => {
      table.increments("id").primary().notNullable();
      table.string("name").notNullable();
      table.string("email").notNullable();
      table.string("password").notNullable();
    });

  if (!hasTablePriorities)
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

  if (!hasTableToDos)
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

  if (!hasTableNotes)
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

})();

export { knex };
