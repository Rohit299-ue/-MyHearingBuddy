// Mock authentication service

export const sendOTP = async (phoneNumber) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'OTP sent successfully',
      });
    }, 1000);
  });
};

export const verifyOTP = async (phoneNumber, otp) => {
  // Mock verification - accepts any 6-digit OTP
  return new Promise((resolve) => {
    setTimeout(() => {
      if (otp.length === 6) {
        resolve({
          success: true,
          message: 'OTP verified successfully',
          user: {
            phone: phoneNumber,
            id: Math.random().toString(36).substr(2, 9),
          },
        });
      } else {
        resolve({
          success: false,
          message: 'Invalid OTP',
        });
      }
    }, 1000);
  });
};
