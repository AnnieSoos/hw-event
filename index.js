///
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())

///middlewares
const bodyParser = require('body-parser')
app.use(bodyParser.json())

///importing events
const eventsRouter = require('./events/router')

///connecting API
app.listen(4001, () => console.log('Express API listening on port 4001'))

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
  next()
})



app.use(eventsRouter)
