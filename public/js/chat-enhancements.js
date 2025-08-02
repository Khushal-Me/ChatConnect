// ========================================
// CHAT ENHANCEMENTS - SIMPLIFIED
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initChatEnhancements();
});

let messageCount = 0;
let userCount = 0;

// Initialize Chat Enhancements
function initChatEnhancements() {
    initScrollToBottom();
    initInputEnhancements();
    initSidebarActions();
}

// Scroll to Bottom Functionality
function initScrollToBottom() {
    const chatMessages = document.getElementById('chat-messages');
    let scrollBtn = document.getElementById('scroll-to-bottom');
    
    if (!chatMessages) return;
    
    // Create scroll to bottom button if it doesn't exist
    if (!scrollBtn) {
        scrollBtn = document.createElement('div');
        scrollBtn.className = 'scroll-to-bottom';
        scrollBtn.id = 'scroll-to-bottom';
        scrollBtn.innerHTML = '<i class="fas fa-arrow-down"></i>';
        scrollBtn.style.display = 'none';
        
        const messagesContainer = document.querySelector('.chat-messages-container');
        if (messagesContainer) {
            messagesContainer.appendChild(scrollBtn);
        }
    }
    
    scrollBtn.addEventListener('click', function() {
        scrollChatToBottom();
    });
    
    chatMessages.addEventListener('scroll', function() {
        const isScrolledUp = chatMessages.scrollTop < chatMessages.scrollHeight - chatMessages.clientHeight - 100;
        scrollBtn.style.display = isScrolledUp ? 'block' : 'none';
    });
}

// Input Enhancements
function initInputEnhancements() {
    const input = document.getElementById('msg');
    const charCount = document.getElementById('char-count');
    
    if (!input) return;
    
    // Character counter
    input.addEventListener('input', function() {
        const length = input.value.length;
        const maxLength = 500;
        
        if (charCount) {
            charCount.textContent = `${length}/${maxLength}`;
            
            if (length > maxLength * 0.9) {
                charCount.style.color = 'var(--error)';
            } else if (length > maxLength * 0.7) {
                charCount.style.color = 'var(--warning)';
            } else {
                charCount.style.color = 'var(--text-muted)';
            }
        }
        
        // Prevent exceeding max length
        if (length > maxLength) {
            input.value = input.value.substring(0, maxLength);
        }
    });
    
    // Auto-resize textarea
    input.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
    
    // Enter to send (Shift+Enter for new line)
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const form = document.getElementById('chat-form');
            if (form) {
                form.dispatchEvent(new Event('submit'));
            }
        }
    });
}

// Sidebar Actions
function initSidebarActions() {
    const clearChatBtn = document.getElementById('clear-chat');
    
    if (clearChatBtn) {
        clearChatBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all messages?')) {
                clearAllMessages();
            }
        });
    }
}

function clearAllMessages() {
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
        chatMessages.innerHTML = '';
        showNotification('Chat Cleared', 'All messages have been cleared', 'success');
    }
}

// Enhanced Message Display
function createEnhancedMessage(message, isOwnMessage = false) {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${isOwnMessage ? 'own-message' : ''}`;
    
    const time = new Date(message.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    messageEl.innerHTML = `
        <div class="message-avatar">
            ${message.username.charAt(0).toUpperCase()}
        </div>
        <div class="message-content">
            <div class="message-header">
                <span class="message-author">${escapeHTML(message.username)}</span>
                <span class="message-time">${time}</span>
            </div>
            <div class="message-text">${escapeHTML(message.text)}</div>
        </div>
    `;
    
    return messageEl;
}

// Enhanced User Display
function createEnhancedUserItem(user) {
    const userEl = document.createElement('li');
    userEl.className = 'user-item';
    
    userEl.innerHTML = `
        <div class="user-avatar">
            ${user.username.charAt(0).toUpperCase()}
        </div>
        <div class="user-info">
            <div class="user-name">${escapeHTML(user.username)}</div>
            <div class="user-status">Online</div>
        </div>
    `;
    
    return userEl;
}

// Utility Functions
function updateMessageCount(count) {
    if (typeof count === 'number') {
        messageCount = count;
    } else {
        messageCount++;
    }
    
    const messageCountEl = document.getElementById('message-count');
    if (messageCountEl) {
        messageCountEl.textContent = messageCount;
    }
}

function updateUserCount(count) {
    if (typeof count === 'number') {
        userCount = count;
    }
    
    const userCountEl = document.getElementById('user-count');
    const onlineCountEl = document.getElementById('online-count');
    
    if (userCountEl) {
        userCountEl.textContent = userCount;
    }
    
    if (onlineCountEl) {
        onlineCountEl.textContent = `${userCount} online`;
    }
}

function escapeHTML(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Enhanced scroll to bottom
function scrollChatToBottom(smooth = true) {
    const chatMessages = document.querySelector('.chat-messages') || document.getElementById('chat-messages');
    if (chatMessages) {
        if (smooth) {
            chatMessages.scrollTo({
                top: chatMessages.scrollHeight,
                behavior: 'smooth'
            });
        } else {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
}

// Simple notification system
function showNotification(title, message, type = 'info', duration = 4000) {
    console.log(`${type.toUpperCase()}: ${title} - ${message}`);
    
    // Create a simple visual notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-card);
        color: var(--text-primary);
        padding: 12px 16px;
        border-radius: 8px;
        border: 1px solid var(--border-primary);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        font-size: 14px;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    
    notification.innerHTML = `<strong>${title}</strong><br>${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// Add simple animation styles
if (!document.getElementById('simple-animations')) {
    const style = document.createElement('style');
    style.id = 'simple-animations';
    style.textContent = `
        @keyframes slideIn {
            from { opacity: 0; transform: translateX(100%); }
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOut {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(100%); }
        }
    `;
    document.head.appendChild(style);
}

// Export enhanced functions for use in main script
window.chatEnhancements = {
    createEnhancedMessage,
    createEnhancedUserItem,
    updateMessageCount,
    updateUserCount,
    scrollChatToBottom,
    showNotification
};
