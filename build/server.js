"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var httpServer = http_1.createServer();
var io = new socket_io_1.Server(httpServer, { cors: { origin: "*" } });
function logCount() {
    console.log("Sockets connected : " + io.sockets.sockets.size);
}
io.on("connection", function (socket) {
    console.log("  +  New connection");
    logCount();
    socket.on('state', function (state) {
        console.log("Received from client : " + state);
        socket.broadcast.emit('state', state);
    });
    socket.on('ping', function (msg) { return socket.broadcast.emit('ping', msg); });
    socket.on('disconnect', function () {
        console.log('  -  One disconnected');
        logCount();
    });
});
httpServer.listen(2222);
