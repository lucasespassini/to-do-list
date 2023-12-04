import cookieParser from 'cookie-parser'
import 'dotenv/config'
import express from 'express'
import flash from 'express-flash'
import session from 'express-session'
import noteController from '../controller/NoteController'
import priorityController from '../controller/PriorityController'
import toDoController from '../controller/ToDoController'
import userController from '../controller/UserController'
import { select } from '../database/connection'
import { verifyAuth } from './middlewares/verifyAuth'
const app = express()

app.set('view engine', 'ejs')

app.use(session({
  secret: 'ie2109if',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}))
app.use(cookieParser('-2-8hf9-28hf'))
app.use(flash())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/', userController)
app.use('/', priorityController)
app.use('/', toDoController)
app.use('/', noteController)

app.get('/', verifyAuth, async (req, res) => {
  try {
    const sessionId = req.session.user.id

    const results = await Promise.all([
      select().from('priorities').where({ userId: sessionId }),
      select().from('to_dos').where({ userId: sessionId }),
      select().from('notes').where({ userId: sessionId }),
      select().from('users').where({ id: sessionId })
    ])

    res.render('index', {
      priorities: results[0],
      to_dos: results[1],
      notes: results[2],
      user: results[3][0]
    })

  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})
