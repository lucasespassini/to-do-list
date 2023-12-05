import express from "express";

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export const log = (req, res, next) => {
  const start = new Date().getTime();
  const { ip, method, originalUrl } = req;

  res.on("finish", () => {
    const { statusCode } = res;
    const elapsed = new Date().getTime() - start;

    console.log(
      `${method} - '${originalUrl}' - ${statusCode} - ${ip} - +${elapsed}ms`
    );
  });

  next();
};
