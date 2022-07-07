const express = require('express')
const router = express.Router()
const database = require('../database/connection')

router.post('/priority/create', async (req, res) => {
   const id = req.session.user.id
   const conteudo = req.body.conteudo

   await database.insert({
      conteudo: conteudo,
      userId: id
   }).into('priorities')

   res.redirect('/')
})

router.post('/priority/delete', async (req, res) => {
   const id = req.body.id

   if (id != undefined) {
      if (!isNaN(id)) {
         try {
            await database.where({id: id}).delete().table('priorities')
            res.redirect('/')
         } catch (error) {
            res.redirect('/')
         }
      } else {
         res.redirect('/')
      }
   } else {
      res.redirect('/')
   }
})

module.exports = router