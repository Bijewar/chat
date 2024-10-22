// app.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');

// Store connected users
const connectedUsers = new Map();

app.get('/', (req, res) => {
    res.render('index');
});

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle setting username
    socket.on('setUsername', (username) => {
        console.log('Username set:', username);
        connectedUsers.set(socket.id, username);
        
        // Emit updated users list to all clients
        io.emit('onlineUsers', Array.from(connectedUsers.values()));
        io.emit('onlineCount', connectedUsers.size);
    });

    // Handle messages
    socket.on('msg', (data) => {
        io.emit('msg', data);
    });

    // Handle disconnections
    socket.on('disconnect', () => {
        console.log('User disconnected');
        connectedUsers.delete(socket.id);
        
        // Emit updated users list to all clients
        io.emit('onlineUsers', Array.from(connectedUsers.values()));
        io.emit('onlineCount', connectedUsers.size);
    });
});

module.exports = { app, server };  // Export app and server
