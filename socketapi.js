const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let onlineUsers = {}; // Object to store online users

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle setting username
    socket.on('setUsername', (username) => {
        onlineUsers[socket.id] = username;
        io.emit('onlineUsers', Object.values(onlineUsers)); // Emit updated list of online users
        io.emit('onlineCount', Object.keys(onlineUsers).length); // Emit online user count
    });

    // Handle message
    socket.on('msg', (data) => {
        io.emit('msg', data); // Broadcast message to all clients
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        delete onlineUsers[socket.id]; // Remove user on disconnect
        io.emit('onlineUsers', Object.values(onlineUsers)); // Emit updated list of online users
        io.emit('onlineCount', Object.keys(onlineUsers).length); // Emit online user count
        console.log('A user disconnected');
    });
});

server.listen(3000, () => {
    console.log('Listening on port 3000');
});
