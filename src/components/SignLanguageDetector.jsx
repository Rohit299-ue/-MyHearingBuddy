/**
 * Sign Language Detector Component
 * Integrates with Hugging Face Gradio backend for real-time ASL detection
 */

import { useState, useRef } from 'react';
import { predictSignLanguage, checkSpaceStatus } from '../services/huggingfaceService';

const SignLanguageDetector = () => {
  // State management
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [annotatedImage, setAnnotatedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [spaceOnline, setSpaceOnline] = useState(true);

  // Refs
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  /**
   * Handle file upload from input
   */
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
      setAnnotatedImage(null);
      setPrediction(null);
    } else {
      setError('Please select a valid image file');
    }
  };

  /**
   * Start webcam for live capture
   */
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setError(null);
    } catch (err) {
      setError('Failed to access webcam: ' + err.message);
    }
  };

  /**
   * Capture image from webcam
   */
  const captureFromWebcam = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        const file = new File([blob], 'webcam-capture.jpg', { type: 'image/jpeg' });
        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
        
        // Stop webcam
        const stream = video.srcObject;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      }, 'image/jpeg');
    }
  };

  /**
   * Send image to Hugging Face API for prediction
   */
  const handlePredict = async () => {
    if (!selectedImage) {
      setError('Please select or capture an image first');
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);
    setAnnotatedImage(null);

    try {
      // Check if space is online
      const isOnline = await checkSpaceStatus();
      setSpaceOnline(isOnline);

      if (!isOnline) {
        throw new Error('Hugging Face Space is currently offline. Please try again later.');
      }

      // Send image for prediction
      const result = await predictSignLanguage(selectedImage);

      if (result.success) {
        setAnnotatedImage(result.annotatedImage);
        setPrediction(result.predictionText);
      } else {
        throw new Error(result.error || 'Prediction failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset all states
   */
  const handleReset = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setAnnotatedImage(null);
    setPrediction(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Parse markdown prediction text to extract sign and confidence
   */
  const parsePrediction = (text) => {
    if (!text) return null;
    
    const signMatch = text.match(/\*\*Detected Sign:\*\* ([A-Z]+|SPACE|SEND)/);
    const confidenceMatch = text.match(/\*\*Confidence:\*\* ([\d.]+%)/);
    
    return {
      sign: signMatch ? signMatch[1] : 'Unknown',
      confidence: confidenceMatch ? confidenceMatch[1] : 'N/A',
      fullText: text,
    };
  };

  const parsedPrediction = parsePrediction(prediction);

  return (
    <div className="sign-language-detector">
      <div className="detector-container">
        {/* Header */}
        <div className="detector-header">
          <h2>🤟 Sign Language Detection</h2>
          <p>Upload an image or use your webcam to detect ASL signs</p>
          {!spaceOnline && (
            <div className="status-badge offline">
              ⚠️ Backend Offline
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="input-section">
          <div className="upload-options">
            {/* File Upload */}
            <div className="upload-option">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="file-upload"
              />
              <label htmlFor="file-upload" className="upload-button">
                📁 Upload Image
              </label>
            </div>

            {/* Webcam Capture */}
            <div className="upload-option">
              <button onClick={startWebcam} className="webcam-button">
                📷 Use Webcam
              </button>
            </div>
          </div>

          {/* Webcam Video */}
          {videoRef.current?.srcObject && (
            <div className="webcam-container">
              <video ref={videoRef} autoPlay playsInline />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <button onClick={captureFromWebcam} className="capture-button">
                📸 Capture
              </button>
            </div>
          )}

          {/* Image Preview */}
          {previewUrl && (
            <div className="preview-container">
              <h3>Selected Image:</h3>
              <img src={previewUrl} alt="Preview" className="preview-image" />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            onClick={handlePredict}
            disabled={!selectedImage || loading}
            className="predict-button"
          >
            {loading ? '🔄 Detecting...' : '🎯 Detect Sign'}
          </button>
          <button onClick={handleReset} className="reset-button">
            🔄 Reset
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Analyzing hand gesture...</p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="error-container">
            <p>❌ {error}</p>
          </div>
        )}

        {/* Results Section */}
        {parsedPrediction && !loading && (
          <div className="results-container">
            <h3>📊 Detection Results</h3>
            
            {/* Prediction Details */}
            <div className="prediction-details">
              <div className="prediction-item">
                <span className="label">Detected Sign:</span>
                <span className="value sign">{parsedPrediction.sign}</span>
              </div>
              <div className="prediction-item">
                <span className="label">Confidence:</span>
                <span className="value confidence">{parsedPrediction.confidence}</span>
              </div>
            </div>

            {/* Annotated Image */}
            {annotatedImage && (
              <div className="annotated-image-container">
                <h4>Annotated Image:</h4>
                <img
                  src={annotatedImage}
                  alt="Annotated result"
                  className="annotated-image"
                />
              </div>
            )}

            {/* Full Prediction Text */}
            <div className="full-prediction">
              <details>
                <summary>View Full Details</summary>
                <div
                  className="markdown-content"
                  dangerouslySetInnerHTML={{
                    __html: parsedPrediction.fullText.replace(/\n/g, '<br/>'),
                  }}
                />
              </details>
            </div>
          </div>
        )}
      </div>

      {/* Inline Styles (move to CSS file in production) */}
      <style jsx>{`
        .sign-language-detector {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .detector-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 30px;
        }

        .detector-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .detector-header h2 {
          color: #2c3e50;
          margin-bottom: 10px;
        }

        .status-badge {
          display: inline-block;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 14px;
          margin-top: 10px;
        }

        .status-badge.offline {
          background: #fee;
          color: #c33;
        }

        .upload-options {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-bottom: 20px;
        }

        .upload-button,
        .webcam-button,
        .predict-button,
        .reset-button,
        .capture-button {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .upload-button,
        .webcam-button {
          background: #3498db;
          color: white;
        }

        .upload-button:hover,
        .webcam-button:hover {
          background: #2980b9;
        }

        .predict-button {
          background: #27ae60;
          color: white;
          flex: 1;
        }

        .predict-button:hover:not(:disabled) {
          background: #229954;
        }

        .predict-button:disabled {
          background: #95a5a6;
          cursor: not-allowed;
        }

        .reset-button {
          background: #e74c3c;
          color: white;
        }

        .reset-button:hover {
          background: #c0392b;
        }

        .webcam-container {
          text-align: center;
          margin: 20px 0;
        }

        .webcam-container video {
          max-width: 100%;
          border-radius: 8px;
          margin-bottom: 10px;
        }

        .capture-button {
          background: #f39c12;
          color: white;
        }

        .preview-container,
        .annotated-image-container {
          text-align: center;
          margin: 20px 0;
        }

        .preview-image,
        .annotated-image {
          max-width: 100%;
          max-height: 400px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .action-buttons {
          display: flex;
          gap: 15px;
          margin: 20px 0;
        }

        .loading-container {
          text-align: center;
          padding: 30px;
        }

        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto 15px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-container {
          background: #fee;
          border: 1px solid #fcc;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          color: #c33;
        }

        .results-container {
          margin-top: 30px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .prediction-details {
          display: grid;
          gap: 15px;
          margin: 20px 0;
        }

        .prediction-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .prediction-item .label {
          font-weight: 600;
          color: #555;
        }

        .prediction-item .value {
          font-size: 18px;
          font-weight: bold;
        }

        .prediction-item .sign {
          color: #27ae60;
          font-size: 24px;
        }

        .prediction-item .confidence {
          color: #3498db;
        }

        .full-prediction {
          margin-top: 20px;
        }

        .full-prediction details {
          cursor: pointer;
        }

        .markdown-content {
          padding: 15px;
          background: white;
          border-radius: 8px;
          margin-top: 10px;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default SignLanguageDetector;
