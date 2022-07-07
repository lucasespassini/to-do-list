function checkLogin(req, res, next) {
   if (req.session.user != undefined) {
      next()
   } else {
      res.redirect('/user/signin')
   }
}

module.exports = checkLogin