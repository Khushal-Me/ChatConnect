// DOM Elements
const chatForm = document.getElementById('chat-form'); // Form for sending messages
const chatMessages = document.querySelector('.chat-messages'); // Container for chat messages
const roomName = document.getElementById('room-name'); // Element to display room name
const userList = document.getElementById('users'); // Element to display list of users

// Parse URL parameters
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true, // Ignore the query prefix in the URL
});

// Initialize socket connection
const socket = io(); // Establish connection with the server

// Event Listeners
document.addEventListener('DOMContentLoaded', onLoad); // Run onLoad when DOM content is loaded
chatForm.addEventListener('submit', onChatSubmit); // Run onChatSubmit when form is submitted

// Socket event handlers
socket.on('message', onMessage); // Handle incoming messages
socket.on('roomUsers', onRoomUsers); // Handle room users update

/**
 * Function to run when the DOM content is loaded
 */
function onLoad() {
  joinChatRoom(); // Join the chat room on load
}

/**
 * Join the chat room
 */
function joinChatRoom() {
  try {
    if (!username || !room) {
      // More descriptive error handling
      throw new Error('Please provide both a username and a room name');
    }
    
    // Additional input validation
    if (username.length < 2 || username.length > 20) {
      throw new Error('Username must be between 2 and 24 characters');
    }
    
    socket.emit('joinRoom', { username, room });
  } catch (error) {
    alert(error.message);
    window.location.href = '/';
  }
}

/**
 * Handle incoming messages
 * @param {Object} message - The message object
 */
function onMessage(message) {
  // Prevent duplicate messages
  if (isDuplicateMessage(message)) return;
  
  outputMessage(message);
  scrollChatToBottom();
  
  // Optional: Play a sound for new messages
  playMessageNotificationSound();
}

// Duplicate message prevention
const recentMessages = new Set();
function isDuplicateMessage(message) {
  const messageKey = `${message.username}-${message.text}-${message.time}`;
  
  if (recentMessages.has(messageKey)) {
    return true;
  }
  
  recentMessages.add(messageKey);
  
  // Clear old messages to prevent memory buildup
  if (recentMessages.size > 100) {
    recentMessages.delete(Array.from(recentMessages)[0]);
  }
  
  return false;
}

// notification sound
function playMessageNotificationSound() {
  // Check if browser supports audio
  if ('Audio' in window) {
    const audio = new Audio('sound/notification-sound.mp3');
    
    // Set volume (optional, between 0 and 1)
    audio.volume = 0.5;
    
    // Play the sound and handle potential errors
    audio.play().catch(error => {
      console.warn('Could not play notification sound:', error);
    });
  }
}

/**
 * Handle room users update
 * @param {Object} data - Contains room and users information
 */
function onRoomUsers({ room, users }) {
  outputRoomName(room); // Update room name in DOM
  outputUsers(users); // Update users list in DOM
}

/**
 * Handle chat form submission
 * @param {Event} e - The submit event
 */
function onChatSubmit(e) {
  e.preventDefault(); // Prevent form from submitting normally
  const msgElement = e.target.elements.msg; // Get the message input element
  const msg = msgElement.value.trim(); // Get the message and trim whitespace
  
  if (!msg) return; // If message is empty, do nothing

  sendMessage(msg); // Send the message to the server
  clearInput(msgElement); // Clear the input field
}

/**
 * Send message to server
 * @param {string} msg - The message to send
 */
function sendMessage(msg) {
  // Prevent spam and very long messages
  const MAX_MESSAGE_LENGTH = 500;
  const MIN_SEND_INTERVAL = 1000; // 1 second between messages

  if (msg.length > MAX_MESSAGE_LENGTH) {
    alert(`Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters.`);
    return;
  }

  // Simple throttling (you'd want a more sophisticated implementation)
  if (window.lastMessageTime && Date.now() - window.lastMessageTime < MIN_SEND_INTERVAL) {
    alert('Please wait before sending another message');
    return;
  }

  socket.emit('chatMessage', msg);
  window.lastMessageTime = Date.now();
}

/**
 * Clear input field and set focus
 * @param {HTMLElement} element - The input element to clear
 */
function clearInput(element) {
  element.value = ''; // Clear the input value
  element.focus(); // Set focus back to the input
}

/**
 * Output message to DOM
 * @param {Object} message - The message object
 */
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.setAttribute('role', 'article'); // Improve screen reader experience
  div.setAttribute('aria-label', `Message from ${message.username}`);
  
  div.innerHTML = `
    <p class="meta" aria-label="Message metadata">
      <span class="username">${escapeHTML(message.username)}</span> 
      <time datetime="${new Date().toISOString()}">${message.time}</time>
    </p>
    <p class="text">${escapeHTML(message.text)}</p>
  `;
  
  chatMessages.appendChild(div);
}

/**
 * Escape HTML to prevent XSS
 * @param {string} unsafe - The unsafe string
 * @returns {string} - The escaped string
 */
function escapeHTML(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;"); // Replace special characters with HTML entities
}

/**
 * Scroll chat window to bottom
 */
function scrollChatToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom of chat container
}

/**
 * Update room name in DOM
 * @param {string} room - The room name
 */
function outputRoomName(room) {
  roomName.textContent = room; // Set room name text content
}

/**
 * Update users list in DOM
 * @param {Array} users - Array of user objects
 */
function outputUsers(users) {
  // Use document fragment for better performance
  const fragment = document.createDocumentFragment();
  
  users.forEach(user => {
    const li = document.createElement('li');
    li.textContent = escapeHTML(user.username);
    li.setAttribute('data-username', user.username);
    fragment.appendChild(li);
  });
  
  // Single DOM update
  userList.innerHTML = '';
  userList.appendChild(fragment);
}

// Add connection error handling
socket.on('connect_error', (error) => {
  console.error('Connection failed:', error);
  alert('Unable to connect to the chat server. Please try again later.');
});

socket.on('disconnect', (reason) => {
  if (reason === 'io server disconnect') {
    // Reconnect manually
    socket.connect();
  }
  
  alert('You have been disconnected from the chat.');
});