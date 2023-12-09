import bcryptjs from "bcryptjs";
import { Router } from "express";
import validator from "validator";
import { knex } from "../database/connection.js";
import { verifyAuth } from "../middlewares/verifyAuth.js";
const userRouter = Router();

userRouter.get("/signup", (req, res) => {
  res.render("pages/signup", {
    errors: req.flash("errors"),
    messages: req.flash("messages"),
    prevForm: req.flash("prevForm")[0],
  });
});

userRouter.post("/user/create", async (req, res) => {
  const { name, email, password } = req.body;

  const errors = [];

  if (name.length < 3)
    errors.push("O nome não pode ter menos de 3 caracteres.");
  if (!validator.isEmail(email)) errors.push("O e-mail não é válido.");
  if (password.length < 5)
    errors.push("A senha não pode ter menos de 5 caracteres.");

  if (errors.length > 0) {
    req.flash("errors", errors);
    req.flash("prevForm", { name, email });

    return res.redirect("/signup");
  }

  const [user] = await knex.select("*").where({ email }).table("users");

  if (user) {
    req.flash("errors", "Esse e-mail já está cadastrado.");
    req.flash("prevForm", { name, email });

    return res.redirect("/signup");
  }

  await knex
    .insert({
      name,
      email,
      password: bcryptjs.hashSync(password, 10),
    })
    .into("users");

  const [newUser] = await knex.select("*").where({ email }).table("users");

  req.session.user = {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
  };

  req.flash("messages", `Seja bem vindo(a) ${newUser.name.split(" ")[0]}`);
  res.redirect("/");
});

userRouter.get("/signin", (req, res) => {
  res.render("pages/signin", {
    errors: req.flash("errors"),
    prevForm: req.flash("prevForm")[0],
  });
});

userRouter.post("/user/authenticate", async (req, res) => {
  const { email, password } = req.body;

  const errors = [];

  if (!validator.isEmail(email)) errors.push("O e-mail não é válido.");

  if (errors.length > 0) {
    req.flash("errors", errors);
    req.flash("prevForm", { email });

    return res.redirect("/signin");
  }

  const [user] = await knex.select("*").where({ email }).table("users");

  if (!user) {
    req.flash("errors", "Não existe usuário com esse e-mail.");
    req.flash("prevForm", { email });
    return res.redirect("/signin");
  }

  if (!bcryptjs.compareSync(password, user.password)) {
    req.flash("errors", "Senha incorreta.");
    return res.redirect("/signin");
  }

  req.session.user = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  res.redirect("/");
});

userRouter.get("/signout", verifyAuth, (req, res) => {
  req.session.user = undefined;
  res.redirect("/signin");
});

userRouter.get("/profile", verifyAuth, async (req, res) => {
  const { user } = req.session;

  res.render("pages/profile", {
    messages: req.flash("messages"),
    errors: req.flash("errors"),
    user,
  });
});

userRouter.get("/profile/edit/name", verifyAuth, async (req, res) => {
  const { user } = req.session;

  res.render("pages/updateName", {
    errors: req.flash("errors"),
    user,
  });
});

userRouter.post("/user/update/name", verifyAuth, async (req, res) => {
  const { user } = req.session;
  const { name } = req.body;

  const errors = [];

  if (name === user.name)
    errors.push("O nome digitado não pode ser igual ao anterior.");
  if (name.length < 3)
    errors.push("O nome não pode ter menos de 3 caracteres.");

  if (errors.length > 0) {
    req.flash("errors", errors);
    return res.redirect("/profile/edit/name");
  }

  try {
    await knex.update({ name }).where({ id: user.id }).table("users");
    req.session.user = { ...user, name };
    req.flash("messages", "Nome alterado com sucesso.");
    res.redirect("/profile");
  } catch (error) {
    req.flash("errors", "Não foi possível alterar o nome.");
    res.redirect("/profile/edit/name");
  }
});

userRouter.get("/profile/edit/password", verifyAuth, async (req, res) => {
  const { user } = req.session;

  res.render("pages/updatePassword", {
    errors: req.flash("errors"),
    user,
  });
});

userRouter.post("/user/update/password", verifyAuth, async (req, res) => {
  const { id } = req.session.user;
  const { newPassword, oldPassword } = req.body;

  const errors = [];

  const [user] = await knex.select("*").where({ id }).table("users");

  if (newPassword.length < 5)
    errors.push("A nova senha não pode ter menos de 5 caracteres.");
  if (!bcryptjs.compareSync(oldPassword, user.password))
    errors.push("Senha incorreta.");

  if (errors.length > 0) {
    req.flash("errors", errors);
    return res.redirect("/profile/edit/password");
  }

  try {
    await knex
      .update({ password: bcryptjs.hashSync(newPassword, 10) })
      .where({ id })
      .table("users");

    req.flash("messages", "Senha alterada com sucesso.");
    res.redirect("/profile");
  } catch (error) {
    req.flash("errors", "Não foi possível alterar a senha.");
    res.redirect("/profile/edit/password");
  }
});

userRouter.post("/user/delete", verifyAuth, async (req, res) => {
  const { id } = req.session.user;

  try {
    await knex.delete().where({ id }).table("users");
    req.flash("messages", "Conta deletada com sucesso.");
    req.session.user = undefined;
    res.redirect("/signup");
  } catch (error) {
    req.flash("errors", "Não foi possível deletar sua conta.");
    res.redirect("/profile");
  }
});

export { userRouter };
