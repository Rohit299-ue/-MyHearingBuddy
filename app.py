"""
Sign Language Detection App for Hugging Face Spaces
A production-ready Gradio interface for ASL sign recognition
"""

import gradio as gr
import cv2
import numpy as np
import os
import base64
import json
from typing import Tuple
from flask import Flask, request, jsonify
from flask_cors import CORS

# Try to import ML dependencies (graceful fallback if not available)
try:
    import pickle
    import mediapipe as mp
    from mediapipe.tasks import python
    from mediapipe.tasks.python import vision
    ML_AVAILABLE = True
except ImportError:
    ML_AVAILABLE = False
    print("⚠️ ML dependencies not available - using demo mode")

try:
    from sklearn.ensemble import RandomForestClassifier
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False

# ============================================================================
# CONFIGURATION
# ============================================================================

# ASL alphabet labels (A-Z + SPACE + SEND)
LABELS = {
    0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 
    8: 'I', 9: 'J', 10: 'K', 11: 'L', 12: 'M', 13: 'N', 14: 'O', 
    15: 'P', 16: 'Q', 17: 'R', 18: 'S', 19: 'T', 20: 'U', 21: 'V', 
    22: 'W', 23: 'X', 24: 'Y', 25: 'Z', 26: 'SPACE', 27: 'SEND'
}

# Global variables for models
model = None
hand_detector = None

# ============================================================================
# MODEL INITIALIZATION
# ============================================================================

def load_models():
    """Load ML model and hand detector"""
    global model, hand_detector
    
    if not ML_AVAILABLE:
        print("Running in demo mode - ML libraries not available")
        return False
    
    try:
        # Load trained Random Forest model
        model_path = os.path.join(os.path.dirname(__file__), 'backend', 'model.p')
        if os.path.exists(model_path):
            with open(model_path, 'rb') as f:
                model_dict = pickle.load(f)
                model = model_dict['model']
            print("Model loaded successfully")
        else:
            print(f"Model file not found at {model_path}")
            model = None
        
        # Load MediaPipe hand detector
        detector_path = os.path.join(os.path.dirname(__file__), 'backend', 'hand_landmarker.task')
        if os.path.exists(detector_path):
            base_options = python.BaseOptions(model_asset_path=detector_path)
            options = vision.HandLandmarkerOptions(
                base_options=base_options,
                num_hands=1,
                min_hand_detection_confidence=0.3,
                min_hand_presence_confidence=0.3,
                min_tracking_confidence=0.3
            )
            hand_detector = vision.HandLandmarker.create_from_options(options)
            print("Hand detector loaded successfully")
        else:
            print(f"Hand detector not found at {detector_path}")
            hand_detector = None
        
        return model is not None and hand_detector is not None
        
    except Exception as e:
        print(f"Error loading models: {e}")
        return False

# ============================================================================
# IMAGE PREPROCESSING
# ============================================================================

def preprocess_image(image: np.ndarray) -> np.ndarray:
    """
    Preprocess image using OpenCV
    
    Args:
        image: Input image as numpy array
        
    Returns:
        Preprocessed image
    """
    # Convert to RGB if needed
    if len(image.shape) == 2:  # Grayscale
        image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
    elif image.shape[2] == 4:  # RGBA
        image = cv2.cvtColor(image, cv2.COLOR_RGBA2RGB)
    
    # Resize if too large (for performance)
    max_size = 640
    h, w = image.shape[:2]
    if max(h, w) > max_size:
        scale = max_size / max(h, w)
        new_w, new_h = int(w * scale), int(h * scale)
        image = cv2.resize(image, (new_w, new_h), interpolation=cv2.INTER_AREA)
    
    return image

# ============================================================================
# HAND DETECTION AND FEATURE EXTRACTION
# ============================================================================

def extract_hand_features(image: np.ndarray) -> Tuple[np.ndarray, dict]:
    """
    Extract hand landmarks from image
    
    Args:
        image: Preprocessed RGB image
        
    Returns:
        Tuple of (features_array, landmarks_dict)
    """
    if hand_detector is None:
        return None, None
    
    # Convert to MediaPipe Image
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=image)
    
    # Detect hand landmarks
    results = hand_detector.detect(mp_image)
    
    if not results.hand_landmarks:
        return None, None
    
    # Get first hand
    hand_landmarks = results.hand_landmarks[0]
    
    # Extract coordinates
    x_coords = [lm.x for lm in hand_landmarks]
    y_coords = [lm.y for lm in hand_landmarks]
    
    # Normalize coordinates (relative to bounding box)
    min_x, min_y = min(x_coords), min(y_coords)
    features = []
    for lm in hand_landmarks:
        features.append(lm.x - min_x)
        features.append(lm.y - min_y)
    
    # Store landmarks for visualization
    landmarks_info = {
        'landmarks': hand_landmarks,
        'x_coords': x_coords,
        'y_coords': y_coords
    }
    
    return np.array(features), landmarks_info

