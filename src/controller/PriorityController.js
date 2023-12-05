import { Router } from "express";
import { knex } from "../database/connection.js";
const priorityRouter = Router();

priorityRouter.post("/priority/create", async (req, res) => {
  const { id } = req.session.user;
  const { conteudo } = req.body;

  try {
    await knex
      .insert({
        conteudo,
        userId: id,
      })
      .into("priorities");
    res.redirect("/");
  } catch (error) {
    res.redirect("/");
  }
});

priorityRouter.post("/priority/delete", async (req, res) => {
  const { id } = req.body;

  if (!id || isNaN(id)) return res.redirect("/");

  try {
    await knex.delete().where({ id }).table("priorities");
    res.redirect("/");
  } catch (error) {
    res.redirect("/");
  }
});

export { priorityRouter };
