# 🎯 Anon-Chat

**The Anonymous Chat Hub for CSE Students**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue?style=for-the-badge&logo=vercel)](https://anon-chat-swart.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.1.0-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-blue?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

---

## 🌟 Overview

**Anon-Chat** is a modern, real-time anonymous chat platform designed specifically for Computer Science Engineering (CSE) students. Built with Next.js and Firebase, it provides a safe and judgment-free environment where students from all academic years can connect, collaborate, share knowledge, and support each other in their coding journey.

🔗 **Live Website:** [https://anon-chat-swart.vercel.app/](https://anon-chat-swart.vercel.app/)

---

## ✨ Key Features

### 🎭 **Anonymous Communication**
- Complete anonymity - no personal information required
- Choose any username for each session
- Privacy-first approach to remove social barriers

### 🏛️ **Multi-Year Chat Rooms**
- **First Year Room** - For beginners starting their coding journey
- **Second Year Room** - For students diving deeper into programming
- **Third Year Room** - For advanced topics and specializations
- **Fourth Year Room** - For final year projects and career discussions
- **Common Room** - Open space for all students to interact

### 💬 **Private Messaging**
- Send secure one-on-one chat invitations
- Time-limited private sessions for focused discussions
- Enhanced privacy for sensitive conversations

### 👨‍💻 **Developer-Friendly Features**
- **Code Block Sharing** with syntax highlighting
- Support for multiple programming languages
- **Copy-to-clipboard** functionality for easy code sharing
- **GIF Integration** for expressive communication
- **Emoji and Sticker Support** for fun interactions

### 🔐 **Security & Privacy**
- Firebase Authentication for secure access
- Room-based access control
- Automatic message cleanup (15-day retention)
- No personal data storage

---

## 🚀 Live Demo

Experience Anon-Chat in action: **[https://anon-chat-swart.vercel.app/](https://anon-chat-swart.vercel.app/)**

### How to Get Started:
1. Visit the live website
2. Select your academic year or join the Common Room
3. Choose a username for your session
4. Start chatting anonymously!

---

## 🛠️ Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.4.6 | React framework for the frontend |
| **Firebase** | 12.1.0 | Backend services (Database, Auth) |
| **React** | 19.1.0 | UI library |
| **Tailwind CSS** | 3.4.17 | Styling and responsive design |
| **Framer Motion** | 12.23.12 | Animations and transitions |
| **GSAP** | 3.13.0 | Advanced animations |
| **Prism.js** | 1.30.0 | Code syntax highlighting |
| **Giphy API** | 5.7.0 | GIF integration |

---

## 📁 Project Structure

```
anon-chat/
├── components/
│   ├── CodeBlock.js          # Code highlighting component
│   └── NotificationBox.js    # Real-time notifications
├── pages/
│   ├── index.js              # Landing page with room selection
│   ├── join.js               # Room joining interface
│   ├── chat.js               # Main chat interface
│   ├── private-chat.js       # Private messaging
│   ├── _app.js               # App configuration
│   └── _document.js          # HTML document structure
├── api/
│   └── cleanup-messages.js   # Scheduled message cleanup
├── styles/
│   └── globals.css           # Global styles
├── firebase.js               # Firebase configuration
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── vercel.json               # Vercel deployment config
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project

### 1. Clone the Repository
```bash
git clone https://github.com/Sahil01010011/anon-chat.git
cd anon-chat
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Firebase Setup
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Realtime Database** and **Authentication**
3. Set up authentication users for each room:
   - `first@csechat.com` (password: `first@2025`)
   - `second@csechat.com` (password: `second@2025`)
   - `third@csechat.com` (password: `third@2025`)
   - `fourth@csechat.com` (password: `fourth@2025`)
   - `common@csechat.com` (password: `common@2025`)

### 4. Configure Firebase
Update `firebase.js` with your Firebase configuration:
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  databaseURL: "your-database-url", // Must be https://YOUR-PROJECT.firebaseio.com
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};
```

> **⚠️ Important:** The `databaseURL` must be in the format `https://YOUR-PROJECT.firebaseio.com` for the Realtime Database to work correctly.

### 5. Run Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Connect to Vercel:**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Set Environment Variables:**
   - Configure Firebase credentials in Vercel dashboard
   - Set `CRON_SECRET` for message cleanup functionality

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Alternative Deployment Options
- **Netlify:** Compatible with static export
- **Firebase Hosting:** Native Firebase integration
- **Railway:** Easy Node.js deployment

---

## 🔧 API Endpoints

### `/api/cleanup-messages`
- **Method:** POST
- **Purpose:** Automatic cleanup of messages older than 15 days
- **Schedule:** Daily at midnight (configured via cron)
- **Authentication:** Bearer token required

---

## 🎨 Features in Detail

### 🎭 Anonymous Chat System
- **Room-based Authentication:** Each academic year has dedicated login credentials
- **Session Management:** Temporary usernames for each chat session
- **Real-time Updates:** Instant message delivery using Firebase Realtime Database

### 💻 Code Sharing
```javascript
// Example of code block sharing
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```

### 🎨 Rich Media Support
- **GIF Integration:** Powered by Giphy API
- **Emoji Picker:** Wide range of expressions
- **Stickers:** Fun visual elements for communication

### 🔒 Private Messaging
- **Secure Invitations:** Send private chat requests
- **Time-limited Sessions:** Automatic session expiry
- **End-to-end Privacy:** No message persistence beyond session

---

## 🤝 Contributing

We welcome contributions from the CSE community! Here's how you can help:

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Contribution Guidelines
- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Test your changes thoroughly
- Update documentation when necessary
- Respect the anonymous and inclusive nature of the platform

### Areas for Contribution
- 🐛 Bug fixes and improvements
- ✨ New features and enhancements
- 📱 Mobile responsiveness improvements
- 🎨 UI/UX enhancements
- 📚 Documentation updates
- 🧪 Testing improvements

---

## 📱 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest 2 versions | ✅ Fully Supported |
| Firefox | Latest 2 versions | ✅ Fully Supported |
| Safari | Latest 2 versions | ✅ Fully Supported |
| Edge | Latest 2 versions | ✅ Fully Supported |

---

## 🔒 Privacy & Security

### Data Protection
- **No Personal Information:** Users remain completely anonymous
- **Session-based:** No long-term user data storage
- **Automatic Cleanup:** Messages automatically deleted after 15 days
- **Secure Authentication:** Firebase handles all authentication securely

### Best Practices
- Never share personal information in chats
- Use the platform responsibly and respectfully
- Report any inappropriate behavior
- Respect others' privacy and anonymity

---

## 🐛 Troubleshooting

### Common Issues

**Q: Build fails with "Cannot parse Firebase url" error?**
A: Ensure your Firebase configuration in `firebase.js` has a valid `databaseURL` in the format `https://YOUR-PROJECT.firebaseio.com`.

**Q: Can't connect to chat rooms?**
A: Check your internet connection and ensure Firebase configuration is correct.

**Q: Messages not showing in real-time?**
A: Refresh the page or check Firebase Realtime Database permissions.

**Q: Code blocks not highlighting properly?**
A: Ensure the language is specified correctly when sharing code.

**Q: Private chat invitations not working?**
A: Verify both users are online and have valid sessions.

---

## 👨‍💻 Developer

**Created by:** shadowxp  
**Purpose:** To foster a supportive, anonymous community for CSE students  
**Contact:** Through the platform's Common Room

### Development Philosophy
> "Anon-Chat was built to create a better, more open way for CSE students—from first-years to seniors—to connect and help each other succeed. This platform removes barriers and judgments, allowing genuine knowledge sharing and community building."

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🌟 Acknowledgments

- **CSE Department** - For inspiring this community-driven project
- **Firebase** - For providing robust backend services
- **Next.js Team** - For the excellent React framework
- **Vercel** - For seamless deployment and hosting
- **All Contributors** - For making this platform better

---

## 📞 Support

- **Live Demo:** [https://anon-chat-swart.vercel.app/](https://anon-chat-swart.vercel.app/)
- **Issues:** [GitHub Issues](https://github.com/Sahil01010011/anon-chat/issues)
- **Community:** Join the Common Room for support and discussions

---

<div align="center">

**Built with ❤️ for the CSE Community**

[🚀 Visit Live Site](https://anon-chat-swart.vercel.app/) | [📖 Documentation](https://github.com/Sahil01010011/anon-chat) | [🐛 Report Issue](https://github.com/Sahil01010011/anon-chat/issues)

</div>
