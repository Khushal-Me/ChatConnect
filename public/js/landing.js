// ========================================
// EPIC LANDING PAGE INTERACTIONS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initParticles();
    initFormInteractions();
    initAnimations();
    initTypingEffect();
});

// Initialize Particles.js Background
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: ['#00d4ff', '#7c3aed', '#8a2be2']
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    }
                },
                opacity: {
                    value: 0.3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#00d4ff',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'repulse'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 400,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
    }
}

// Form Interactions
function initFormInteractions() {
    const form = document.querySelector('.join-form');
    const usernameInput = document.getElementById('username');
    const roomSelect = document.getElementById('room');
    const quickBtns = document.querySelectorAll('.quick-btn');

    // Enhanced form validation
    if (usernameInput) {
        usernameInput.addEventListener('input', function() {
            validateUsername(this.value);
        });

        usernameInput.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        usernameInput.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    }

    // Room selection with animation
    if (roomSelect) {
        roomSelect.addEventListener('change', function() {
            this.parentElement.classList.add('selected');
            setTimeout(() => {
                this.parentElement.classList.remove('selected');
            }, 300);
        });
    }

    // Quick join buttons
    quickBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const room = this.dataset.room;
            if (roomSelect) {
                roomSelect.value = room;
                
                // Add visual feedback
                this.classList.add('selected');
                setTimeout(() => {
                    this.classList.remove('selected');
                }, 300);
                
                // Animate room select
                roomSelect.parentElement.classList.add('quick-selected');
                setTimeout(() => {
                    roomSelect.parentElement.classList.remove('quick-selected');
                }, 500);
            }
        });
    });

    // Form submission with validation and animation
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = usernameInput?.value.trim();
            const room = roomSelect?.value;
            
            if (validateForm(username, room)) {
                // Add loading animation
                const submitBtn = this.querySelector('.join-btn');
                submitBtn.classList.add('loading');
                submitBtn.innerHTML = `
                    <i class="fas fa-spinner fa-spin"></i>
                    <span>Launching...</span>
                `;
                
                // Simulate loading and redirect
                setTimeout(() => {
                    window.location.href = `chat.html?username=${encodeURIComponent(username)}&room=${encodeURIComponent(room)}`;
                }, 1500);
            }
        });
    }
}

// Username validation
function validateUsername(username) {
    const input = document.getElementById('username');
    const isValid = username.length >= 2 && username.length <= 20 && /^[a-zA-Z0-9_\s]+$/.test(username);
    
    if (input) {
        input.classList.toggle('valid', isValid && username.length > 0);
        input.classList.toggle('invalid', !isValid && username.length > 0);
    }
    
    return isValid;
}

// Form validation
function validateForm(username, room) {
    let isValid = true;
    
    // Username validation
    if (!username || !validateUsername(username)) {
        showError('Please enter a valid username (2-20 characters, letters, numbers, and spaces only)');
        isValid = false;
    }
    
    // Room validation
    if (!room) {
        showError('Please select a room to join');
        isValid = false;
    }
    
    return isValid;
}

// Show error message
function showError(message) {
    // Remove existing error
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>${message}</span>
    `;
    
    // Add error styles
    errorDiv.style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem;
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        border-radius: 0.75rem;
        color: #ef4444;
        font-size: 0.875rem;
        font-weight: 500;
        margin-top: 1rem;
        animation: errorSlideIn 0.3s ease-out;
    `;
    
    // Add error animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes errorSlideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Insert error after form
    const form = document.querySelector('.join-form');
    if (form) {
        form.appendChild(errorDiv);
        
        // Remove error after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Initialize animations
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card').forEach(card => {
        observer.observe(card);
    });

    // Add smooth hover effects
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Navbar scroll effect
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        const currentScrollY = window.scrollY;
        
        if (navbar) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            // Add background on scroll
            if (currentScrollY > 50) {
                navbar.style.background = 'rgba(10, 10, 15, 0.95)';
                navbar.style.backdropFilter = 'blur(20px)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.05)';
                navbar.style.backdropFilter = 'blur(20px)';
            }
        }
        
        lastScrollY = currentScrollY;
    });
}

// Typing effect for preview messages
function initTypingEffect() {
    const previewMessages = document.querySelector('.preview-messages');
    if (!previewMessages) return;

    // Clear existing messages
    previewMessages.innerHTML = '';

    const messages = [
        {
            type: 'bot',
            author: 'ChatConnect Bot',
            text: 'Welcome to the future of chat! 🚀',
            delay: 1000
        },
        {
            type: 'user',
            author: 'You',
            text: 'This looks amazing! ✨',
            delay: 3000
        },
        {
            type: 'bot',
            author: 'ChatConnect Bot',
            text: 'Join thousands of users already chatting!',
            delay: 5000
        }
    ];

    messages.forEach((message, index) => {
        setTimeout(() => {
            addPreviewMessage(message);
        }, message.delay);
    });
}

function addPreviewMessage(message) {
    const previewMessages = document.querySelector('.preview-messages');
    if (!previewMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `preview-message ${message.type === 'user' ? 'user-message' : ''}`;
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-${message.type === 'user' ? 'user' : 'robot'}"></i>
        </div>
        <div class="message-content">
            <div class="message-author">${message.author}</div>
            <div class="message-text">${message.text}</div>
        </div>
    `;

    previewMessages.appendChild(messageDiv);

    // Scroll to bottom of preview
    const previewContent = document.querySelector('.preview-content');
    if (previewContent) {
        previewContent.scrollTop = previewContent.scrollHeight;
    }
}

// Add CSS for new animations
const additionalStyles = `
<style>
.focused .input-border {
    transform: scaleX(1) !important;
}

.selected .form-select {
    border-color: var(--accent-primary) !important;
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.2) !important;
}

.quick-selected {
    animation: quickPulse 0.5s ease-out;
}

@keyframes quickPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

.quick-btn.selected {
    background: var(--accent-primary) !important;
    color: white !important;
    transform: scale(1.1);
}

.form-input.valid {
    border-color: var(--success) !important;
    box-shadow: 0 0 10px rgba(16, 185, 129, 0.2) !important;
}

.form-input.invalid {
    border-color: var(--error) !important;
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.2) !important;
}

.join-btn.loading {
    pointer-events: none;
    opacity: 0.8;
}

.join-btn.loading i {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.feature-card {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.feature-card.animate-in {
    opacity: 1;
    transform: translateY(0);
}

.navbar {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);
