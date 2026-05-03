# MyHearingBuddy Setup Guide

## Prerequisites
- Node.js 16+
- Python 3.10+
- OpenAI API Key

## Frontend Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "OPENAI_API_KEY=your_api_key_here" > .env

# Run backend server
python api_server.py
```

## Environment Variables

### Backend (.env file in backend folder)
```
OPENAI_API_KEY=your_openai_api_key_here
```

### Frontend
Backend URL can be configured in Settings page or in `src/context/AppContext.jsx`

## Running Locally

1. Start backend: `cd backend && python api_server.py`
2. Start frontend: `npm run dev`
3. Open browser: `http://localhost:5173`

## Features

- 🤟 Live Sign Language Detection
- 📝 Text-to-Sign Conversion
- 🔊 Text-to-Speech
- 📜 History Tracking
- ⚙️ Settings & Customization
