/**
 * Simple Sign Language Detector Component
 * Example usage of useSignLanguageDetection hook
 */

import { useState } from 'react';
import { useSignLanguageDetection } from '../hooks/useSignLanguageDetection';

const SimpleDetector = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const { detect, loading, error, result, spaceOnline } = useSignLanguageDetection();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDetect = async () => {
    if (selectedFile) {
      await detect(selectedFile);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>🤟 ASL Sign Detection</h2>
      
      {!spaceOnline && (
        <div style={{ background: '#fee', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
          ⚠️ Backend is offline
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ marginBottom: '15px' }}
      />

      {previewUrl && (
        <div style={{ marginBottom: '15px' }}>
          <img
            src={previewUrl}
            alt="Preview"
            style={{ maxWidth: '100%', borderRadius: '8px' }}
          />
        </div>
      )}

      <button
        onClick={handleDetect}
        disabled={!selectedFile || loading}
        style={{
          padding: '10px 20px',
          background: loading ? '#ccc' : '#27ae60',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Detecting...' : 'Detect Sign'}
      </button>

      {error && (
        <div style={{ marginTop: '15px', color: 'red' }}>
          ❌ Error: {error}
        </div>
      )}

      {result && result.success && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#f0f0f0', borderRadius: '8px' }}>
          <h3>Results:</h3>
          
          {result.annotatedImage && (
            <img
              src={result.annotatedImage}
              alt="Result"
              style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: '15px' }}
            />
          )}
          
          <div
            dangerouslySetInnerHTML={{
              __html: result.predictionText?.replace(/\n/g, '<br/>') || 'No prediction text',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SimpleDetector;
