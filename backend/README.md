# Sign Language Detection Backend

Backend API server for HearingBuddy sign language detection.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Start the Server

```bash
python api_server.py
```

Server will start on `http://localhost:5000`

## 📋 API Endpoints

- **GET /health** - Health check
- **POST /detect** - Sign language detection from image
- **POST /complete_text** - AI text completion
- **POST /speak** - Text-to-speech
- **GET /labels** - Get all available labels
- **GET /model_info** - Get model information

## 🔧 Configuration

The backend URL is already configured in the frontend:
- Default: `http://localhost:5000`
- Can be changed in Settings page

## 📦 Required Files

- ✅ `model.p` - Trained classifier model
- ✅ `hand_landmarker.task` - MediaPipe hand detection model
- ✅ `data.pickle` - Training dataset
- ✅ `openai_integration.py` - OpenAI integration

## 🎯 Features

- Real-time sign language detection (A-Z + SPACE + SEND)
- OpenAI-powered text completion
- Text-to-speech functionality
- High accuracy (97.53% model accuracy)
- CORS enabled for React frontend

## 🔍 Troubleshooting

### Server won't start
- Check if Python 3.7+ is installed
- Install all dependencies: `pip install -r requirements.txt`
- Verify all model files exist

### Frontend can't connect
- Make sure backend is running on port 5000
- Check firewall settings
- Verify backend URL in frontend Settings

### Detection not working
- Ensure good lighting
- Keep hand clearly visible
- Check camera permissions