# ============================================================================
# VISUALIZATION
# ============================================================================

def draw_landmarks(image: np.ndarray, landmarks_info: dict) -> np.ndarray:
    """
    Draw hand landmarks on image
    
    Args:
        image: Input image
        landmarks_info: Dictionary with landmark information
        
    Returns:
        Annotated image
    """
    if landmarks_info is None:
        return image
    
    annotated = image.copy()
    h, w = image.shape[:2]
    
    landmarks = landmarks_info['landmarks']
    x_coords = landmarks_info['x_coords']
    y_coords = landmarks_info['y_coords']
    
    # Draw bounding box
    x1 = int(min(x_coords) * w) - 20
    y1 = int(min(y_coords) * h) - 20
    x2 = int(max(x_coords) * w) + 20
    y2 = int(max(y_coords) * h) + 20
    
    x1, y1 = max(0, x1), max(0, y1)
    x2, y2 = min(w, x2), min(h, y2)
    
    cv2.rectangle(annotated, (x1, y1), (x2, y2), (0, 255, 0), 2)
    
    # Draw landmarks
    for lm in landmarks:
        cx, cy = int(lm.x * w), int(lm.y * h)
        cv2.circle(annotated, (cx, cy), 5, (255, 0, 0), -1)
    
    # Draw connections
    connections = mp.solutions.hands.HAND_CONNECTIONS
    for connection in connections:
        start_idx, end_idx = connection
        start_lm = landmarks[start_idx]
        end_lm = landmarks[end_idx]
        
        start_point = (int(start_lm.x * w), int(start_lm.y * h))
        end_point = (int(end_lm.x * w), int(end_lm.y * h))
        
        cv2.line(annotated, start_point, end_point, (0, 255, 255), 2)
    
    return annotated

# ============================================================================
# PREDICTION FUNCTION
# ============================================================================

