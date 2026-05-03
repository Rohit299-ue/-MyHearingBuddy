/**
 * Custom React Hook for Sign Language Detection
 * Simplifies integration with Hugging Face Gradio backend
 */

import { useState, useCallback } from 'react';
import { predictSignLanguage, checkSpaceStatus } from '../services/huggingfaceService';

export const useSignLanguageDetection = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [spaceOnline, setSpaceOnline] = useState(true);

  /**
   * Detect sign language from image
   * @param {File|string} image - Image file or base64 string
   * @returns {Promise<Object>} Detection result
   */
  const detect = useCallback(async (image) => {
    if (!image) {
      setError('No image provided');
      return null;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Check space status
      const isOnline = await checkSpaceStatus();
      setSpaceOnline(isOnline);

      if (!isOnline) {
        throw new Error('Backend is currently offline');
      }

      // Get prediction
      const prediction = await predictSignLanguage(image);

      if (prediction.success) {
        setResult(prediction);
        return prediction;
      } else {
        throw new Error(prediction.error || 'Detection failed');
      }
    } catch (err) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reset all states
   */
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setResult(null);
  }, []);

  /**
   * Check backend status
   */
  const checkStatus = useCallback(async () => {
    const isOnline = await checkSpaceStatus();
    setSpaceOnline(isOnline);
    return isOnline;
  }, []);

  return {
    detect,
    reset,
    checkStatus,
    loading,
    error,
    result,
    spaceOnline,
  };
};

export default useSignLanguageDetection;
