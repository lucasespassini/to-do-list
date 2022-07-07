const express = require('express')
const app = express()
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('express-flash')
const database = require('./database/connection')
const checkLogin = require('./middlewares/checkLogin')

const os = require('os')
const cluster = require('cluster')

const userController = require('./controller/UserController')
const priorityController = require('./controller/PriorityController')
const toDoController = require('./controller/ToDoController')
const noteController = require('./controller/NoteController')

const processId = process.pid

app.set('view engine', 'ejs')

app.use(cookieParser('-2-8hf9-28hf'))
app.use(flash())
app.use(session({
   secret: 'ie2109if',
   resave: false,
   saveUninitialized: true,
   cookie: {
      maxAge: (60000 * 60) * 24 // 1000 miliSegundos = 1 segundo
   }
}))
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/', userController)
app.use('/', priorityController)
app.use('/', toDoController)
app.use('/', noteController)

app.get('/', checkLogin, async (req, res) => {
   try {
      const sessionId = req.session.user.id

      const results = await Promise.all([
         database.select().from('priorities').where({ userId: sessionId }),
         database.select().from('to_dos').where({ userId: sessionId }),
         database.select().from('notes').where({ userId: sessionId }),
         database.select().from('users').where({ id: sessionId })
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

const numCpus = os.cpus().length

if (cluster.isPrimary) {
   for (let i = 0; i < numCpus*2; i++) {
      cluster.fork()
   }
   cluster.on('exit', (worker, code, signal) => {
      cluster.fork()
   })
} else {
   app.listen(8080, () => console.log('Server started in process', processId))
}
