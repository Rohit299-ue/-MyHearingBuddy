# Backend Setup Guide

## ✅ Backend Successfully Copied!

All Python backend files have been copied to the `backend/` folder.

## 🚀 Quick Start

### Step 1: Install Python Dependencies

Open a terminal in the backend folder:

```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Start the Backend Server

```bash
python api_server.py
```

The server will start on `http://localhost:5000`

### Step 3: Start the Frontend

Open another terminal:

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📁 Project Structure

```
myhearingbuddy/
├── backend/                    # Python backend (NEW!)
│   ├── api_server.py          # Main Flask server
│   ├── model.p                # Trained ML model
│   ├── hand_landmarker.task   # MediaPipe model
│   ├── openai_integration.py  # AI text completion
│   ├── requirements.txt       # Python dependencies
│   └── README.md              # Backend documentation
├── src/                       # React frontend
│   ├── pages/
│   │   └── LiveDetectPage.jsx # Uses backend API
│   └── context/
│       └── AppContext.jsx     # Backend URL config
├── package.json               # Frontend dependencies
└── BACKEND_SETUP.md          # This file
```

## 🔧 Configuration

### Backend URL (Already Configured!)

The frontend is already configured to connect to `http://localhost:5000`

You can change it in:
- **Settings Page** in the app
- Or in `src/context/AppContext.jsx`

## 📋 Available Endpoints

Once the backend is running, these endpoints will be available:

- `GET /health` - Check if backend is running
- `POST /detect` - Detect sign language from image
- `POST /complete_text` - AI text completion
- `GET /labels` - Get all available signs (A-Z + SPACE + SEND)

## ✨ Features

- ✅ Real-time sign language detection
- ✅ 28 classes (A-Z + SPACE + SEND)
- ✅ 97.53% model accuracy
- ✅ OpenAI text completion
- ✅ CORS enabled for React frontend
- ✅ All model files included

## 🔍 Testing

### Test Backend Health

Open browser and go to:
```
http://localhost:5000/health
```

You should see:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "detector_loaded": true
}
```

### Test from Frontend

1. Start both backend and frontend
2. Go to "Live Detection" page
3. Allow camera access
4. Show hand signs to camera
5. See real-time detection!

## 🚨 Troubleshooting

### Backend won't start

**Problem:** Missing dependencies
```bash
cd backend
pip install -r requirements.txt
```

**Problem:** Port 5000 already in use
- Close other applications using port 5000
- Or change port in `api_server.py`

### Frontend can't connect to backend

**Problem:** Backend not running
- Make sure backend server is started
- Check terminal for errors

**Problem:** Wrong URL
- Check Settings page
- Default should be `http://localhost:5000`

### Detection not working

**Problem:** No hand detected
- Ensure good lighting
- Keep hand clearly visible in camera
- Try different hand positions

## 📝 Notes

- Backend runs on Python 3.7+
- Frontend runs on Node.js with Vite
- Both need to run simultaneously
- Backend URL can be changed in Settings

## 🎉 You're Ready!

Your HearingBuddy app is now fully configured with:
- ✅ Python backend with ML models
- ✅ React frontend with camera integration
- ✅ Real-time sign language detection
- ✅ AI-powered text completion

Start both servers and enjoy! 🚀
