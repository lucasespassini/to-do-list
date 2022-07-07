const express = require('express')
const router = express.Router()
const database = require('../database/connection')

router.post('/note/create', async (req, res) => {
   try {
      const id = req.session.user.id
      const conteudo = req.body.conteudo

      await database.insert({
         conteudo: conteudo,
         userId: id
      }).into('notes')

      res.redirect('/')
   } catch (error) {
      res.redirect('/')
   }
})

router.post('/note/delete', async (req, res) => {
   const id = req.body.id

   if (id != undefined) {
      if (!isNaN(id)) {
         try {
            await database.where({ id: id }).delete().table('notes')
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