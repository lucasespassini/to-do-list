import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import flash from "express-flash";
import session from "express-session";
import { homeRouter } from "./controller/HomeController.js";
import { noteRouter } from "./controller/NoteController.js";
import { priorityRouter } from "./controller/PriorityController.js";
import { todoRouter } from "./controller/ToDoController.js";
import { userRouter } from "./controller/UserController.js";
const app = express();

app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(flash());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", homeRouter);
app.use("/", userRouter);
app.use("/", priorityRouter);
app.use("/", todoRouter);
app.use("/", noteRouter);

app.listen(8080, () => console.log("Server started"));
