import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { sendOTP, verifyOTP } from '../services/authService';
import { validatePhoneNumber, validateOTP } from '../utils/validators';
import Loader from '../components/common/Loader';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login } = useApp();

  const [step, setStep] = useState('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ================= HANDLERS =================

  const handleSendOTP = async () => {
    const validation = validatePhoneNumber(phoneNumber);
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await sendOTP(phoneNumber);
      setStep('otp');
    } catch {
      setError('Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const otpValue = otp.join('');
    const validation = validateOTP(otpValue);

    if (!validation.isValid) {
      setError(validation.message);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await verifyOTP(phoneNumber, otpValue);
      if (res.success) {
        login(res.user);
        navigate('/home');
      } else {
        setError('Invalid OTP');
      }
    } catch {
      setError('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // auto focus next
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  // ================= UI =================

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 relative overflow-hidden transition-colors">

      {/* Decorative Background Elements */}
      {/* Top Left Dots Pattern */}
      <div className="absolute top-8 left-8 grid grid-cols-3 gap-2 opacity-30">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="w-2 h-2 bg-white rounded-full"></div>
        ))}
      </div>

      {/* Bottom Left Dots Pattern */}
      <div className="absolute bottom-8 left-8 grid grid-cols-5 gap-2 opacity-30">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="w-2 h-2 bg-white rounded-full"></div>
        ))}
      </div>

      {/* Bottom Right Dots Pattern */}
      <div className="absolute bottom-8 right-8 grid grid-cols-5 gap-2 opacity-30">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="w-2 h-2 bg-white rounded-full"></div>
        ))}
      </div>

      {/* Decorative Hand Signs */}
      {/* Top Left - ILY Sign */}
      <div className="absolute top-20 left-20 text-8xl opacity-20 text-purple-300">
        🤟
      </div>

      {/* Top Right - Peace Sign */}
      <div className="absolute top-32 right-24 text-8xl opacity-20 text-purple-300">
        ✌️
      </div>

      {/* Left Middle - Open Hand */}
      <div className="absolute left-16 top-1/2 transform -translate-y-1/2 text-8xl opacity-20 text-purple-300">
        🖐️
      </div>

      {/* Bottom Left - OK Sign */}
      <div className="absolute bottom-32 left-32 text-8xl opacity-20 text-purple-300">
        👌
      </div>

      {/* Bottom Right - Thumbs Up */}
      <div className="absolute bottom-24 right-32 text-8xl opacity-20 text-purple-300">
        👍
      </div>

      {/* Floating Icon Circles */}
      {/* Top Left - Users Icon */}
      <div className="absolute top-40 left-1/4 w-16 h-16 bg-purple-500/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl shadow-lg animate-float">
        👥
      </div>

      {/* Top Right - Book Icon */}
      <div className="absolute top-48 right-1/4 w-16 h-16 bg-pink-500/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl shadow-lg animate-float-slow">
        📖
      </div>

      {/* Bottom Left - Camera Icon */}
      <div className="absolute bottom-40 left-1/4 w-16 h-16 bg-purple-500/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl shadow-lg animate-float-fast">
        📷
      </div>

      {/* Bottom Right - Graduation Cap */}
      <div className="absolute bottom-48 right-1/4 w-16 h-16 bg-pink-500/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl shadow-lg animate-float">
        🎓
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-semibold hover:bg-white/30 transition flex items-center gap-2 z-10"
      >
        ← Back
      </button>

      {/* MAIN CARD */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl px-10 py-12 relative z-10">

        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="text-7xl mb-5">🤟</div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gray-900">My</span>
            <span className="text-purple-600">Hearing</span>
            <span className="text-pink-600">Buddy</span>
          </h1>
          <p className="text-gray-600 text-base font-medium">
            Break Barriers with Sign Language
          </p>
        </div>

        {/* ================= PHONE STEP ================= */}
        {step === 'phone' && (
          <div className="space-y-6">

            <div className="mb-6">
              <label className="block text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-xl">📱</span>
                Mobile Number
              </label>

              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(
                    e.target.value.replace(/\D/g, '').slice(0, 10)
                  );
                  setError('');
                }}
                placeholder="Enter 10-digit number"
                className="w-full h-16 px-5 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-gray-900 bg-white text-base transition-all"
                maxLength={10}
              />

              <p className="text-sm text-gray-500 mt-3">
                Enter 10-digit number (without +91)
              </p>
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}

            <button
              onClick={handleSendOTP}
              disabled={loading || phoneNumber.length !== 10}
              className="w-full h-16 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 transition-all mt-6"
            >
              {loading ? <Loader size="sm" /> : 'Send OTP'}
            </button>

            {/* OR Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-gray-500 font-semibold">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Google Sign In Button */}
            <button
              className="w-full h-16 rounded-xl border-2 border-gray-200 bg-white text-gray-700 text-base font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>
        )}

        {/* ================= OTP STEP ================= */}
        {step === 'otp' && (
          <div className="space-y-6">

            <div className="text-center mb-6">
              <p className="text-base text-gray-600">
                OTP sent to <span className="font-bold text-gray-900">+91 {phoneNumber}</span>
              </p>
            </div>

            {/* OTP BOXES */}
            <div className="grid grid-cols-6 gap-3 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) =>
                    handleOtpChange(index, e.target.value)
                  }
                  onKeyDown={(e) =>
                    handleOtpKeyDown(index, e)
                  }
                  maxLength={1}
                  className="h-14 text-center text-2xl font-bold text-gray-900 border-2 border-gray-300 bg-white rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                />
              ))}
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}

            <button
              onClick={handleVerifyOTP}
              disabled={loading || otp.some((d) => !d)}
              className="w-full h-16 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 transition-all mb-4"
            >
              {loading ? <Loader size="sm" /> : 'Verify & Continue'}
            </button>

            <button
              onClick={() => {
                setStep('phone');
                setOtp(['', '', '', '', '', '']);
                setError('');
              }}
              className="w-full text-purple-600 text-base font-semibold hover:text-purple-700"
            >
              Change Number
            </button>
          </div>
        )}

        {/* DEMO INFO */}
        <div className="mt-8 bg-purple-50 border border-purple-100 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-purple-700">
            <span className="text-xl">🛡️</span>
            <p className="text-sm font-semibold">
              Your data is safe and secure with us
            </p>
          </div>
        </div>

        {/* Additional Demo Info */}
        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
          <p className="text-sm text-blue-700 font-semibold">
            💡 Demo Mode: Use any 10-digit number & OTP
          </p>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;