import { createServer } from "http";
import { Server, Socket } from "socket.io";
import fs from 'fs'
import path from 'path'

export type Direction = 'tr' | 'mr' | 'br' | 'lc' | 'mc' | 'rc' | 'brtl' | 'bltr';

export interface BoardState {
  received: boolean,
  score: { p1: Array<Direction>, p2: Array<Direction> }
  turn: 1 | 2
  winner: false | 1 | 2
  grid: Array<Tile>
}

export interface Tile {
  slotsIndex: number,
  value: Array<Item>
}

export interface Item { used: boolean, player: 1 | 2 }

const httpServer = createServer();
const io = new Server(httpServer, { cors: { origin: "*" } });

let lastState: BoardState = {
  received: true,
  score: { p1: [], p2: [] },
  turn: Math.random() < 0.5 ? 1 : 2,
  winner: false,
  grid: [
    { slotsIndex: 0, value: [] },
    { slotsIndex: 0, value: [] },
    { slotsIndex: 0, value: [] },
    { slotsIndex: 0, value: [] },
    { slotsIndex: 0, value: [] },
    { slotsIndex: 0, value: [] },
    { slotsIndex: 0, value: [] },
    { slotsIndex: 0, value: [] },
    { slotsIndex: 0, value: [] },
  ]
}

io.on("connection", (socket: Socket) => {
  console.log("  +  New connection");
  logCount()

  socket.emit('state', lastState);

  socket.on('state', (state: BoardState) => {
    console.log(`Received from client : ${state}`);
    lastState = state;
    socket.broadcast.emit('state', state);
  })

  socket.on('disconnect', () => {
    console.log('  -  Disconnected');
    logCount()
  })
});

console.log('Server started');
function logCount() {
  console.log(`     Sockets connected : ${io.sockets.sockets.size}`);
}


httpServer.listen(2222);