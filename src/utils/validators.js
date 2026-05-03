// Validation utility functions

export const validatePhoneNumber = (phone) => {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's exactly 10 digits
  if (cleaned.length !== 10) {
    return {
      isValid: false,
      message: 'Phone number must be 10 digits',
    };
  }
  
  // Check if it starts with a valid digit (6-9 for Indian numbers)
  if (!/^[6-9]/.test(cleaned)) {
    return {
      isValid: false,
      message: 'Phone number must start with 6, 7, 8, or 9',
    };
  }
  
  return {
    isValid: true,
    message: 'Valid phone number',
  };
};

export const validateOTP = (otp) => {
  // Remove any non-digit characters
  const cleaned = otp.replace(/\D/g, '');
  
  // Check if it's exactly 6 digits
  if (cleaned.length !== 6) {
    return {
      isValid: false,
      message: 'OTP must be 6 digits',
    };
  }
  
  return {
    isValid: true,
    message: 'Valid OTP',
  };
};

export const validateText = (text, maxLength = 50) => {
  if (!text || text.trim().length === 0) {
    return {
      isValid: false,
      message: 'Text cannot be empty',
    };
  }
  
  if (text.length > maxLength) {
    return {
      isValid: false,
      message: `Text cannot exceed ${maxLength} characters`,
    };
  }
  
  return {
    isValid: true,
    message: 'Valid text',
  };
};

export const validateURL = (url) => {
  try {
    new URL(url);
    return {
      isValid: true,
      message: 'Valid URL',
    };
  } catch (error) {
    return {
      isValid: false,
      message: 'Invalid URL format',
    };
  }
};
