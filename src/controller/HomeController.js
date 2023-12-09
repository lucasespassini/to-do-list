import { Router } from "express";
import { knex } from "../database/connection.js";
import { verifyAuth } from "../middlewares/verifyAuth.js";
const homeRouter = Router();

homeRouter.get("/", verifyAuth, async (req, res) => {
  const { id } = req.session.user;

  const [priorities, to_dos, notes, [user]] = await Promise.all([
    knex.select().from("priorities").where({ userId: id }),
    knex.select().from("to_dos").where({ userId: id }),
    knex.select().from("notes").where({ userId: id }),
    knex.select().from("users").where({ id }),
  ]);

  res.render("pages/home", {
    errors: req.flash("errors"),
    messages: req.flash("messages"),
    priorities,
    to_dos,
    notes,
    user,
  });
});

export { homeRouter };
