const { createServer } = require('http')
const next = require('next')
const { Server } = require('socket.io')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer((req, res) => handle(req, res))

  const io = new Server(httpServer)

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id)

    socket.on('chat message', ({ to, from, message,date}) => {
   
      io.emit( to, { to, from, message,date}) // You can filter by room/user
    })
    
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
    })
  })

  httpServer.listen(3000, () => {
    console.log('Server running at http://localhost:3000')
  })
})