import bcryptjs from "bcryptjs";
import { Router } from "express";
import validator from "validator";
import { knex } from "../database/connection.js";
import { verifyAuth } from "../middlewares/verifyAuth.js";
const userRouter = Router();

userRouter.get("/user/signup", (req, res) => {
  res.render("users/signUp", {
    errors: {
      nameError: req.flash("nameError"),
      emailError: req.flash("emailError"),
      passwordError: req.flash("passwordError"),
    },
    successMsg: req.flash("successMsg"),
    name: req.flash("name"),
    email: req.flash("email"),
  });
});

userRouter.post("/user/create", async (req, res) => {
  const { name, email, password } = req.body;

  const errors = {};

  if (name.length < 3)
    errors.nameError = "O nome não pode ter menos de 3 caracteres.";

  if (!validator.isEmail(email)) errors.emailError = "O e-mail não é válido.";

  if (password.length < 5)
    errors.passwordError = "A senha não pode ter menos de 5 caracteres.";

  if (Object.keys(errors).length > 0) {
    req.flash("nameError", errors.nameError);
    req.flash("emailError", errors.emailError);
    req.flash("passwordError", errors.passwordError);

    req.flash("name", name);
    req.flash("email", email);

    return res.redirect("/user/signup");
  }

  const [user] = await knex.select('*').where({ email }).table("users");

  if (user) {
    req.flash("emailError", "Esse e-mail já está cadastrado.");

    req.flash("name", name);
    req.flash("email", email);

    return res.redirect("/user/signup");
  }

  await knex
    .insert({
      name,
      email,
      password: bcryptjs.hashSync(password, 10),
    })
    .into("users");

  const [newUser] = await knex.select('*').where({ email }).table("users");

  req.session.user = {
    id: newUser.id,
    email: newUser.email,
  };

  res.redirect("/");
});

userRouter.get("/user/signin", (req, res) => {
  res.render("users/signIn", {
    errors: {
      nameError: req.flash("nameError"),
      emailError: req.flash("emailError"),
      passwordError: req.flash("passwordError"),
    },
    email: req.flash("email"),
  });
});

userRouter.post("/user/authenticate", async (req, res) => {
  const { email, password } = req.body;

  const errors = {};

  if (!validator.isEmail(email)) errors.emailError = "O e-mail não é válido.";

  if (Object.keys(errors).length > 0) {
    req.flash("emailError", errors.emailError);
    req.flash("email", email);

    return res.redirect("/user/signin");
  }

  const [user] = await knex.select('*').where({ email }).table("users");

  if (!user) {
    req.flash("emailError", "Não existe usuário com esse e-mail.");
    req.flash("email", email);
    return res.redirect("/user/signin");
  }

  if (!bcryptjs.compareSync(password, user.password)) {
    req.flash("passwordError", "Senha incorreta.");
    return res.redirect("/user/signin");
  }

  req.session.user = {
    id: user.id,
    email: user.email,
  };

  res.redirect("/");
});

userRouter.get("/user/logout", verifyAuth, (req, res) => {
  req.session.user = undefined;
  return res.redirect("/user/signin");
});

userRouter.get("/user/edit", verifyAuth, async (req, res) => {
  const { id } = req.session.user;

  const user = await knex.select('*').where({ id }).table("users");

  res.render("users/account", {
    successMsg: req.flash("successMsg"),
    user,
  });
});

userRouter.get("/user/edit/name", verifyAuth, async (req, res) => {
  const { id } = req.session.user;

  const [user] = await knex.select('*').where({ id }).table("users");
  res.render("users/editName", {
    errors: { nameError: req.flash("nameError") },
    user,
  });
});

userRouter.post("/user/update/name", verifyAuth, async (req, res) => {
  const { id } = req.session.user;
  const { name } = req.body;

  const errors = {};
  const [user] = await knex.select('*').where({ id }).table("users");

  if (name === user.name)
    errors.nameError = "O nome digitado não pode ser igual ao anterior.";
  if (name.length < 3)
    errors.nameError = "O nome não pode ter menos de 3 caracteres.";

  if (Object.keys(errors).length > 0) {
    req.flash("nameError", errors.nameError);
    return res.redirect(`/user/edit/name/${id}`);
  }

  try {
    await knex.update({ name }).where({ id }).table("users");
    req.flash("successMsg", "Nome alterado com sucesso.");
    res.redirect("/user/edit");
  } catch (error) {
    req.flash("nameError", "Não foi possível alterar o nome.");
    res.redirect(`/user/edit/name/${id}`);
  }
});

userRouter.get("/user/edit/password", verifyAuth, async (req, res) => {
  const { id } = req.session.user;

  const [user] = await knex.select('*').where({ id }).table("users");

  res.render("users/editPassword", {
    errors: {
      passwordError: req.flash("passwordError"),
    },
    user: user,
  });
});

userRouter.post("/user/update/password", verifyAuth, async (req, res) => {
  const { id } = req.session.user;
  const { newPassword, oldPassword } = req.body;

  const errors = {};

  const [user] = await knex.select('*').where({ id }).table("users");

  if (newPassword.length < 5)
    errors.passwordError = "A nova senha não pode ter menos de 5 caracteres.";

  if (Object.keys(errors).length > 0) {
    req.flash("passwordError", errors.passwordError);
    return res.redirect(`/user/edit/password/${id}`);
  }

  if (!bcryptjs.compareSync(oldPassword, user.password)) {
    req.flash("passwordError", "Senha incorreta.");
    return res.redirect(`/user/edit/password/${id}`);
  }

  try {
    await knex
      .update({ password: hashSync(newPassword, 10) })
      .where({ id })
      .table("users");

    req.flash("successMsg", "Senha alterada com sucesso.");
    res.redirect("/user/edit");
  } catch (error) {
    req.flash("passwordError", "Não foi possível alterar a senha.");
    res.redirect(`/user/edit/password/${id}`);
  }
});

userRouter.post("/user/delete", verifyAuth, async (req, res) => {
  const { id } = req.session.user;

  try {
    await knex.where({ id }).delete().table("users");

    req.flash("successMsg", "Conta deletada com sucesso.");
    res.redirect("/user/signup");
  } catch (error) {
    res.redirect("/user/edit");
  }
});

export { userRouter };
