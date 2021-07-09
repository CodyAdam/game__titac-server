import { createServer } from "https";
import { Server, Socket } from "socket.io";
import fs from 'fs'
import path from 'path'

const httpServer = createServer({
  key: fs.readFileSync(path.resolve(__dirname, '../tmp/key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '../tmp/certificate.pem'))
});
const io = new Server(httpServer, { cors: { origin: "*" } });


io.on("connection", (socket: Socket) => {
  console.log("  +  New connection");
  logCount()

  socket.on('state', (state) => {
    console.log(`Received from client : ${state}`);
    socket.broadcast.emit('state', state);
  })

  socket.on('ping', (msg) => socket.broadcast.emit('ping', msg))

  socket.on('disconnect', () => {
    console.log('  -  One disconnected');
    logCount()
  })
});

console.log('Server started');
function logCount() {
  console.log(`Sockets connected : ${io.sockets.sockets.size}`);
}


httpServer.listen(2222);