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
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Set constants
const BOT_NAME = 'ChatConnect Bot'; // Name of the bot
const PORT = process.env.PORT || 3000; // Server port, default to 3000 if not specified

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Enhanced logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Handle socket.io connections
io.on('connection', (socket) => {
  console.log(`🔗 New connection: ${socket.id}`);
  
  // When a client joins a room
  socket.on('joinRoom', handleJoinRoom(socket));

  // When a client sends a chat message
  socket.on('chatMessage', handleChatMessage(socket));

  // When a client is typing
  socket.on('typing', handleTyping(socket));

  // When a client disconnects
  socket.on('disconnect', handleDisconnect(socket));
  
  // Handle errors
  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
});

// Function to handle user joining a room
function handleJoinRoom(socket) {
  return ({ username, room }) => {
    try {
      // Validate input
      if (!username || !room || username.trim() === '' || room.trim() === '') {
        socket.emit('error', { message: 'Username and room are required' });
        return;
      }

      // Additional validation
      if (username.length < 2 || username.length > 20) {
        socket.emit('error', { message: 'Username must be between 2 and 20 characters' });
        return;
      }

      const user = userJoin(socket.id, username.trim(), room.trim());
      socket.join(user.room);

      console.log(`👤 ${user.username} joined room: ${user.room}`);

      // Welcome message to the current user
      socket.emit('message', formatMessage(BOT_NAME, 'Welcome to ChatConnect Pro! 🚀'));
      
      // Enhanced welcome message with room info
      socket.emit('message', formatMessage(BOT_NAME, `You've joined "${user.room}". Start chatting and have fun! 💬`));

      // Broadcast to other users in the room that a new user has joined
      socket.broadcast
        .to(user.room)
        .emit('message', formatMessage(BOT_NAME, `${user.username} has joined the chat! 👋`));

      // Emit user joined event for notifications
      socket.broadcast
        .to(user.room)
        .emit('userJoined', { username: user.username, room: user.room });

      // Send updated users and room information to the room
      updateRoomUsers(user.room);
      
    } catch (error) {
      console.error('Error in joinRoom:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  };
}

// Function to handle incoming chat messages
function handleChatMessage(socket) {
  return (msg) => {
    try {
      const user = getCurrentUser(socket.id);
      
      if (!user) {
        socket.emit('error', { message: 'User not found' });
        return;
      }

      // Validate message
      if (!msg || msg.trim() === '') {
        return;
      }

      if (msg.length > 500) {
        socket.emit('error', { message: 'Message too long (max 500 characters)' });
        return;
      }

      const trimmedMsg = msg.trim();
      console.log(`💬 ${user.username} in ${user.room}: ${trimmedMsg}`);

      // Process message for special commands
      if (trimmedMsg.startsWith('/')) {
        handleCommand(socket, user, trimmedMsg);
        return;
      }

      // Emit the message to all users in the room
      io.to(user.room).emit('message', formatMessage(user.username, trimmedMsg));
      
    } catch (error) {
      console.error('Error in chatMessage:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  };
}

// Function to handle typing indicators
function handleTyping(socket) {
  return ({ username, room, typing }) => {
    try {
      const user = getCurrentUser(socket.id);
      if (!user) return;

      // Broadcast typing status to other users in the room
      socket.broadcast
        .to(user.room)
        .emit('typing', { 
          username: user.username, 
          typing: typing 
        });
        
    } catch (error) {
      console.error('Error in typing handler:', error);
    }
  };
}

// Function to handle special commands
function handleCommand(socket, user, command) {
  const [cmd, ...args] = command.slice(1).split(' ');
  
  switch (cmd.toLowerCase()) {
    case 'help':
      socket.emit('message', formatMessage(BOT_NAME, 
        'Available commands:\n' +
        '/help - Show this help message\n' +
        '/users - List all users in the room\n' +
        '/time - Show current time\n' +
        '/clear - Clear your chat (client-side)'
      ));
      break;
      
    case 'users':
      const users = getRoomUsers(user.room);
      const userList = users.map(u => u.username).join(', ');
      socket.emit('message', formatMessage(BOT_NAME, 
        `Users in ${user.room}: ${userList} (${users.length} total)`
      ));
      break;
      
    case 'time':
      const now = new Date().toLocaleString();
      socket.emit('message', formatMessage(BOT_NAME, `Current time: ${now}`));
      break;
      
    default:
      socket.emit('message', formatMessage(BOT_NAME, 
        `Unknown command: /${cmd}. Type /help for available commands.`
      ));
  }
}

// Function to handle user disconnection
function handleDisconnect(socket) {
  return () => {
    try {
      const user = userLeave(socket.id);
      
      if (user) {
        console.log(`👋 ${user.username} left room: ${user.room}`);
        
        // Inform the room that the user has left
        io.to(user.room).emit(
          'message',
          formatMessage(BOT_NAME, `${user.username} has left the chat! 👋`)
        );
        
        // Emit user left event for notifications
        io.to(user.room).emit('userLeft', { 
          username: user.username, 
          room: user.room 
        });
        
        // Update the room users list
        updateRoomUsers(user.room);
      }
      
      console.log(`🔌 Connection closed: ${socket.id}`);
      
    } catch (error) {
      console.error('Error in disconnect handler:', error);
    }
  };
}

// Function to update users list in a room
function updateRoomUsers(room) {
  try {
    const users = getRoomUsers(room);
    io.to(room).emit('roomUsers', {
      room: room,
      users: users,
    });
  } catch (error) {
    console.error('Error updating room users:', error);
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Express error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API endpoint to get room statistics
app.get('/api/rooms', (req, res) => {
  try {
    const { getAllRooms } = require('./utils/users');
    const rooms = getAllRooms ? getAllRooms() : {};
    res.json(rooms);
  } catch (error) {
    console.error('Error getting rooms:', error);
    res.status(500).json({ error: 'Failed to get room data' });
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('💤 Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('💤 Process terminated');
    process.exit(0);
  });
});

// Start the server with enhanced logging
server.listen(PORT, () => {
  console.log('');
  console.log('🚀 ===============================');
  console.log('🚀   ChatConnect Pro Server');
  console.log('🚀 ===============================');
  console.log(`🚀 Server running on PORT: ${PORT}`);
  console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🚀 Time: ${new Date().toISOString()}`);
  console.log('🚀 ===============================');
  console.log('');
});
