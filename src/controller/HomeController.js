import { Router } from "express";
import { knex } from "../database/connection.js";
import { verifyAuth } from "../middlewares/verifyAuth.js";
const homeRouter = Router();

homeRouter.get("/", verifyAuth, async (req, res) => {
  const { id } = req.session.user;

  const results = await Promise.all([
    knex.select().from("priorities").where({ userId: id }),
    knex.select().from("to_dos").where({ userId: id }),
    knex.select().from("notes").where({ userId: id }),
    knex.select().from("users").where({ id }),
  ]);

  // const teste = await knex
  //   .select("users.*, priorities.*")
  //   .from("users")
  //   .leftJoin("priorities", "users.id", "priorities.userId")
  //   .leftJoin("to_dos", "users.id", "to_dos.userId")
  //   .leftJoin("notes", "users.id", "notes.userId")
  //   .where("users.id", id);
  // console.log(teste);

  res.render("index", {
    priorities: results[0],
    to_dos: results[1],
    notes: results[2],
    user: results[3][0],
  });
});

export { homeRouter };
