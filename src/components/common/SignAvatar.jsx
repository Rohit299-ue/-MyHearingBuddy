import { useState, useEffect } from 'react';
import avatarImg from '../../assets/girls avaiter.png';

const SignAvatar = ({ text, isPlaying }) => {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const letters = text.toUpperCase().split('').filter(char => /[A-Z]/.test(char));

  useEffect(() => {
    if (!isPlaying || letters.length === 0) {
      setCurrentLetterIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentLetterIndex((prev) => {
        if (prev >= letters.length - 1) {
          return 0;
        }
        return prev + 1;
      });
    }, 1000); // Change letter every 1 second

    return () => clearInterval(interval);
  }, [isPlaying, letters.length]);

  const currentLetter = letters[currentLetterIndex] || '';

  if (!isPlaying) {
    return (
      <div className="flex flex-col items-center justify-center">
        {/* Static Avatar with circular background */}
        <div className="relative">
          {/* Purple circular background */}
          <div className="w-80 h-80 bg-gradient-to-br from-purple-300 via-purple-200 to-purple-100 rounded-full flex items-center justify-center shadow-2xl">
            {/* Avatar Image */}
            <img 
              src={avatarImg}
              alt="Sign Language Avatar"
              className="w-72 h-72 object-cover rounded-full"
            />
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center">
            <span className="text-3xl">👋</span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-lg font-semibold">Ready to sign! 💕</p>
          <p className="text-gray-400 text-sm mt-1">Type text and press Play button</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Animated Avatar */}
      <div className="relative">
        {/* Animated purple circular background */}
        <div className="w-80 h-80 bg-gradient-to-br from-purple-400 via-purple-300 to-purple-200 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
          {/* Avatar Image with bounce */}
          <div className="animate-bounce">
            <img 
              src={avatarImg}
              alt="Sign Language Avatar"
              className="w-72 h-72 object-cover rounded-full"
            />
          </div>
        </div>

        {/* Floating Hand Sign Bubble */}
        <div className="absolute -top-6 -right-6 bg-white rounded-full p-5 shadow-2xl animate-bounce border-4 border-purple-300">
          <div className="text-5xl">
            {getHandSign(currentLetter)}
          </div>
        </div>

        {/* Sparkle effects - animated */}
        <div className="absolute top-8 left-4 text-4xl animate-ping">✨</div>
        <div className="absolute top-8 right-4 text-4xl animate-ping" style={{ animationDelay: '0.3s' }}>✨</div>
        <div className="absolute bottom-8 left-8 text-3xl animate-ping" style={{ animationDelay: '0.6s' }}>💫</div>
        <div className="absolute bottom-8 right-8 text-3xl animate-ping" style={{ animationDelay: '0.9s' }}>💫</div>

        {/* Floating hearts */}
        <div className="absolute top-1/4 -left-8 text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>💕</div>
        <div className="absolute top-1/4 -right-8 text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>💕</div>
      </div>

      {/* Current Letter Display */}
      <div className="mt-8 text-center">
        {/* Letter Badge */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white px-10 py-5 rounded-3xl shadow-2xl mb-4 animate-pulse">
          <div className="text-7xl font-bold">
            {currentLetter}
          </div>
        </div>
        
        {/* Progress Info */}
        <div className="bg-white rounded-2xl px-6 py-3 shadow-lg mb-4 inline-block">
          <p className="text-gray-700 text-base font-semibold">
            Letter {currentLetterIndex + 1} of {letters.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 justify-center mb-4">
          {letters.map((letter, index) => (
            <div
              key={index}
              className={`transition-all duration-500 ${
                index === currentLetterIndex
                  ? 'w-10 h-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg scale-110'
                  : index < currentLetterIndex
                  ? 'w-4 h-4 bg-green-500 rounded-full shadow-md'
                  : 'w-4 h-4 bg-gray-300 rounded-full'
              }`}
            />
          ))}
        </div>

        {/* Sign Description */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-purple-200 rounded-2xl px-6 py-3 inline-block shadow-md">
          <p className="text-purple-700 text-sm font-bold">
            🤟 Sign: {getSignName(currentLetter)}
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper function for hand signs
const getHandSign = (letter) => {
  const signs = {
    'A': '✊', 'B': '🖐️', 'C': '👌', 'D': '☝️', 'E': '✊',
    'F': '👌', 'G': '👈', 'H': '✌️', 'I': '🤙', 'J': '🤙',
    'K': '✌️', 'L': '👍', 'M': '✊', 'N': '✊', 'O': '👌',
    'P': '👇', 'Q': '👇', 'R': '✌️', 'S': '✊', 'T': '✊',
    'U': '✌️', 'V': '✌️', 'W': '🤟', 'X': '☝️', 'Y': '🤙',
    'Z': '☝️'
  };
  return signs[letter] || '✋';
};

// Helper function for sign names
const getSignName = (letter) => {
  const names = {
    'A': 'Closed Fist', 'B': 'Open Palm', 'C': 'OK Sign', 'D': 'Point Up',
    'E': 'Closed Fist', 'F': 'OK Sign', 'G': 'Point Left', 'H': 'Peace Sign',
    'I': 'Pinky Up', 'J': 'Pinky Up', 'K': 'Peace Sign', 'L': 'Thumbs Up',
    'M': 'Closed Fist', 'N': 'Closed Fist', 'O': 'OK Sign', 'P': 'Point Down',
    'Q': 'Point Down', 'R': 'Peace Sign', 'S': 'Closed Fist', 'T': 'Closed Fist',
    'U': 'Peace Sign', 'V': 'Peace Sign', 'W': 'Rock On', 'X': 'Point Up',
    'Y': 'Pinky Up', 'Z': 'Point Up'
  };
  return names[letter] || 'Hand Sign';
};

export default SignAvatar;
