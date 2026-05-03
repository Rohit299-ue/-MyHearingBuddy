# 🤟 MyHearingBuddy - Sign Language Communication System

A beautiful, modern web application that helps bridge communication gaps between hearing and speech-impaired people using real-time sign language detection and conversion.

## ✨ Features

### 🔐 Authentication
- OTP-based login UI (mock verification)
- Clean and intuitive mobile number input
- Beautiful gradient design with animations

### 🏠 Home Page
- Welcome dashboard with quick stats
- Feature cards with hover effects
- Animated floating background elements
- Bottom navigation for easy access

### ✍️ Text to Sign
- Convert text into sign language gestures
- Animated avatar display
- Text-to-speech functionality
- Character limit with visual feedback

### 📷 Live Detection
- Real-time sign language detection via webcam
- Live camera preview with overlay UI
- Detected letters with confidence percentage
- AI-powered text correction
- Automatic history tracking

### 📜 History
- View all detection history
- Filter by all or AI-corrected entries
- Beautiful timeline display
- Clear all data option

### 📘 Practice Module
- Learn ISL alphabets (A-Z)
- Interactive quiz system (10 questions)
- Progress tracking
- Instant feedback on answers

### ⚙️ Settings
- Detection mode configuration (Manual/Optimized/Real-time)
- Detection speed slider
- Backend URL configuration
- Connection testing
- Dark mode toggle (UI ready)
- Clear data option
- Logout functionality

## 🎨 Design Features

- **Modern UI**: Glass morphism effects, gradient backgrounds
- **Smooth Animations**: Fade in, slide in, scale, float, pulse effects
- **Responsive Design**: Works on mobile and desktop
- **Beautiful Colors**: Purple, pink, blue gradient themes
- **Custom Scrollbar**: Styled with gradient colors
- **Hover Effects**: Interactive cards and buttons
- **Loading States**: Elegant loaders and transitions

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd myhearingbuddy
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit:
```
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with Hooks
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite
- **State Management**: Context API
- **Animations**: CSS animations and transitions

## 📁 Project Structure

```
myhearingbuddy/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable components (Loader, Toast)
│   │   └── layout/          # Layout components (BottomNav, PageHeader)
│   ├── context/             # React Context for state management
│   ├── pages/               # All page components
│   │   ├── AuthPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── TextToSignPage.jsx
│   │   ├── LiveDetectPage.jsx
│   │   ├── HistoryPage.jsx
│   │   ├── PracticePage.jsx
│   │   └── SettingsPage.jsx
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles and animations
├── index.html
├── package.json
├── vite.config.js
└── postcss.config.js
```

## 🎯 Demo Credentials

For testing the authentication:
- **Phone**: Any 10-digit number
- **OTP**: Any 6-digit code (mock verification)

## 🔮 Future Enhancements

- Real backend API integration
- Actual ML model for gesture detection
- More sign language gestures
- User profiles and progress tracking
- Social features (share progress)
- Offline mode support
- PWA capabilities
- Multi-language support

## 📝 Notes

- Camera access is required for Live Detection feature
- All data is stored in browser's localStorage
- Mock APIs are used for demonstration purposes
- AI correction is simulated for demo

## 🤝 Contributing

This is a demo project. Feel free to fork and enhance!

## 📄 License

MIT License - feel free to use this project for learning and development.

---

Made with ❤️ for the hearing and speech-impaired community
