// ========================================
// CHATCONNECT PRO - ENHANCED MAIN SCRIPT
// ========================================

// DOM Elements
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages') || document.getElementById('chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Parse URL parameters
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Initialize socket connection
const socket = io();

// Enhanced state management
let messageCount = 0;
let userCount = 0;
let currentUser = null;
let isConnected = false;

// Event Listeners
document.addEventListener('DOMContentLoaded', onLoad);
chatForm?.addEventListener('submit', onChatSubmit);

// Socket event handlers
socket.on('connect', onConnect);
socket.on('disconnect', onDisconnect);
socket.on('message', onMessage);
socket.on('roomUsers', onRoomUsers);
socket.on('typing', onTyping);
socket.on('userJoined', onUserJoined);
socket.on('userLeft', onUserLeft);

/**
 * Function to run when the DOM content is loaded
 */
function onLoad() {
  joinChatRoom();
  initializeEnhancements();
}

/**
 * Initialize chat enhancements
 */
function initializeEnhancements() {
  // Initialize counters display
  updateMessageCountDisplay();
  updateUserCountDisplay();
  
  // Add welcome animation
  setTimeout(() => {
    if (chatMessages) {
      chatMessages.classList.add('animate-in');
    }
  }, 100);
  
  // Initialize typing detection
  const messageInput = document.getElementById('msg');
  if (messageInput) {
    let typingTimer;
    let isTyping = false;
    
    messageInput.addEventListener('input', function() {
      if (!isTyping && currentUser) {
        isTyping = true;
        socket.emit('typing', { 
          username: currentUser.username, 
          room: currentUser.room, 
          typing: true 
        });
      }
      
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        if (isTyping && currentUser) {
          isTyping = false;
          socket.emit('typing', { 
            username: currentUser.username, 
            room: currentUser.room, 
            typing: false 
          });
        }
      }, 1000);
    });
  }
}

/**
 * Handle socket connection
 */
function onConnect() {
  isConnected = true;
  console.log('Connected to ChatConnect Pro server');
  
  if (window.chatEnhancements) {
    window.chatEnhancements.showNotification(
      'Connected!', 
      'Successfully connected to ChatConnect Pro', 
      'success'
    );
  }
}

/**
 * Handle socket disconnection
 */
function onDisconnect(reason) {
  isConnected = false;
  console.log('Disconnected from server:', reason);
  
  if (window.chatEnhancements) {
    window.chatEnhancements.showNotification(
      'Disconnected', 
      'Connection to server lost. Attempting to reconnect...', 
      'warning'
    );
  }
}

/**
 * Join the chat room with enhanced validation
 */
function joinChatRoom() {
  try {
    // Enhanced validation
    if (!username || !room) {
      throw new Error('Username and room are required');
    }
    
    if (username.length < 2 || username.length > 20) {
      throw new Error('Username must be between 2 and 20 characters');
    }
    
    if (!/^[a-zA-Z0-9_\s]+$/.test(username)) {
      throw new Error('Username contains invalid characters');
    }
    
    currentUser = { username, room };
    socket.emit('joinRoom', { username, room });
    
  } catch (error) {
    if (window.chatEnhancements) {
      window.chatEnhancements.showNotification('Error', error.message, 'error');
    } else {
      alert(error.message);
    }
    
    // Redirect to home page after a short delay
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  }
}

/**
 * Handle incoming messages with enhancements
 */
function onMessage(message) {
  // Prevent duplicate messages
  if (isDuplicateMessage(message)) return;
  
  // Create enhanced message element
  const isOwnMessage = currentUser && message.username === currentUser.username;
  let messageElement;
  
  if (window.chatEnhancements) {
    messageElement = window.chatEnhancements.createEnhancedMessage(message, isOwnMessage);
  } else {
    messageElement = createBasicMessage(message);
  }
  
  // Add message to chat
  if (chatMessages) {
    chatMessages.appendChild(messageElement);
    
    // Increment message count and update display
    messageCount++;
    updateMessageCountDisplay();
    
    // Also update through chat enhancements if available
    if (window.chatEnhancements) {
      window.chatEnhancements.updateMessageCount(messageCount);
    }
    
    // Scroll to bottom
    if (window.chatEnhancements) {
      window.chatEnhancements.scrollChatToBottom();
    } else {
      scrollChatToBottom();
    }
    
    // Play notification sound for other users' messages
    if (!isOwnMessage && window.chatEnhancements) {
      window.chatEnhancements.playNotificationSound();
    }
    
    // Show desktop notification for other users' messages
    if (!isOwnMessage && document.hidden) {
      showDesktopNotification(message);
    }
  }
}

