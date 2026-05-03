# 📤 Upload Checklist for Hugging Face Spaces

## Files to Upload

### Root Folder (/)
- [ ] app.py
- [ ] requirements.txt  
- [ ] README.md

### Backend Folder (/backend)
- [ ] backend/model.p
- [ ] backend/hand_landmarker.task

## Upload Steps

1. Go to https://huggingface.co/spaces
2. Click "Create new Space"
3. Name: sign-language-detection
4. SDK: Gradio
5. Click "Create Space"

6. Upload root files:
   - Click "Add file" → "Upload files"
   - Select: app.py, requirements.txt, README.md
   - Click "Commit"

7. Create backend folder:
   - Click "Add file" → "Create a new file"
   - Name: backend/.gitkeep
   - Click "Commit"

8. Upload backend files:
   - Click "Add file" → "Upload files"
   - Navigate to backend folder
   - Select: model.p, hand_landmarker.task
   - Click "Commit"

9. Wait for build (check Logs tab)

10. Test your app!

## Your Space URL
After deployment:
https://huggingface.co/spaces/YOUR_USERNAME/sign-language-detection

## Troubleshooting

If build fails:
- Check Logs tab for errors
- Verify all files uploaded
- Check file sizes (model files should be present)
- Restart Space from Settings

## Need Help?
- Read COMPLETE_GUIDE.md
- Check Hugging Face Docs: https://huggingface.co/docs/hub/spaces
