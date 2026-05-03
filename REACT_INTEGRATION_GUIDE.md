# 🔗 React Frontend Integration Guide

Complete guide to connect your React frontend with Hugging Face Gradio backend.

## 📦 Files Created

### 1. **API Service** (`src/services/huggingfaceService.js`)
- Handles all API communication with Hugging Face
- Converts images to base64
- Sends requests to Gradio backend
- Parses responses

### 2. **Custom Hook** (`src/hooks/useSignLanguageDetection.js`)
- React hook for easy integration
- Manages loading, error, and result states
- Provides `detect()`, `reset()`, and `checkStatus()` functions

### 3. **Full Component** (`src/components/SignLanguageDetector.jsx`)
- Complete UI with file upload and webcam
- Displays results with annotations
- Production-ready with error handling

### 4. **Simple Component** (`src/components/SimpleDetector.jsx`)
- Minimal example showing hook usage
- Easy to understand and customize

---

## 🚀 Quick Start

### Option 1: Use the Custom Hook (Recommended)

```jsx
import { useSignLanguageDetection } from './hooks/useSignLanguageDetection';

function MyComponent() {
  const { detect, loading, error, result } = useSignLanguageDetection();
  
  const handleImageUpload = async (file) => {
    const prediction = await detect(file);
    console.log(prediction);
  };
  
  return (
    <div>
      {loading && <p>Detecting...</p>}
      {error && <p>Error: {error}</p>}
      {result && <p>Sign: {result.predictionText}</p>}
    </div>
  );
}
```

### Option 2: Use the Full Component

```jsx
import SignLanguageDetector from './components/SignLanguageDetector';

function App() {
  return (
    <div>
      <SignLanguageDetector />
    </div>
  );
}
```

### Option 3: Direct API Call

```jsx
import { predictSignLanguage } from './services/huggingfaceService';

async function detectSign(imageFile) {
  const result = await predictSignLanguage(imageFile);
  
  if (result.success) {
    console.log('Annotated Image:', result.annotatedImage);
    console.log('Prediction:', result.predictionText);
  } else {
    console.error('Error:', result.error);
  }
}
```

---

## 📡 API Details

### Hugging Face Gradio API Format

**Endpoint:** `https://rohitrohantripathy-sign-language-ml.hf.space/api/predict`

**Request:**
```json
{
  "data": ["data:image/jpeg;base64,/9j/4AAQSkZJRg..."]
}
```

**Response:**
```json
{
  "data": [
    "data:image/png;base64,iVBORw0KGgo...",  // Annotated image
    "## 🎯 Prediction Results\n\n**Detected Sign:** A\n\n**Confidence:** 95.3%"  // Markdown text
  ]
}
```

---

## 🎨 Integration with Existing Pages

### Update LiveDetectPage.jsx

```jsx
import { useSignLanguageDetection } from '../hooks/useSignLanguageDetection';

const LiveDetectPage = () => {
  const { detect, loading, error, result } = useSignLanguageDetection();
  
  const handleCapture = async (imageBlob) => {
    const file = new File([imageBlob], 'capture.jpg', { type: 'image/jpeg' });
    await detect(file);
  };
  
  return (
    <div>
      {/* Your existing UI */}
      <button onClick={() => handleCapture(capturedImage)}>
        Detect Sign
      </button>
      
      {loading && <div>Analyzing...</div>}
      {error && <div>Error: {error}</div>}
      {result && (
        <div>
          <img src={result.annotatedImage} alt="Result" />
          <p>{result.predictionText}</p>
        </div>
      )}
    </div>
  );
};
```

### Update TextToSignPage.jsx

```jsx
import { predictSignLanguage } from '../services/huggingfaceService';

const TextToSignPage = () => {
  const [result, setResult] = useState(null);
  
  const handleImageUpload = async (file) => {
    const prediction = await predictSignLanguage(file);
    setResult(prediction);
  };
  
  return (
    <div>
      <input type="file" onChange={(e) => handleImageUpload(e.target.files[0])} />
      {result && <div>{result.predictionText}</div>}
    </div>
  );
};
```

---

## 🔧 Configuration

### Update Backend URL

If your Hugging Face Space URL is different, update in `src/services/huggingfaceService.js`:

```javascript
const HF_SPACE_URL = 'https://YOUR-USERNAME-YOUR-SPACE-NAME.hf.space';
```

### Add CORS Headers (if needed)

If you encounter CORS issues, you may need to:

1. **Use a proxy** in development (`package.json`):
```json
{
  "proxy": "https://rohitrohantripathy-sign-language-ml.hf.space"
}
```

