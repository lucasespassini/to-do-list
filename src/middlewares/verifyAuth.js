import express from "express";

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export const verifyAuth = (req, res, next) =>
  req.session.user ? next() : res.redirect("/signin");
