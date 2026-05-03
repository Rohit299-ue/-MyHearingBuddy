/**
 * Hugging Face Gradio API Integration Service
 * Connects React frontend with Gradio backend deployed on HF Spaces
 */

const HF_SPACE_URL = 'https://rohitrohantripathy-sign-language-ml.hf.space';

/**
 * Convert image file to base64 string
 * @param {File} file - Image file from input
 * @returns {Promise<string>} Base64 encoded image
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Send image to Hugging Face Gradio API for prediction
 * @param {File|string} image - Image file or base64 string
 * @returns {Promise<Object>} Prediction result
 */
export const predictSignLanguage = async (image) => {
  try {
    // Convert image to base64 if it's a File object
    let imageData;
    if (image instanceof File) {
      imageData = await fileToBase64(image);
    } else {
      imageData = image;
    }

    // Gradio API endpoint format: /api/predict
    const response = await fetch(`${HF_SPACE_URL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [imageData], // Gradio expects data as array
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    // Gradio returns: { data: [annotated_image, prediction_text] }
    return {
      success: true,
      annotatedImage: result.data[0], // Base64 image with annotations
      predictionText: result.data[1], // Markdown text with prediction
      rawData: result,
    };
  } catch (error) {
    console.error('Hugging Face API Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Alternative method using Gradio Client (if needed)
 * This uses the Gradio client library format
 */
export const predictWithGradioClient = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('data', JSON.stringify([imageFile]));

    const response = await fetch(`${HF_SPACE_URL}/run/predict`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error('Gradio Client Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Check if Hugging Face Space is online
 * @returns {Promise<boolean>}
 */
export const checkSpaceStatus = async () => {
  try {
    const response = await fetch(`${HF_SPACE_URL}/`, {
      method: 'HEAD',
    });
    return response.ok;
  } catch (error) {
    console.error('Space status check failed:', error);
    return false;
  }
};

export default {
  predictSignLanguage,
  predictWithGradioClient,
  checkSpaceStatus,
};
