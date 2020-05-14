const express = require('express')
const app = express()
const http = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(http)

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

let playersArray = []

io.on('connection', (socket) => {
  socket.on('player', (newPlayer) => {
    newPlayer.id = playersArray.length
    playersArray.push(newPlayer)
    io.emit('player', newPlayer)
    io.emit('global', playersArray)
    console.log(playersArray)
  })
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg)
  })
  socket.on('name', (msg) => {
    io.emit('name', msg)
  })
  socket.on('add_character', (newChar, index) => {
    playersArray[index].character = newChar
    io.emit('global', playersArray)
  })
  socket.on('delete_player', (id) => {
    playersArray.splice(id, 1)
    io.emit('global', playersArray)
    console.log(playersArray)
  })
})

http.listen(3000, () => {
  console.log('listening on *:3000')
})