def predict(image: np.ndarray) -> Tuple[np.ndarray, str]:
    """
    Main prediction function for Gradio interface
    
    Args:
        image: Input image from Gradio (numpy array)
        
    Returns:
        Tuple of (annotated_image, prediction_text)
    """
    # Handle None input
    if image is None:
        return None, "❌ No image provided. Please upload an image or use your camera."
    
    # Demo mode (no ML models)
    if not ML_AVAILABLE or model is None or hand_detector is None:
        demo_image = image.copy()
        cv2.putText(demo_image, "DEMO MODE", (10, 30), 
                   cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
        
        demo_text = """
## 🎭 Demo Mode

⚠️ **Models not loaded**

To enable full functionality:
1. Upload `backend/model.p` (trained model)
2. Upload `backend/hand_landmarker.task` (MediaPipe model)
3. Restart the Space

**Demo prediction:** Sign "A" (placeholder)
**Confidence:** N/A
        """
        return demo_image, demo_text.strip()
    
    try:
        # Step 1: Preprocess image
        processed_image = preprocess_image(image)
        
        # Step 2: Extract hand features
        features, landmarks_info = extract_hand_features(processed_image)
        
        if features is None:
            return image, "🤚 **No hand detected**\n\nPlease:\n- Show your hand clearly\n- Use good lighting\n- Try a plain background"
        
        # Step 3: Make prediction
        if len(features) != 42:  # 21 landmarks × 2 coordinates
            return image, "❌ **Invalid hand data**\n\nPlease try again with a clearer image."
        
        prediction = model.predict([features])
        predicted_label = LABELS[int(prediction[0])]
        
        # Get confidence score
        probabilities = model.predict_proba([features])
        confidence = float(np.max(probabilities))
        
        # Step 4: Visualize results
        annotated_image = draw_landmarks(processed_image, landmarks_info)
        
        # Add prediction text to image
        h, w = annotated_image.shape[:2]
        text = f"{predicted_label}"
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 2
        thickness = 3
        
        (text_w, text_h), _ = cv2.getTextSize(text, font, font_scale, thickness)
        
        # Draw background for text
        cv2.rectangle(annotated_image, (10, 10), (text_w + 20, text_h + 20), 
                     (0, 255, 0), -1)
        cv2.putText(annotated_image, text, (15, text_h + 15), 
                   font, font_scale, (0, 0, 0), thickness)
        
        # Create result text
        result_text = f"""
## 🎯 Prediction Results

**Detected Sign:** {predicted_label}

**Confidence:** {confidence:.1%}

**Status:** ✅ Detection successful

---

💡 **Tips:**
- Hold your hand steady
- Ensure good lighting
- Use a plain background for best results
        """
        
        return annotated_image, result_text.strip()
        
    except Exception as e:
        error_text = f"""
## ❌ Error

An error occurred during prediction:

```
{str(e)}
```

Please try again with a different image.
        """
        return image, error_text.strip()

# ============================================================================
# FLASK API FOR REACT FRONTEND
# ============================================================================

def create_flask_api():
    """Create Flask API for React frontend compatibility"""
    flask_app = Flask(__name__)
    CORS(flask_app)  # Enable CORS for frontend
    
    @flask_app.route('/health', methods=['GET'])
    def health_check():
        """Health check endpoint"""
        return jsonify({
            'status': 'ok',
            'model_loaded': model is not None and hand_detector is not None
        })
    
    @flask_app.route('/detect', methods=['POST'])
    def detect_sign():
        """Detection endpoint compatible with React frontend"""
        try:
            data = request.get_json()
            image_b64 = data.get('image', '')
            
            if not image_b64:
                return jsonify({'success': False, 'error': 'No image provided'}), 400
            
            # Decode base64 image
            if ',' in image_b64:
                image_b64 = image_b64.split(',')[1]
            
            image_bytes = base64.b64decode(image_b64)
            nparr = np.frombuffer(image_bytes, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if image is None:
                return jsonify({'success': False, 'error': 'Invalid image'}), 400
            
            # Preprocess
            processed_image = preprocess_image(image)
            
            # Extract features
            features, landmarks_info = extract_hand_features(processed_image)
            
            if features is None:
                return jsonify({
                    'success': False,
                    'prediction': '-',
                    'confidence': 0,
                    'message': 'No hand detected'
                })
            
            # Predict
            if len(features) != 42:
                return jsonify({
                    'success': False,
                    'prediction': '-',
                    'confidence': 0,
                    'message': 'Invalid hand data'
                })
            
            prediction = model.predict([features])
            predicted_label = LABELS[int(prediction[0])]
            
            probabilities = model.predict_proba([features])
            confidence = float(np.max(probabilities))
            
            # Get bounding box
            h, w = processed_image.shape[:2]
            x_coords = landmarks_info['x_coords']
            y_coords = landmarks_info['y_coords']
            
            x1 = int(min(x_coords) * w) - 20
            y1 = int(min(y_coords) * h) - 20
            x2 = int(max(x_coords) * w) + 20
            y2 = int(max(y_coords) * h) + 20
            
            x1, y1 = max(0, x1), max(0, y1)
            x2, y2 = min(w, x2), min(h, y2)
            
            # Get landmarks for frontend
            landmarks = []
            for lm in landmarks_info['landmarks']:
                landmarks.append({'x': lm.x, 'y': lm.y, 'z': lm.z})
            
            return jsonify({
                'success': True,
                'prediction': predicted_label,
                'confidence': confidence,
                'bounding_box': {
                    'x1': x1, 'y1': y1,
                    'x2': x2, 'y2': y2
                },
                'landmarks': landmarks
            })
            
        except Exception as e:
            return jsonify({
                'success': False,
                'error': str(e)
            }), 500
    
    return flask_app

# ============================================================================
# GRADIO INTERFACE
# ============================================================================

def create_app():
    """Create Gradio interface"""
    
    # Create interface
    demo = gr.Interface(
        fn=predict,
        inputs=gr.Image(
            label="Upload Image or Use Camera",
            type="numpy",
            sources=["upload", "webcam"]
        ),
        outputs=[
            gr.Image(
                label="Detection Result",
                type="numpy"
            ),
            gr.Markdown(
                label="Prediction"
            )
        ],
        title="Sign Language Detection",
        description="""
### Welcome to ASL Sign Language Detector!

This app detects **American Sign Language (ASL)** hand gestures using Machine Learning.

**Supported Signs:** A-Z letters, SPACE, and SEND

**How to use:**
1. Upload an image or use your webcam
2. Show a clear ASL hand gesture  
3. Get instant prediction with confidence score

**For best results:**
- Good lighting
- Plain background
- Hand clearly visible
- Hold gesture steady
        """,
        article="""
---

### About This Project

**MyHearingBuddy** - An AI-powered sign language detection system

**Technology:**
- Machine Learning: Random Forest Classifier
- Hand Detection: MediaPipe
- Image Processing: OpenCV
- Interface: Gradio

**Model Details:**
- 28 classes (A-Z + SPACE + SEND)
- 42 features (21 hand landmarks × 2 coordinates)
- Real-time capable

**Links:**
- [GitHub Repository](https://github.com/Rohit299-ue/-MyHearingBuddy)
- [Frontend App](https://my-hearing-buddy.vercel.app/)

---

Made with love by Rohit | Powered by Hugging Face
        """
    )
    
    return demo

# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
    print("=" * 70)
    print("Sign Language Detection App")
    print("=" * 70)
    
    # Load models
    print("\nLoading models...")
    models_loaded = load_models()
    
    if models_loaded:
        print("All models loaded successfully!")
    else:
        print("Running in demo mode (models not available)")
    
    # Create Flask API
    flask_app = create_flask_api()
    
    # Create and launch Gradio app with Flask API mounted
    print("\nLaunching Gradio interface with Flask API...")
    app = create_app()
    
    # Mount Flask app to Gradio
    app.launch(app_kwargs={"app": flask_app})
