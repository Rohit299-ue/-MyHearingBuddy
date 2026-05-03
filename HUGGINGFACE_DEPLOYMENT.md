# 🚀 Hugging Face Spaces Deployment Guide

This guide will help you deploy the Sign Language Detection app to Hugging Face Spaces.

## 📋 Prerequisites

1. **Hugging Face Account**: Create one at [huggingface.co](https://huggingface.co/join)
2. **Git LFS**: Install Git Large File Storage for handling model files
3. **Model Files**: Ensure you have:
   - `backend/model.p` (trained Random Forest model)
   - `backend/hand_landmarker.task` (MediaPipe model)

## 🔧 Step-by-Step Deployment

### Option 1: Deploy via Hugging Face Web Interface (Easiest)

1. **Create a New Space**
   - Go to [huggingface.co/spaces](https://huggingface.co/spaces)
   - Click "Create new Space"
   - Choose a name (e.g., `sign-language-ml`)
   - Select SDK: **Gradio**
   - Choose visibility: Public or Private
   - Click "Create Space"

2. **Upload Files**
   - Upload `app.py` to the root
   - Upload `requirements.txt` to the root
   - Create a `backend` folder and upload:
     - `model.p`
     - `hand_landmarker.task`
   - Upload `README_HUGGINGFACE.md` and rename it to `README.md`

3. **Configure Space**
   - The space will automatically detect `app.py` and start building
   - Wait for the build to complete (usually 2-5 minutes)
   - Your app will be live at: `https://huggingface.co/spaces/YOUR_USERNAME/sign-language-ml`

### Option 2: Deploy via Git (Advanced)

1. **Install Git LFS**
   ```bash
   # Windows (using Chocolatey)
   choco install git-lfs
   
   # Or download from: https://git-lfs.github.com/
   
   # Initialize Git LFS
   git lfs install
   ```

2. **Clone Your Space Repository**
   ```bash
   git clone https://huggingface.co/spaces/YOUR_USERNAME/sign-language-ml
   cd sign-language-ml
   ```

3. **Copy Files**
   ```bash
   # Copy app.py and requirements.txt
   cp path/to/app.py .
   cp path/to/requirements.txt .
   
   # Create backend folder and copy model files
   mkdir backend
   cp path/to/backend/model.p backend/
   cp path/to/backend/hand_landmarker.task backend/
   
   # Copy README
   cp path/to/README_HUGGINGFACE.md README.md
   ```

4. **Track Large Files with Git LFS**
   ```bash
   git lfs track "*.p"
   git lfs track "*.task"
   git add .gitattributes
   ```

5. **Commit and Push**
   ```bash
   git add .
   git commit -m "Initial deployment of sign language detection app"
   git push
   ```

6. **Wait for Build**
   - Go to your Space URL: `https://huggingface.co/spaces/YOUR_USERNAME/sign-language-ml`
   - The app will build automatically
   - Check the "Logs" tab if there are any issues

## 📁 Required File Structure

```
sign-language-ml/
├── app.py                      # Main Gradio application (REQUIRED)
├── requirements.txt            # Python dependencies (REQUIRED)
├── README.md                   # Space description (REQUIRED)
├── .gitattributes             # Git LFS configuration (REQUIRED for large files)
└── backend/
    ├── model.p                # Trained model (REQUIRED)
    └── hand_landmarker.task   # MediaPipe model (REQUIRED)
```

## ⚙️ Configuration Options

### Space Settings (in README.md frontmatter)

```yaml
---
title: Sign Language Detection - MyHearingBuddy
emoji: 🤟
colorFrom: blue
colorTo: green
sdk: gradio
sdk_version: 4.44.0
app_file: app.py
pinned: false
license: mit
---
```

### Environment Variables (if needed)

If you want to add OpenAI integration later:
1. Go to Space Settings
2. Add Secret: `OPENAI_API_KEY` = `your-api-key`

## 🐛 Troubleshooting

### Build Fails

**Problem**: Space fails to build
**Solution**: 
- Check the "Logs" tab for error messages
- Ensure all files are uploaded correctly
- Verify `requirements.txt` has correct package versions

### Model Files Not Found

**Problem**: Error: "Model file not found"
**Solution**:
- Ensure `backend/model.p` and `backend/hand_landmarker.task` are uploaded
- Check file paths in `app.py` match your structure
- Verify Git LFS is tracking large files: `git lfs ls-files`

### Out of Memory

**Problem**: Space crashes with memory error
**Solution**:
- Hugging Face Spaces have limited memory (16GB)
- Your models should fit (model.p ~5MB, hand_landmarker.task ~10MB)
- If issues persist, consider upgrading to a paid Space

### Slow Performance

**Problem**: App is slow to respond
**Solution**:
- Free Spaces have limited CPU
- Consider upgrading to a Space with GPU (paid)
- Optimize model if possible

## 🔄 Updating Your Space

To update your deployed app:

1. **Via Web Interface**:
   - Go to your Space
   - Click "Files" tab
   - Upload new files or edit existing ones

2. **Via Git**:
   ```bash
   # Make changes locally
   git add .
   git commit -m "Update: description of changes"
   git push
   ```

## 📊 Monitoring

- **Logs**: Check the "Logs" tab for runtime errors
- **Analytics**: View usage statistics in Space settings
- **Community**: Enable discussions for user feedback

## 🎉 Success!

Once deployed, your app will be available at:
`https://huggingface.co/spaces/YOUR_USERNAME/sign-language-ml`

Share this link with others to let them try your sign language detection app!

## 📚 Additional Resources

- [Gradio Documentation](https://gradio.app/docs/)
- [Hugging Face Spaces Documentation](https://huggingface.co/docs/hub/spaces)
- [Git LFS Documentation](https://git-lfs.github.com/)

---

Need help? Open an issue on [GitHub](https://github.com/Rohit299-ue/-MyHearingBuddy/issues)
