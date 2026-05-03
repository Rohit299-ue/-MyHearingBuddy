# ⚡ Quick Integration Reference

## 🎯 3-Step Integration

### Step 1: Copy Files
```bash
# Copy these files to your React project:
src/services/huggingfaceService.js
src/hooks/useSignLanguageDetection.js
src/components/SignLanguageDetector.jsx  # (optional - full UI)
src/components/SimpleDetector.jsx        # (optional - simple example)
```

### Step 2: Use the Hook
```jsx
import { useSignLanguageDetection } from './hooks/useSignLanguageDetection';

function MyComponent() {
  const { detect, loading, error, result } = useSignLanguageDetection();
  
  const handleImage = async (file) => {
    await detect(file);
  };
  
  return (
    <div>
      <input type="file" onChange={(e) => handleImage(e.target.files[0])} />
      {loading && <p>Loading...</p>}
      {result && <img src={result.annotatedImage} />}
    </div>
  );
}
```

### Step 3: Deploy
```bash
npm run build
vercel --prod
```

---

## 📡 API Quick Reference

### Backend URL
```javascript
const HF_SPACE_URL = 'https://rohitrohantripathy-sign-language-ml.hf.space';
```

### Request Format
```javascript
POST /api/predict
Content-Type: application/json

{
  "data": ["data:image/jpeg;base64,/9j/4AAQSkZJRg..."]
}
```

### Response Format
```javascript
{
  "data": [
    "data:image/png;base64,...",  // Annotated image
    "## 🎯 Prediction Results\n**Detected Sign:** A\n**Confidence:** 95%"
  ]
}
```

---

## 🔧 Hook API

```javascript
const {
  detect,      // Function: (File|string) => Promise<Result>
  reset,       // Function: () => void
  checkStatus, // Function: () => Promise<boolean>
  loading,     // Boolean: true when detecting
  error,       // String|null: error message
  result,      // Object|null: prediction result
  spaceOnline  // Boolean: backend status
} = useSignLanguageDetection();
```

---

## 📦 Result Object

```javascript
{
  success: true,
  annotatedImage: "data:image/png;base64,...",
  predictionText: "## 🎯 Prediction Results...",
  rawData: { /* Full API response */ }
}
```

---

## 🎨 Styling

### Tailwind CSS
```jsx
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Detect Sign
</button>
```

### CSS Modules
```jsx
import styles from './Detector.module.css';

<div className={styles.container}>
  <button className={styles.button}>Detect</button>
</div>
```

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| CORS Error | Add proxy in `package.json` or use Vercel rewrites |
| Backend Offline | Check `spaceOnline` state before calling `detect()` |
| Image not sending | Ensure file is valid image type |
| No prediction | Check console for API errors |

---

## ✅ Testing Checklist

- [ ] File upload works
- [ ] Webcam capture works
- [ ] Loading state shows
- [ ] Error handling works
- [ ] Results display correctly
- [ ] Mobile responsive
- [ ] Production build works

---

## 🚀 Deploy Commands

```bash
# Build
npm run build

# Test locally
npm run preview

# Deploy to Vercel
vercel --prod

# Or push to GitHub (auto-deploy)
git add .
git commit -m "Add HF integration"
git push
```

---

## 📞 Support

- **Frontend:** https://my-hearing-buddy.vercel.app/
- **Backend:** https://rohitrohantripathy-sign-language-ml.hf.space/
- **GitHub:** https://github.com/Rohit299-ue/-MyHearingBuddy

---

**That's it! You're ready to go! 🎉**
