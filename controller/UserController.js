const express = require('express')
const router = express.Router()
const database = require('../database/connection')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const checkLogin = require('../middlewares/checkLogin')

router.get('/user/signup', (req, res) => {
   let nameError = req.flash('nameError')
   let emailError = req.flash('emailError')
   let passwordError = req.flash('passwordError')
   let successMsg = req.flash('successMsg')

   if (nameError != undefined) {
      if (nameError.length == 0) {
         nameError = undefined
      }
   }
   if (emailError != undefined) {
      if (emailError.length == 0) {
         emailError = undefined
      }
   }
   if (passwordError != undefined) {
      if (passwordError.length == 0) {
         passwordError = undefined
      }
   }
   if (successMsg != undefined) {
      if (successMsg.length == 0) {
         successMsg = undefined
      }
   }

   res.render('users/signUp', {
      errors: {
         nameError,
         emailError,
         passwordError
      },
      successMsg,
      name: req.flash('name'),
      email: req.flash('email')
   })
})

router.post('/user/create', (req, res) => {
   let { name, email, password } = req.body

   var nameError
   var emailError
   var passwordError

   if (name.length < 3) {
      nameError = 'O nome não pode ter menos de 3 caracteres.'
   }
   if (name == undefined || name == '') {
      nameError = 'O nome não pode ser vazio.'
   }
   if (validator.isEmail(email) == false) {
      emailError = 'O e-mail não é válido.'
   }
   if (email == undefined || email == '') {
      emailError = 'O e-mail não pode ser vazio.'
   }
   if (password.length < 5) {
      passwordError = 'A senha não pode ter menos de 5 caracteres.'
   }
   if (password == undefined || password == '') {
      passwordError = 'A senha não pode ser vazia.'
   }

   if (nameError != undefined || emailError != undefined || passwordError != undefined) {
      req.flash('nameError', nameError)
      req.flash('emailError', emailError)
      req.flash('passwordError', passwordError)

      req.flash('name', name)
      req.flash('email', email)
   
      res.redirect('/user/signup')
   } else {
      database.select().where({
         email: email
      }).table('users').then(async user => {
         if (user[0] == undefined) {
            var salt = bcrypt.genSaltSync(10)
            var hash = bcrypt.hashSync(password, salt)
   
            await database.insert({
               name: name,
               email: email,
               password: hash
            }).into('users').then(() => {
               database.select().where({
                  email: email
               }).table('users').then(user => {
                  req.session.user = {
                     id: user[0].id,
                     email: user[0].email
                  }
                  res.redirect('/')
               })
            })
         } else {
            emailError = 'Esse e-mail já está cadastrado.'
            req.flash('nameError', nameError)
            req.flash('emailError', emailError)
            req.flash('passwordError', passwordError)

            req.flash('name', name)
            req.flash('email', email)

            res.redirect('/user/signup')
         }
      })
   }
})

router.get('/user/signin', (req, res) => {
   var nameError = req.flash('nameError')
   var emailError = req.flash('emailError')
   var passwordError = req.flash('passwordError')

   if (nameError != undefined) {
      if (nameError.length == 0) {
         nameError = undefined
      }
   }
   if (emailError != undefined) {
      if (emailError.length == 0) {
         emailError = undefined
      }
   }
   if (passwordError != undefined) {
      if (passwordError.length == 0) {
         passwordError = undefined
      }
   }

   res.render('users/signIn', {
      errors: {
         nameError,
         emailError,
         passwordError
      },
      email: req.flash('email')
   })
})

router.post('/user/authenticate', (req, res) => {
   var { email, password } = req.body

   var emailError
   var passwordError

   if (validator.isEmail(email) == false) {
      emailError = 'O e-mail não é válido.'
   }
   if (email == undefined || email == '') {
      emailError = 'O e-mail não pode ser vazio.'
   }

   if (emailError != undefined) {
      req.flash('emailError', emailError)
      req.flash('passwordError', passwordError)

      req.flash('email', email)
   
      res.redirect('/user/signin')
   } else {
      database.select().where({
         email: email
      }).table('users').then(user => {
         if (user[0] != undefined) { // se existir usuário com esse email
            // validar senha
            var correct = bcrypt.compareSync(password, user[0].password)
   
            if (correct) {
               req.session.user = {
                  id: user[0].id,
                  email: user[0].email
               }
               res.redirect('/')
            } else {
               passwordError = 'Senha incorreta.'
               req.flash('passwordError', passwordError)
               res.redirect('/user/signin')
            }
         } else {
            emailError = 'Não existe usuário com esse e-mail.'
            req.flash('emailError', emailError)

            req.flash('email', email)
            res.redirect('/user/signin')
         }
      })
   }
})

router.get('/user/logout', checkLogin, (req, res) => {
   req.session.user = undefined
   res.redirect('/user/signin')
})

// Edição de dados
router.get('/user/edit', checkLogin, (req, res) => {
   var sessionId = req.session.user.id
   var successMsg = req.flash('successMsg')

   if (successMsg != undefined) {
      if (successMsg.length == 0) {
         successMsg = undefined
      }
   }

   database.select().where({
      id: sessionId
   }).table('users').then(user => {
      res.render('users/account', {
         successMsg,
         user: user[0]
      })
   })
})

