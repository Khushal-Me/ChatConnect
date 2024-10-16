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
  if (!username || !room) {
    alert('Username and room are required!'); // Alert if username or room is missing
    window.location.href = '/'; // Redirect to home page
    return;
  }
  socket.emit('joinRoom', { username, room }); // Emit joinRoom event to server
}

/**
 * Handle incoming messages
 * @param {Object} message - The message object
 */
function onMessage(message) {
  outputMessage(message); // Display the message in the chat
  scrollChatToBottom(); // Scroll chat to bottom
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
  socket.emit('chatMessage', msg); // Emit chatMessage event to server
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
  const div = document.createElement('div'); // Create a div element
  div.classList.add('message'); // Add message class
  div.innerHTML = `
    <p class="meta">${escapeHTML(message.username)} <span>${message.time}</span></p>
    <p class="text">${escapeHTML(message.text)}</p>
  `; // Set inner HTML with message data
  chatMessages.appendChild(div); // Append message to chat container
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
  userList.innerHTML = users
    .map(user => `<li>${escapeHTML(user.username)}</li>`)
    .join(''); // Create list items for each user and join them into a single string
}
