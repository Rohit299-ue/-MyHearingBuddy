# ✅ Deployment Checklist for Hugging Face Spaces

## 📋 Pre-Deployment Checklist

### Required Files
- [ ] `app.py` - Main application file
- [ ] `requirements.txt` - Python dependencies
- [ ] `README.md` - Space documentation (with YAML frontmatter)
- [ ] `backend/model.p` - Trained ML model
- [ ] `backend/hand_landmarker.task` - MediaPipe hand detector

### Optional Files
- [ ] `.gitattributes` - For Git LFS (large files)
- [ ] `examples/` - Sample images for testing

## 🚀 Deployment Steps

### Method 1: Web Interface (Recommended)

1. **Create Space**
   - Go to https://huggingface.co/spaces
   - Click "Create new Space"
   - Name: `sign-language-ml`
   - SDK: **Gradio**
   - Click "Create Space"

2. **Upload Files**
   - Upload `app.py`
   - Upload `requirements.txt`
   - Upload `README.md`
   - Create `backend` folder
   - Upload `backend/model.p`
   - Upload `backend/hand_landmarker.task`

3. **Wait for Build**
   - Check "Logs" tab
   - Build takes 2-5 minutes
   - App will auto-launch when ready

### Method 2: Git Push

```bash
# Clone your space
git clone https://huggingface.co/spaces/YOUR_USERNAME/sign-language-ml
cd sign-language-ml

# Setup Git LFS for large files
git lfs install
git lfs track "*.p"
git lfs track "*.task"

# Copy files
cp /path/to/app.py .
cp /path/to/requirements.txt .
cp /path/to/README.md .
mkdir backend
cp /path/to/backend/model.p backend/
cp /path/to/backend/hand_landmarker.task backend/

# Commit and push
git add .
git commit -m "Initial deployment"
git push
```

## 🧪 Testing

### Local Testing (Before Deploy)

```bash
# Install dependencies
pip install -r requirements.txt

# Run app locally
python app.py

# Open browser to http://localhost:7860
```

### After Deployment

1. **Test Image Upload**
   - Upload a test image with hand gesture
   - Verify prediction appears

2. **Test Webcam**
   - Click webcam option
   - Allow camera permissions
   - Capture image
   - Verify prediction

3. **Test Error Handling**
   - Upload image without hand
   - Verify error message appears

## 🐛 Troubleshooting

### Build Fails

**Check:**
- Logs tab for error messages
- All files uploaded correctly
- requirements.txt has correct versions

**Common Issues:**
- Missing model files → Upload to `backend/` folder
- Wrong Python version → Use Python 3.9+
- Package conflicts → Check requirements.txt

### Models Not Loading

**Check:**
- Files are in `backend/` folder
- File names match exactly:
  - `backend/model.p`
  - `backend/hand_landmarker.task`
- Files uploaded completely (not corrupted)

**Solution:**
- Re-upload model files
- Check file sizes match originals
- Verify Git LFS is tracking large files

### App Runs But No Predictions

**Check:**
- "Demo Mode" message in output
- Models loaded successfully (check logs)
- Image has visible hand

**Solution:**
- Ensure model files are present
- Restart Space
- Try different test image

### Slow Performance

**Causes:**
- Free tier has limited resources
- Large images take longer to process

**Solutions:**
- Images auto-resize to 640px max
- Consider upgrading to paid tier
- Optimize model if possible

## 📊 Post-Deployment

### Monitor

- [ ] Check Logs regularly
- [ ] Monitor usage statistics
- [ ] Read user feedback

### Optimize

- [ ] Add example images
- [ ] Improve error messages
- [ ] Update documentation

### Share

- [ ] Share Space URL
- [ ] Add to portfolio
- [ ] Post on social media
- [ ] Submit to Gradio gallery

## 🔗 Your Space URL

After deployment, your app will be at:
```
https://huggingface.co/spaces/YOUR_USERNAME/sign-language-ml
```

## 📚 Resources

- [Gradio Docs](https://gradio.app/docs/)
- [HF Spaces Docs](https://huggingface.co/docs/hub/spaces)
- [Git LFS Guide](https://git-lfs.github.com/)

## ✨ Success Criteria

- [ ] App loads without errors
- [ ] Can upload images
- [ ] Can use webcam
- [ ] Predictions appear correctly
- [ ] Error messages are clear
- [ ] UI is responsive
- [ ] Documentation is complete

## 🎉 Deployment Complete!

Once all checks pass, your Sign Language Detection app is live and ready to use!

Share it with the world! 🌍

---

**Need Help?**
- Check logs first
- Read troubleshooting section
- Open GitHub issue
- Ask on HF forums
