"""
Simple Flask API Server for React Frontend
Runs on port 5000 alongside Gradio app
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
import pickle
import os

# Try to import ML dependencies
try:
    import mediapipe as mp
    from mediapipe.tasks import python
    from mediapipe.tasks.python import vision
    ML_AVAILABLE = True
except ImportError:
    ML_AVAILABLE = False

# Labels
LABELS = {
    0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 
    8: 'I', 9: 'J', 10: 'K', 11: 'L', 12: 'M', 13: 'N', 14: 'O', 
    15: 'P', 16: 'Q', 17: 'R', 18: 'S', 19: 'T', 20: 'U', 21: 'V', 
    22: 'W', 23: 'X', 24: 'Y', 25: 'Z', 26: 'SPACE', 27: 'SEND'
}

# Global variables
model = None
hand_detector = None

# Create Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS

def load_models():
    """Load ML models"""
    global model, hand_detector
    
    try:
        # Load Random Forest model
        model_path = os.path.join(os.path.dirname(__file__), 'backend', 'model.p')
        if os.path.exists(model_path):
            with open(model_path, 'rb') as f:
                model_dict = pickle.load(f)
                model = model_dict['model']
            print("✅ Model loaded")
        
        # Load MediaPipe hand detector
        detector_path = os.path.join(os.path.dirname(__file__), 'backend', 'hand_landmarker.task')
        if os.path.exists(detector_path):
            base_options = python.BaseOptions(model_asset_path=detector_path)
            options = vision.HandLandmarkerOptions(
                base_options=base_options,
                num_hands=1,
                min_hand_detection_confidence=0.3
            )
            hand_detector = vision.HandLandmarker.create_from_options(options)
            print("✅ Hand detector loaded")
        
        return model is not None and hand_detector is not None
    except Exception as e:
        print(f"❌ Error loading models: {e}")
        return False

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'model_loaded': model is not None and hand_detector is not None
    })

@app.route('/detect', methods=['POST'])
def detect_sign():
    """Detection endpoint"""
    try:
        data = request.get_json()
        image_b64 = data.get('image', '')
        
        if not image_b64:
            return jsonify({'success': False, 'error': 'No image provided'}), 400
        
        # Decode base64
        if ',' in image_b64:
            image_b64 = image_b64.split(',')[1]
        
        image_bytes = base64.b64decode(image_b64)
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            return jsonify({'success': False, 'error': 'Invalid image'}), 400
        
        # Convert to RGB
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Detect hand
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=image_rgb)
        results = hand_detector.detect(mp_image)
        
        if not results.hand_landmarks:
            return jsonify({
                'success': False,
                'prediction': '-',
                'confidence': 0,
                'message': 'No hand detected'
            })
        
        # Extract features
        hand_landmarks = results.hand_landmarks[0]
        x_coords = [lm.x for lm in hand_landmarks]
        y_coords = [lm.y for lm in hand_landmarks]
        
        min_x, min_y = min(x_coords), min(y_coords)
        features = []
        for lm in hand_landmarks:
            features.append(lm.x - min_x)
            features.append(lm.y - min_y)
        
        if len(features) != 42:
            return jsonify({
                'success': False,
                'prediction': '-',
                'confidence': 0,
                'message': 'Invalid hand data'
            })
        
        # Predict
        prediction = model.predict([features])
        predicted_label = LABELS[int(prediction[0])]
        probabilities = model.predict_proba([features])
        confidence = float(np.max(probabilities))
        
        # Bounding box
        h, w = image.shape[:2]
        x1 = max(0, int(min(x_coords) * w) - 20)
        y1 = max(0, int(min(y_coords) * h) - 20)
        x2 = min(w, int(max(x_coords) * w) + 20)
        y2 = min(h, int(max(y_coords) * h) + 20)
        
        # Landmarks
        landmarks = [{'x': lm.x, 'y': lm.y, 'z': lm.z} for lm in hand_landmarks]
        
        return jsonify({
            'success': True,
            'prediction': predicted_label,
            'confidence': confidence,
            'bounding_box': {'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2},
            'landmarks': landmarks
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    print("=" * 70)
    print("Flask API Server for Sign Language Detection")
    print("=" * 70)
    
    # Load models
    print("\nLoading models...")
    if load_models():
        print("✅ All models loaded successfully!")
    else:
        print("⚠️ Running without models")
    
    # Run Flask app
    print("\n🚀 Starting Flask API server on port 5000...")
    print("📡 Endpoints: /health, /detect")
    print("=" * 70)
    
    app.run(host='0.0.0.0', port=5000, debug=False)
