import express from 'express'
import socketIO from 'socket.io'
import { createServer } from 'http'

import ChatStore from './chatstore.js'
import { scrambler } from './scrambler.js'
import path from 'path'


// initialize server
const app = express()
const http = createServer(app)
const io = socketIO(http)

const dbFile = './.data/sqlite.db'
const chatStore = new ChatStore(dbFile)
const port = 8080
const __dirname = path.resolve();
// otherwise __dirname is not defined error

let usersOnline = []

// set up to use handlebars view engine
app.set('view engine', 'hbs')

// serve static files
app.use(express.static('public'))

// index/landing page
app.get('/', (request, response) => {
  chatStore.getMessages('now', (err, messages) => {
    const username = scrambler('abc')
    messages.reverse()
    response.render(__dirname + '/views/index.hbs', 
                    { messages, username })
  })
})

// socket.io stuff
io.on('connection', socket => {
  console.log('a user connected')
  let thisHandle
  
  socket.on('handle-online', handle => {
    console.log(`${handle} logged on`)
    thisHandle = handle
    usersOnline.push(handle)
    io.emit('online', usersOnline)
  })

  socket.on('message', ({username, datetime, rawMessage}) => {
    // scramble message
    // const message = scrambler(rawMessage)
    const message = rawMessage
    const data = {
      username,
      datetime,
      message
    }
    chatStore.saveMessage(data)
    io.emit('message', data)
  })
  
  socket.on('handle-offline', handle => {
    usersOnline = usersOnline.filter(h => h !== handle)
    io.emit('online', usersOnline)
  })
  
  socket.on('disconnect', () => {
    console.log('bye bye user...')
  })
})

// listen!
http.listen(port, () => {
  console.log(`Listening on port ${port}`)
})