const express = require('express')
const router = express.Router()
const database = require('../database/connection').default

router.post('/to-do/create', async (req, res) => {
   try {
      const id = req.session.user.id
      const conteudo = req.body.conteudo

      await database.insert({
         conteudo: conteudo,
         userId: id
      }).into('to_dos')

      res.redirect('/')
   } catch (error) {
      res.redirect('/')
   }
})

router.post('/to-do/delete', async (req, res) => {
   const id = req.body.id

   if (id != undefined) {
      if (!isNaN(id)) {
         try {
            await database.where({ id: id }).delete().table('to_dos')
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