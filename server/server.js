import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

const app = express()
const server = http.createServer(app)
const io = new Server(server)

const users = {}

app.use(express.static('./public/client/'))

app.get('/', (req, res) => {
    res.sendFile('index.html')
})

io.on('connection', socket => {

    socket.on('new-user-joined', user => {
        users[socket.id] = user
        socket.broadcast.emit('user-joined', `${user} just joined the chat`)
    })
    
    socket.on('sent-message', message => {
        // console.log("Here", users);
        socket.broadcast.emit('client-message', { message, username: users[socket.id] })
    })
})


server.listen(8000, () => console.log("server started"))