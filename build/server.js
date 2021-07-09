"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var httpServer = http_1.createServer();
var io = new socket_io_1.Server(httpServer, { cors: { origin: "*" } });
var lastState = {
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
};
io.on("connection", function (socket) {
    console.log("  +  New connection");
    logCount();
    socket.emit('state', lastState);
    socket.on('state', function (state) {
        console.log("Received from client : " + state);
        lastState = state;
        socket.broadcast.emit('state', state);
    });
    socket.on('disconnect', function () {
        console.log('  -  Disconnected');
        logCount();
    });
});
console.log('Server started');
function logCount() {
    console.log("     Sockets connected : " + io.sockets.sockets.size);
}
httpServer.listen(2222);