2. **Or use Vercel rewrites** (`vercel.json`):
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://rohitrohantripathy-sign-language-ml.hf.space/api/:path*"
    }
  ]
}
```

---

## 🎯 Features

### ✅ Implemented
- File upload support
- Webcam capture
- Base64 image encoding
- Loading states
- Error handling
- Result display with annotations
- Backend status check
- Markdown parsing

### 🔄 Response Format
```javascript
{
  success: true,
  annotatedImage: "data:image/png;base64,...",  // Image with hand landmarks
  predictionText: "## 🎯 Prediction Results...",  // Markdown text
  rawData: { /* Full API response */ }
}
```

---

## 🐛 Troubleshooting

### Issue: CORS Error

**Solution:** Use proxy or Vercel rewrites (see Configuration section)

### Issue: "Backend Offline"

**Solution:** Check if Hugging Face Space is running:
```javascript
import { checkSpaceStatus } from './services/huggingfaceService';

const isOnline = await checkSpaceStatus();
console.log('Space online:', isOnline);
```

### Issue: Image not sending

**Solution:** Ensure image is properly converted to base64:
```javascript
// The service handles this automatically
const result = await predictSignLanguage(imageFile);
```

### Issue: Prediction not parsing

**Solution:** Check the markdown format in response:
```javascript
const parsePrediction = (text) => {
  const signMatch = text.match(/\*\*Detected Sign:\*\* ([A-Z]+|SPACE|SEND)/);
  const confidenceMatch = text.match(/\*\*Confidence:\*\* ([\d.]+%)/);
  
  return {
    sign: signMatch ? signMatch[1] : 'Unknown',
    confidence: confidenceMatch ? confidenceMatch[1] : 'N/A',
  };
};
```

---

## 📱 Mobile Support

The components are mobile-friendly and support:
- Touch events for webcam capture
- Responsive design
- Mobile camera access

---

## 🔒 Security Notes

1. **API Key:** Not required for public Hugging Face Spaces
2. **Rate Limiting:** Be aware of HF Space rate limits
3. **Image Size:** Large images are automatically handled
4. **HTTPS:** Always use HTTPS in production

---

## 📊 Performance Tips

1. **Compress images** before sending:
```javascript
const compressImage = (file, maxWidth = 640) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ratio = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * ratio;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob(resolve, 'image/jpeg', 0.8);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};
```

2. **Cache results** for same images
3. **Debounce** rapid requests
4. **Show loading indicators** for better UX

---

## 🎓 Example: Complete Integration

```jsx
import React, { useState } from 'react';
import { useSignLanguageDetection } from './hooks/useSignLanguageDetection';

function SignLanguagePage() {
  const [image, setImage] = useState(null);
  const { detect, loading, error, result, spaceOnline } = useSignLanguageDetection();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleDetect = async () => {
    if (image) {
      await detect(image);
    }
  };

  return (
    <div className="container">
      <h1>Sign Language Detection</h1>
      
      {!spaceOnline && (
        <div className="alert alert-warning">
          Backend is currently offline
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="form-control"
      />

      <button
        onClick={handleDetect}
        disabled={!image || loading}
        className="btn btn-primary"
      >
        {loading ? 'Detecting...' : 'Detect Sign'}
      </button>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {result && result.success && (
        <div className="results">
          <h2>Results:</h2>
          <img src={result.annotatedImage} alt="Result" />
          <div dangerouslySetInnerHTML={{ __html: result.predictionText }} />
        </div>
      )}
    </div>
  );
}

export default SignLanguagePage;
```

---

## 📚 Additional Resources

- [Gradio API Documentation](https://gradio.app/docs/)
- [Hugging Face Spaces](https://huggingface.co/docs/hub/spaces)
- [React Hooks Guide](https://react.dev/reference/react)

---

## ✅ Checklist

- [ ] Copy service file to `src/services/`
- [ ] Copy hook file to `src/hooks/`
- [ ] Copy component file to `src/components/`
- [ ] Update backend URL if needed
- [ ] Test file upload
- [ ] Test webcam capture
- [ ] Test error handling
- [ ] Deploy to Vercel
- [ ] Test production build

---

## 🎉 You're Ready!

Your React frontend is now connected to the Hugging Face Gradio backend!

**Test it:**
1. Upload an image with ASL sign
2. See the prediction with confidence
3. View annotated image with hand landmarks

**Share your app:**
- Frontend: https://my-hearing-buddy.vercel.app/
- Backend: https://rohitrohantripathy-sign-language-ml.hf.space/

---

Need help? Check the troubleshooting section or open an issue on GitHub!
