# ChatConnect Pro

<div align="center">

![ChatConnect Pro](https://img.shields.io/badge/ChatConnect-Pro-blue?style=for-the-badge&logo=chat&logoColor=white)
![Version](https://img.shields.io/badge/version-3.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-orange?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-16+-success?style=for-the-badge&logo=node.js)

**A Modern Real-Time Chat Application**

*Experience seamless real-time communication with beautiful glassmorphism design and powerful features.*

[Live Demo](https://chat-connect-project.glitch.me/) • [Documentation](#features) • [Report Bug](https://github.com/Khushal-Me/ChatConnect/issues)

</div>

---

## What's NEW in v3.0 - Real-Time Chat Experience

- **MODERN GLASSMORPHISM UI** - Beautiful modern design with backdrop blur effects  
- **REAL-TIME MESSAGING** - Instant message delivery with Socket.io  
- **INTERACTIVE PARTICLES** - Mouse-responsive particle background system  
- **TYPING INDICATORS** - See when others are typing in real-time  
- **SMART NOTIFICATIONS** - Desktop notifications and visual alerts  
- **RESPONSIVE DESIGN** - Perfect experience on all devices  
- **ENHANCED INPUT** - Auto-resize textarea with character counter  
- **CLEAR CHAT** - Easy chat management with clear functionality  
- **SECURE MESSAGING** - XSS protection and input validation  
- **USER PRESENCE** - Live user tracking and room statistics

## Features That Actually Work

### **Real-Time Communication**
- Instant message delivery with Socket.io
- Real-time typing indicators showing who's typing
- Desktop notifications with sound alerts
- Live user presence and activity tracking
- Connection status monitoring with auto-reconnect

### **Modern UI Design**
- Stunning glassmorphism design with backdrop blur
- Dynamic gradient backgrounds
- Interactive particle systems that respond to mouse movement
- Smooth animations and micro-interactions
- Fully responsive design for all devices
- Modern color palette with CSS custom properties

### **Enhanced Messaging**
- Character counter with visual feedback (500 char limit)
- Auto-resize textarea for better UX
- XSS protection with HTML sanitization
- Duplicate message prevention
- Input validation and rate limiting
- Message timestamps with user avatars

### **Chat Management**
- Clear chat functionality
- Scroll to bottom with smart detection
- Real-time user list updates
- Room statistics and user counts
- Auto-scroll on new messages
- Message state management

### **Smart Notifications**
- Desktop notifications with custom messages
- Visual notification system with animations
- Browser tab title updates
- In-app notification badges
- Notification permission handling

### **Security & Performance**
- XSS protection with HTML sanitization
- Input validation and sanitization
- Rate limiting and spam prevention
- Memory leak prevention
- Connection error handling and recovery
- Automatic reconnection with status updates

## Getting Started - Quick Setup

### Prerequisites
- Node.js 16.0 or higher
- npm 8.0 or higher
- Modern browser (Chrome, Firefox, Safari, Edge)

### Installation - 3 Easy Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Khushal-Me/ChatConnect.git
   cd ChatConnect
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Launch the Application**
   ```bash
   npm start
   ```

4. **Open Your Browser**
   ```
   http://localhost:3000
   ```

## Technology Stack - Built with Modern Web Technologies

### Backend Foundation
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.io** - Real-time bidirectional communication
- **Moment.js** - Date/time manipulation

### Frontend Technologies
- **Vanilla JavaScript ES6+** - Core functionality
- **CSS3** - Glassmorphism design and animations
- **HTML5** - Semantic markup
- **Particles.js** - Interactive particle background system
- **Web APIs** - Notifications and browser features

### UI & Design
- **Font Awesome 6** - Icon library
- **Bootstrap Icons** - Additional icon set
- **Google Fonts** - Typography (Inter, JetBrains Mono)
- **CSS Custom Properties** - Dynamic theming
- **CSS Animations** - Smooth transitions and effects

### Development Tools
- **Nodemon** - Development server with auto-restart
- **ESLint** - Code quality (configured)
- **Prettier** - Code formatting (configured)
- **Git** - Version control

## Project Structure - Clean and Organized

```
ChatConnect/
├── public/                       # Client-side files
│   ├── css/
│   │   └── style.css             # Glassmorphism styles and themes
│   ├── js/
│   │   ├── script.js             # Core chat functionality
│   │   ├── chat-enhancements.js # Enhanced chat features
│   │   ├── chat-enhancements-simple.js # Fallback enhancements
│   │   ├── landing.js            # Landing page interactions
│   │   └── particle-system.js   # Interactive particle effects
│   ├── img/
│   │   └── Chatappicon.png       # App icon
│   ├── sound/
│   │   └── notification-sound.mp3 # Audio alerts
│   ├── index.html                # Landing page
│   ├── chat.html                 # Main chat interface
│   └── about.html                # About page
├── utils/                        # Server utilities
│   ├── messages.js               # Message formatting
│   └── users.js                  # User management with statistics
├── server.js                     # Express server with Socket.io
├── package.json                  # Dependencies and scripts
├── LICENSE                       # MIT License
└── README.md                     # This file
```

## How to Use

### Joining a Chat Room
1. **Enter Username** - Choose a unique username (2-20 characters)
2. **Select Room** - Pick from available themed rooms or join a custom one
3. **Start Chatting** - Begin messaging immediately with real-time delivery

### Chat Features
- **Type Messages** - Use the input area with auto-resize functionality
- **See Typing** - Watch real-time typing indicators from other users
- **Clear Chat** - Use the clear button to remove all messages
- **Scroll Control** - Auto-scroll or use the scroll-to-bottom button

### Notifications
- **Desktop Alerts** - Get notified when receiving messages (with permission)
- **Visual Indicators** - See connection status and user count updates
- **Sound Alerts** - Audio notifications for new messages

## Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

## Available Scripts

```bash
npm start        # Start the production server
npm run dev      # Start development server with auto-restart
npm run lint     # Run ESLint for code quality
npm run format   # Format code with Prettier
npm run clean    # Clean install dependencies
```

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Khushal Mehta**
- GitHub: [@Khushal-Me](https://github.com/Khushal-Me)

## Acknowledgments

- Socket.io team for real-time communication
- Particles.js for beautiful particle effects
- Font Awesome for amazing icons
- The open-source community for inspiration and support

---

<div align="center">

**Star this repo if you find it helpful!**

Made with love by [Khushal Mehta](https://github.com/Khushal-Me)

</div>
