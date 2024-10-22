// Connect to the Socket.IO server
const socket = io();

// Set username on connection
socket.emit('setUsername', 'YourUsername');

// Receive messages from server
socket.on('msg', function(data) {
    console.log('Message from server:', data);
});

// Update online users count
socket.on('onlineCount', function(count) {
    console.log('Online users count:', count);
});

// Update online users list
socket.on('onlineUsers', function(users) {
    console.log('Online users:', users);
});
