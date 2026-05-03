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

# 🤟 Sign Language Detection - MyHearingBuddy

An AI-powered sign language detection system that recognizes American Sign Language (ASL) gestures in real-time using Machine Learning and MediaPipe.

## 🎯 Features

- **Real-time Detection**: Instant recognition of ASL hand gestures
- **28 Classes**: Supports A-Z letters, SPACE, and SEND gestures
- **High Accuracy**: Uses Random Forest Classifier with MediaPipe hand landmarks
- **User-Friendly**: Simple Gradio interface with webcam and upload support
- **Visual Feedback**: Annotated images with hand landmarks and bounding boxes

## 🚀 How to Use

1. **Upload an Image** or **Use Webcam** to capture your hand gesture
2. **Show a clear ASL sign** (A-Z, SPACE, or SEND)
3. **Get instant prediction** with confidence score and visual feedback

## 💡 Tips for Best Results

- ✅ Ensure good lighting conditions
- ✅ Keep your hand clearly visible in the frame
- ✅ Use a plain, contrasting background
- ✅ Hold the gesture steady for a moment
- ✅ Position your hand at a comfortable distance from the camera

## 🛠️ Technology Stack

- **Machine Learning**: Random Forest Classifier (scikit-learn)
- **Hand Detection**: MediaPipe Hand Landmarker
- **Image Processing**: OpenCV
- **Interface**: Gradio
- **Deployment**: Hugging Face Spaces

## 📊 Model Details

- **Model Type**: Random Forest Classifier
- **Classes**: 28 (A-Z + SPACE + SEND)
- **Features**: 42 (21 hand landmarks × 2 coordinates)
- **Input**: RGB images with visible hand gestures
- **Output**: Predicted sign with confidence score

## 🎓 How It Works

1. **Hand Detection**: MediaPipe detects hand landmarks (21 key points)
2. **Feature Extraction**: Normalizes landmark coordinates relative to hand bounding box
3. **Classification**: Random Forest model predicts the sign language gesture
4. **Visualization**: Draws landmarks, connections, and prediction on the image

## 📁 Project Structure

```
sign-language-ml/
├── app.py                          # Main Gradio application
├── requirements.txt                # Python dependencies
├── backend/
│   ├── model.p                     # Trained Random Forest model
│   ├── hand_landmarker.task        # MediaPipe hand detection model
│   ├── api_server.py               # Flask API (for local deployment)
│   └── openai_integration.py       # OpenAI text completion
└── README.md                       # This file
```

## 🔗 Links

- **GitHub Repository**: [MyHearingBuddy](https://github.com/Rohit299-ue/-MyHearingBuddy)
- **Live Demo**: [Hugging Face Space](https://huggingface.co/spaces/rohitrohantripathy/sign-language-ml)
- **Frontend App**: [Vercel Deployment](https://my-hearing-buddy.vercel.app/)

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Rohit**
- GitHub: [@Rohit299-ue](https://github.com/Rohit299-ue)

## 🙏 Acknowledgments

- MediaPipe by Google for hand landmark detection
- Hugging Face for hosting the Space
- The open-source community for various tools and libraries

---

Made with ❤️ for bridging communication gaps through AI