router.get('/user/edit/name/:id', checkLogin, (req, res) => {
   var paramsId = req.params.id
   var sessionId = req.session.user.id

   var nameError = req.flash('nameError')
   var paramsError = req.flash('paramsError')

   if (nameError != undefined) {
      if (nameError.length == 0) {
         nameError = undefined
      }
   }
   if (paramsError != undefined) {
      if (paramsError.length == 0) {
         paramsError = undefined
      }
   }

   if (isNaN(paramsId)) {
      paramsError = 'Solicitação inválida.'
      req.flash('paramsError', paramsError)
      res.redirect('/user/edit/name/'+sessionId)
   } else {
      if (paramsId != sessionId) {
         paramsError = 'Não autorizado.'
         req.flash('paramsError', paramsError)
         res.redirect('/user/edit/name/'+sessionId)
      } else {
         database.select().where({
            id: sessionId
         }).table('users').then(user => {
            res.render('users/editName', {
               errors: {
                  nameError,
                  paramsError
               },
               user: user[0]
            })
         })
      }
   }
})

router.post('/user/update/name', checkLogin, (req, res) => {
   var sessionId = req.session.user.id
   var newName = req.body.name

   var nameError
   var successMsg

   database.select().where({
      id: sessionId
   }).table('users').then(async user => {
      if (newName == user[0].name) {
         nameError = 'O nome digitado não pode ser igual ao anterior.'
      }
      if (newName.length < 3) {
         nameError = 'O nome não pode ter menos de 3 caracteres.'
      }
      if (newName == undefined || newName == '') {
         nameError = 'O nome não pode ser vazio.'
      }

      if (nameError != undefined) {
         req.flash('nameError', nameError)
         res.redirect('/user/edit/name/'+sessionId)
      } else {
         await database.where({
            id: sessionId
         }).update({
            name: newName
         }).table('users').then(() => {
            successMsg = 'Nome alterado com sucesso.'
            req.flash('successMsg', successMsg)
            res.redirect('/user/edit')
         }).catch(err => {
            nameError = 'Não foi possível alterar o nome.'
            req.flash('nameError', nameError)
            res.redirect('/user/edit/name/'+sessionId)
         })
      }
   }) 
})

router.get('/user/edit/password/:id', checkLogin, (req, res) => {
   var paramsId = req.params.id
   var sessionId = req.session.user.id

   var passwordError = req.flash('passwordError')
   var paramsError = req.flash('paramsError')

   if (passwordError != undefined) {
      if (passwordError.length == 0) {
         passwordError = undefined
      }
   }
   if (paramsError != undefined) {
      if (paramsError.length == 0) {
         paramsError = undefined
      }
   }

   if (isNaN(paramsId)) {
      paramsError = 'Solicitação inválida.'
      req.flash('paramsError', paramsError)
      res.redirect('/user/edit/password/'+sessionId)
   } else {
      if (paramsId != sessionId) {
         paramsError = 'Não autorizado.'
         req.flash('paramsError', paramsError)
         res.redirect('/user/edit/password/'+sessionId)
      } else {
         database.select().where({
            id: sessionId
         }).table('users').then(user => {
            res.render('users/editPassword', {
               errors: {
                  passwordError,
                  paramsError
               },
               user: user[0]
            })
         })
      }
   }
})

router.post('/user/update/password', checkLogin, (req, res) => {
   var sessionId= req.session.user.id
   var oldPassword = req.body.oldPassword
   var newPassword = req.body.newPassword

   var passwordError
   var successMsg
   
   database.select().where({
      id: sessionId
   }).table('users').then(async user => {
      if (newPassword.length < 5) {
         passwordError = 'A nova senha não pode ter menos de 5 caracteres.'
      }
      if (newPassword == undefined || newPassword == '') {
         passwordError = 'A nova senha não pode ser vazia.'
      }

      if (passwordError != undefined) {
         req.flash('passwordError', passwordError)
         res.redirect('/user/edit/password/'+sessionId)
      } else {
         if (bcrypt.compareSync(oldPassword, user[0].password)) {
            if (bcrypt.compareSync(newPassword, user[0].password)) {
               passwordError = 'A nova senha não pode ser igual a anterior.'
               req.flash('passwordError', passwordError)
               res.redirect('/user/edit/password/'+sessionId)
            } else {
               var salt = bcrypt.genSaltSync(10)
               var newHash = bcrypt.hashSync(newPassword, salt)
               await database.where({
                  id: sessionId
               }).update({
                  password: newHash
               }).table('users').then(() => {
                  successMsg = 'Senha alterada com sucesso.'
                  req.flash('successMsg', successMsg)
                  res.redirect('/user/edit')
               }).catch(err => {
                  passwordError = 'Não foi possível alterar a senha.'
                  req.flash('passwordError', passwordError)
                  res.redirect('/user/edit/password/'+sessionId)
               })
            } 
         } else {
            passwordError = 'Senha incorreta.'
            req.flash('passwordError', passwordError)
            res.redirect('/user/edit/password/'+sessionId)
         }
      }
   }) 
})

router.post('/user/delete', checkLogin, (req, res) => {
   var sessionId = req.session.user.id
   var success

   database.where({
      id: sessionId
   }).delete().table('users').then(() => {
      success = 'Conta deletada com sucesso.'
      req.flash('successMsg', success)
      res.redirect('/user/signup')
   }).catch(err => {
      res.redirect('/user/edit')
   })
})

module.exports = router