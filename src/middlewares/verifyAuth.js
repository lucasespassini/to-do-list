export const verifyAuth = (req, res, next) =>
  req.session.user ? next() : res.redirect("/user/signin");
