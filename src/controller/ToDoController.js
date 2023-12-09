import { Router } from "express";
import { knex } from "../database/connection.js";
const todoRouter = Router();

todoRouter.post("/to-do/create", async (req, res) => {
  const { id } = req.session.user;
  const { conteudo } = req.body;

  try {
    await knex
      .insert({
        conteudo,
        userId: id,
      })
      .into("to_dos");
    res.redirect("/");
  } catch (error) {
    res.redirect("/");
  }
});

todoRouter.post("/to-do/delete/:id", async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) return res.redirect("/");

  try {
    await knex.delete().where({ id }).table("to_dos");
    res.redirect("/");
  } catch (error) {
    res.redirect("/");
  }
});

export { todoRouter };
