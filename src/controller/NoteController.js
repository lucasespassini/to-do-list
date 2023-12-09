import { Router } from "express";
import { knex } from "../database/connection.js";
const noteRouter = Router();

noteRouter.post("/note/create", async (req, res) => {
  const { id } = req.session.user;
  const { conteudo } = req.body;

  try {
    await knex
      .insert({
        conteudo,
        userId: id,
      })
      .into("notes");
    res.redirect("/");
  } catch (error) {
    res.redirect("/");
  }
});

noteRouter.post("/note/delete/:id", async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) return res.redirect("/");

  try {
    await knex.delete().where({ id }).table("notes");
    res.redirect("/");
  } catch (error) {
    res.redirect("/");
  }
});

export { noteRouter };
