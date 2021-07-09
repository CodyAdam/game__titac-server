import { createServer } from "http";
import { ServerOptions } from 'https';
import { Server, Socket } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, { cors: { origin: "*" } });

function logCount() {
  console.log(`Sockets connected : ${io.sockets.sockets.size}`);

}

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



httpServer.listen(8080);