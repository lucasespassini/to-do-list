export const verifyAuth = (req, res, next) =>
  !req.session.user ? res.redirect('/user/signin') : next()
