// Import required modules
const express = require('express'); // Express framework
const http = require('http'); // HTTP server
const socketIo = require('socket.io'); // Socket.io for real-time communication
const path = require('path'); // Path module for working with file and directory paths
const formatMessage = require('./utils/messages'); // Custom module for formatting messages
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('./utils/users'); // Custom user utility functions

// Initialize Express app and create HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Initialize Socket.io with the server

// Set constants
const BOT_NAME = 'ChatConnect Bot'; // Name of the bot
const PORT = process.env.PORT || 3000; // Server port, default to 3000 if not specified

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle socket.io connections
io.on('connection', (socket) => {
  // When a client joins a room
  socket.on('joinRoom', handleJoinRoom(socket));

  // When a client sends a chat message
  socket.on('chatMessage', handleChatMessage(socket));

  // When a client disconnects
  socket.on('disconnect', handleDisconnect(socket));
});

// Function to handle user joining a room
function handleJoinRoom(socket) {
  return ({ username, room }) => {
    const user = userJoin(socket.id, username, room); // Add user to the list
    socket.join(user.room); // Join the user to the specified room

    // Welcome message to the current user
    socket.emit('message', formatMessage(BOT_NAME, 'Welcome to ChatConnect!'));

    // Broadcast to other users in the room that a new user has joined
    socket.broadcast
      .to(user.room)
      .emit('message', formatMessage(BOT_NAME, `${user.username} has joined the chat!`));

    // Send updated users and room information to the room
    updateRoomUsers(user.room);
  };
}

// Function to handle incoming chat messages
function handleChatMessage(socket) {
  return (msg) => {
    const user = getCurrentUser(socket.id); // Get the user who sent the message
    if (user) {
      // Emit the message to all users in the room
      io.to(user.room).emit('message', formatMessage(user.username, msg));
    }
  };
}

// Function to handle user disconnection
function handleDisconnect(socket) {
  return () => {
    const user = userLeave(socket.id); // Remove user from the list
    if (user) {
      // Inform the room that the user has left
      io.to(user.room).emit(
        'message',
        formatMessage(BOT_NAME, `${user.username} has left the chat!`)
      );
      // Update the room users list
      updateRoomUsers(user.room);
    }
  };
}

// Function to update users list in a room
function updateRoomUsers(room) {
  io.to(room).emit('roomUsers', {
    room: room, // Room name
    users: getRoomUsers(room), // List of users in the room
  });
}

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 ChatConnect server is running on PORT: ${PORT}`);
});
