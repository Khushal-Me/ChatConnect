const users = []; // Array to store users
const rooms = new Map(); // Map to store room statistics

// Join user to chat
function userJoin(id, username, room) {
   const user = { 
      id, 
      username: username.trim(), 
      room: room.trim(),
      joinedAt: new Date(),
      lastActive: new Date()
   };

   users.push(user);
   
   // Update room statistics
   updateRoomStats(room);
   
   console.log(`User joined: ${username} in ${room}`);
   return user;
}

// Get current user by ID
function getCurrentUser(id) {
   const user = users.find((user) => user.id === id);
   
   // Update last active time
   if (user) {
      user.lastActive = new Date();
   }
   
   return user;
}

// User leaves chat
function userLeave(id) {
   const index = users.findIndex((user) => user.id === id);

   if (index !== -1) {
      const user = users.splice(index, 1)[0];
      
      // Update room statistics
      updateRoomStats(user.room);
      
      console.log(`User left: ${user.username} from ${user.room}`);
      return user;
   }
}

// Get users in a specific room
function getRoomUsers(room) {
   return users.filter((user) => user.room === room);
}

// Get all rooms with statistics
function getAllRooms() {
   const roomStats = {};
   
   // Count users per room
   users.forEach(user => {
      if (!roomStats[user.room]) {
         roomStats[user.room] = {
            name: user.room,
            userCount: 0,
            users: [],
            created: rooms.get(user.room)?.created || new Date(),
            lastActivity: new Date()
         };
      }
      
      roomStats[user.room].userCount++;
      roomStats[user.room].users.push({
         username: user.username,
         joinedAt: user.joinedAt,
         lastActive: user.lastActive
      });
      
      // Update last activity
      if (user.lastActive > roomStats[user.room].lastActivity) {
         roomStats[user.room].lastActivity = user.lastActive;
      }
   });
   
   return roomStats;
}

// Update room statistics
function updateRoomStats(roomName) {
   if (!rooms.has(roomName)) {
      rooms.set(roomName, {
         created: new Date(),
         totalMessages: 0,
         peakUsers: 0
      });
   }
   
   const currentUsers = getRoomUsers(roomName).length;
   const roomStats = rooms.get(roomName);
   
   if (currentUsers > roomStats.peakUsers) {
      roomStats.peakUsers = currentUsers;
   }
}

// Increment message count for a room
function incrementMessageCount(roomName) {
   if (rooms.has(roomName)) {
      rooms.get(roomName).totalMessages++;
   }
}

// Get room statistics
function getRoomStats(roomName) {
   return rooms.get(roomName) || null;
}

// Clean up inactive users (for maintenance)
function cleanupInactiveUsers(timeoutMinutes = 60) {
   const timeout = timeoutMinutes * 60 * 1000; // Convert to milliseconds
   const now = new Date();
   
   const inactiveUsers = users.filter(user => 
      now - user.lastActive > timeout
   );
   
   inactiveUsers.forEach(user => {
      userLeave(user.id);
   });
   
   if (inactiveUsers.length > 0) {
      console.log(`Cleaned up ${inactiveUsers.length} inactive users`);
   }
   
   return inactiveUsers.length;
}

// Get total statistics
function getTotalStats() {
   return {
      totalUsers: users.length,
      totalRooms: rooms.size,
      activeRooms: Object.keys(getAllRooms()).length,
      uptime: process.uptime()
   };
}

module.exports = {
   userJoin,
   getCurrentUser,
   userLeave,
   getRoomUsers,
   getAllRooms,
   getRoomStats,
   incrementMessageCount,
   cleanupInactiveUsers,
   getTotalStats
};