/**
 * Handle room users update with enhancements
 */
function onRoomUsers({ room, users }) {
  outputRoomName(room);
  outputUsers(users);
  
  userCount = users.length;
  updateUserCountDisplay();
  
  // Also update through chat enhancements if available
  if (window.chatEnhancements) {
    window.chatEnhancements.updateUserCount(userCount);
  }
}

/**
 * Handle typing indicators
 */
function onTyping({ username: typingUser, typing }) {
  const typingIndicator = document.getElementById('typing-indicator');
  
  if (!typingIndicator || typingUser === currentUser?.username) return;
  
  if (typing) {
    typingIndicator.classList.add('active');
    typingIndicator.querySelector('.typing-text').textContent = `${typingUser} is typing`;
  } else {
    typingIndicator.classList.remove('active');
  }
}

/**
 * Handle user joined notifications
 */
function onUserJoined(data) {
  if (window.chatEnhancements) {
    window.chatEnhancements.showNotification(
      'User Joined', 
      `${data.username} has joined the room`, 
      'info'
    );
  }
}

/**
 * Handle user left notifications
 */
function onUserLeft(data) {
  if (window.chatEnhancements) {
    window.chatEnhancements.showNotification(
      'User Left', 
      `${data.username} has left the room`, 
      'info'
    );
  }
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
    const messagesToRemove = Array.from(recentMessages).slice(0, 50);
    messagesToRemove.forEach(key => recentMessages.delete(key));
  }
  
  return false;
}

/**
 * Handle chat form submission with enhancements
 */
function onChatSubmit(e) {
  e.preventDefault();
  
  const msgElement = e.target.elements.msg;
  const msg = msgElement?.value.trim();
  
  if (!msg) return;
  
  // Enhanced validation
  if (msg.length > 500) {
    if (window.chatEnhancements) {
      window.chatEnhancements.showNotification(
        'Message Too Long', 
        'Please keep messages under 500 characters', 
        'warning'
      );
    }
    return;
  }
  
  if (!isConnected) {
    if (window.chatEnhancements) {
      window.chatEnhancements.showNotification(
        'Not Connected', 
        'Please wait for connection to be established', 
        'error'
      );
    }
    return;
  }
  
  sendMessage(msg);
  clearInput(msgElement);
}

/**
 * Send message to server with rate limiting
 */
function sendMessage(msg) {
  const MAX_MESSAGE_LENGTH = 500;
  const MIN_SEND_INTERVAL = 500; // 0.5 seconds between messages
  
  if (msg.length > MAX_MESSAGE_LENGTH) {
    if (window.chatEnhancements) {
      window.chatEnhancements.showNotification(
        'Message Too Long', 
        `Please keep messages under ${MAX_MESSAGE_LENGTH} characters`, 
        'warning'
      );
    }
    return;
  }
  
  // Simple rate limiting
  const now = Date.now();
  if (window.lastMessageTime && now - window.lastMessageTime < MIN_SEND_INTERVAL) {
    if (window.chatEnhancements) {
      window.chatEnhancements.showNotification(
        'Slow Down', 
        'Please wait a moment before sending another message', 
        'warning'
      );
    }
    return;
  }
  
  socket.emit('chatMessage', msg);
  window.lastMessageTime = now;
}

/**
 * Clear input field and set focus
 */
function clearInput(element) {
  if (element) {
    element.value = '';
    element.style.height = 'auto'; // Reset height for auto-resize
    element.focus();
  }
}

/**
 * Create basic message element (fallback)
 */
function createBasicMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.setAttribute('role', 'article');
  div.setAttribute('aria-label', `Message from ${message.username}`);
  
  const isOwnMessage = currentUser && message.username === currentUser.username;
  if (isOwnMessage) {
    div.classList.add('own-message');
  }
  
  div.innerHTML = `
    <div class="message-avatar">${message.username.charAt(0).toUpperCase()}</div>
    <div class="message-content">
      <div class="message-header">
        <span class="message-author">${escapeHTML(message.username)}</span> 
        <span class="message-time">${message.time}</span>
      </div>
      <div class="message-text">${escapeHTML(message.text)}</div>
    </div>
  `;
  
  return div;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHTML(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Scroll chat window to bottom (fallback)
 */
function scrollChatToBottom() {
  if (chatMessages) {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

/**
 * Update room name in DOM
 */
function outputRoomName(room) {
  if (roomName) {
    roomName.textContent = room;
  }
}

/**
 * Update users list in DOM with enhancements
 */
function outputUsers(users) {
  if (!userList) return;
  
  // Clear current list
  userList.innerHTML = '';
  
  // Use document fragment for better performance
  const fragment = document.createDocumentFragment();
  
  users.forEach(user => {
    let userElement;
    
    if (window.chatEnhancements) {
      userElement = window.chatEnhancements.createEnhancedUserItem(user);
    } else {
      userElement = createBasicUserItem(user);
    }
    
    fragment.appendChild(userElement);
  });
  
  userList.appendChild(fragment);
}

/**
 * Create basic user item (fallback)
 */
function createBasicUserItem(user) {
  const li = document.createElement('li');
  li.classList.add('user-item');
  li.textContent = user.username;
  return li;
}

/**
 * Show desktop notification
 */
function showDesktopNotification(message) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(`${message.username} in ${room}`, {
      body: message.text,
      icon: '/img/Chatappicon.png',
      tag: 'chatconnect-message'
    });
  } else if ('Notification' in window && Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        showDesktopNotification(message);
      }
    });
  }
}

// Enhanced connection error handling
socket.on('connect_error', (error) => {
  console.error('Connection failed:', error);
  
  if (window.chatEnhancements) {
    window.chatEnhancements.showNotification(
      'Connection Error', 
      'Unable to connect to the chat server. Please check your internet connection.', 
      'error'
    );
  } else {
    alert('Unable to connect to the chat server. Please try again later.');
  }
});

socket.on('reconnect', (attemptNumber) => {
  console.log('Reconnected after', attemptNumber, 'attempts');
  
  if (window.chatEnhancements) {
    window.chatEnhancements.showNotification(
      'Reconnected!', 
      'Connection has been restored', 
      'success'
    );
  }
});

socket.on('reconnect_error', (error) => {
  console.error('Reconnection failed:', error);
  
  if (window.chatEnhancements) {
    window.chatEnhancements.showNotification(
      'Reconnection Failed', 
      'Unable to reconnect to the server', 
      'error'
    );
  }
});

// Page visibility API for notifications
document.addEventListener('visibilitychange', function() {
  if (!document.hidden) {
    // Clear desktop notifications when page becomes visible
    if ('Notification' in window) {
      // Close notifications with the same tag
      // Note: This is limited by browser security policies
    }
  }
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
  if (socket && isConnected) {
    socket.emit('disconnect');
  }
});

// Request notification permission on load
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
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
    // The disconnection was initiated by the server, need to reconnect manually
    socket.connect();
  }
});

/**
 * Update message count display
 */
function updateMessageCountDisplay() {
  const messageCountEl = document.getElementById('message-count');
  if (messageCountEl) {
    messageCountEl.textContent = messageCount;
  }
}

/**
 * Update user count display
 */
function updateUserCountDisplay() {
  const userCountEl = document.getElementById('user-count');
  const onlineCountEl = document.getElementById('online-count');
  
  if (userCountEl) {
    userCountEl.textContent = userCount;
  }
  
  if (onlineCountEl) {
    onlineCountEl.textContent = `${userCount} online`;
  }
}