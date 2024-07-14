const users = []; // Array to store users
let user_json = {}; // Object to store user data (currently unused)

// Join user to chat
function userJoin(id, username, room) {
   const user = { id, username, room }; // Create a user object

   users.push(user); // Add the user to the users array

   return user; // Return the user object
}

// Get current user by ID
function getCurrentUser(id) {
   return users.find((user) => user.id === id); // Find and return the user by ID
}

// User leaves chat
function userLeave(id) {
   const index = users.findIndex((user) => user.id === id); // Find the index of the user by ID

   if (index !== -1) {
      return users.splice(index, 1)[0]; // Remove the user from the array and return the removed user
   }
}

// Get users in a specific room
function getRoomUsers(room) {
   return users.filter((user) => user.room === room); // Filter and return users in the specified room
}

module.exports = {
   userJoin, // Export userJoin function
   getCurrentUser, // Export getCurrentUser function
   userLeave, // Export userLeave function
   getRoomUsers, // Export getRoomUsers function
};
