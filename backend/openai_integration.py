"""
OpenAI Integration for Sign Language Detection
This file contains the OpenAI API integration that can be used with the main inference script.
Enhanced with smart word prediction and frequency-based completion.
"""

from openai import OpenAI
import os
from typing import Optional, List, Dict
import re

# Try to import pyttsx3, but make it optional for production environments
try:
    import pyttsx3
    TTS_AVAILABLE = True
except ImportError:
    TTS_AVAILABLE = False
    print("⚠️ pyttsx3 not available - Text-to-speech will be disabled")

class OpenAIIntegrator:
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize OpenAI client and text-to-speech engine
        Args:
            api_key: OpenAI API key. If None, will try to get from environment variable
        """
        # Set API key from environment variable
        if not api_key:
            api_key = os.getenv('OPENAI_API_KEY')
            if not api_key:
                raise ValueError("OpenAI API key not found. Please set OPENAI_API_KEY environment variable.")
        
        self.client = OpenAI(api_key=api_key)
        
        # Initialize text-to-speech engine (optional)
        self.tts_engine = None
        if TTS_AVAILABLE:
            try:
                self.tts_engine = pyttsx3.init()
                # Configure TTS settings
                self.tts_engine.setProperty('rate', 150)  # Speed of speech
                self.tts_engine.setProperty('volume', 0.9)  # Volume level (0.0 to 1.0)
                
                # Try to set a clear voice (optional)
                voices = self.tts_engine.getProperty('voices')
                if voices:
                    # Use the first available voice, you can modify this to select specific voice
                    self.tts_engine.setProperty('voice', voices[0].id)
            except Exception as e:
                print(f"⚠️ TTS initialization failed: {e}")
                self.tts_engine = None
        
        # Try to set a clear voice (optional)
        voices = self.tts_engine.getProperty('voices')
        if voices:
            # Use the first available voice, you can modify this to select specific voice
            self.tts_engine.setProperty('voice', voices[0].id)
        
        # Common word completions based on frequency
        self.common_completions = {
            # Most frequent English words and their completions
            'TH': ['the', 'that', 'this', 'they', 'them', 'then', 'there', 'think'],
            'AN': ['and', 'any', 'answer'],
            'WH': ['what', 'when', 'where', 'who', 'why', 'which', 'while'],
            'YOU': ['you', 'your', 'yours'],
            'HEL': ['help', 'hello'],
            'HAV': ['have', 'having'],
            'WOR': ['work', 'world', 'word', 'worry'],
            'GOO': ['good', 'goodbye'],
            'HOM': ['home'],
            'TIM': ['time'],
            'DAY': ['day'],
            'WAY': ['way'],
            'MAN': ['man', 'many'],
            'NEW': ['new', 'news'],
            'OLD': ['old'],
            'SEE': ['see', 'seem'],
            'HIM': ['him'],
            'TWO': ['two'],
            'HOW': ['how'],
            'ITS': ['its'],
            'WHO': ['who'],
            'OIL': ['oil'],
            'SIT': ['sit'],
            'SET': ['set'],
            'RUN': ['run'],
            'EAT': ['eat'],
            'FAR': ['far'],
            'SEA': ['sea'],
            'EYE': ['eye'],
            'CAR': ['car', 'care'],
            'BIG': ['big'],
            'BOX': ['box'],
            'YES': ['yes'],
            'YET': ['yet'],
            'JOB': ['job'],
            'LOT': ['lot', 'love'],
            'FEW': ['few'],
            'MAY': ['may'],
            'SAY': ['say'],
            'SHE': ['she'],
            'USE': ['use', 'used'],
            'HER': ['her', 'here'],
            'NOW': ['now'],
            'FIN': ['find', 'fine'],
            'ONL': ['only'],
            'HIS': ['his'],
            'HAD': ['had'],
            'LET': ['let'],
            'PUT': ['put'],
            'TOO': ['too', 'took'],
            'ANY': ['any'],
            'APP': ['apple', 'application'],
            'ASK': ['ask'],
            'BAD': ['bad'],
            'BED': ['bed'],
            'BOY': ['boy'],
            'BUY': ['buy'],
            'CAN': ['can', 'cannot'],
            'CUT': ['cut'],
            'DID': ['did'],
            'DOG': ['dog'],
            'END': ['end'],
            'GET': ['get'],
            'GOT': ['got'],
            'HAP': ['happy', 'happen'],
            'HEA': ['head', 'hear', 'heart', 'health'],
            'HUN': ['hungry', 'hundred'],
            'IMP': ['important'],
            'KNO': ['know'],
            'LAR': ['large'],
            'LEA': ['learn', 'leave'],
            'LIK': ['like'],
            'LIV': ['live'],
            'LOO': ['look'],
            'MAK': ['make'],
            'MEE': ['meet'],
            'MOR': ['more', 'morning'],
            'MOV': ['move'],
            'NEE': ['need'],
            'NIG': ['night'],
            'OPE': ['open'],
            'PLA': ['place', 'play'],
            'REA': ['read', 'ready', 'real'],
            'RIG': ['right'],
            'SCH': ['school'],
            'SMA': ['small'],
            'SOM': ['some', 'something'],
            'STA': ['start', 'state'],
            'STU': ['study', 'student'],
            'TAK': ['take'],
            'TEL': ['tell'],
            'THA': ['thank', 'that'],
            'THI': ['think', 'this'],
            'TRY': ['try'],
            'TUR': ['turn'],
            'UND': ['understand'],
            'VER': ['very'],
            'WAI': ['wait'],
            'WAN': ['want'],
            'WAT': ['watch', 'water'],
            'WEL': ['well', 'welcome'],
            'WIL': ['will'],
            'WIT': ['with', 'without'],
            'WRI': ['write'],
            'YEA': ['year', 'yeah'],
        }
    
    def speak_text(self, text: str):
        """
        Convert text to speech and play it
        Args:
            text: Text to be spoken
        """
        if not self.tts_engine:
            print(f"🔇 TTS not available (text: {text})")
            return
            
        try:
            print(f"🔊 Speaking: {text}")
            self.tts_engine.say(text)
            self.tts_engine.runAndWait()
        except Exception as e:
            print(f"❌ TTS Error: {str(e)}")
    
    def _clean_input_text(self, text: str) -> str:
        """
        Clean input text by removing excessive repeated characters and extra spaces
        Args:
            text: Raw input text
        Returns:
            Cleaned text
        """
        if not text:
            return text
        
        # Remove excessive repeated characters (more than 2 in a row)
        # HHHHEEEELLLLLLOOOO -> HELLO
        cleaned = re.sub(r'(.)\1{2,}', r'\1', text)
        
        # Remove excessive spaces
        cleaned = re.sub(r'\s+', ' ', cleaned)
        
        # Strip leading/trailing spaces
        cleaned = cleaned.strip()
        
        return cleaned
    
    def _predict_word_locally(self, partial_word: str) -> str:
        """
        Predict word completion using local frequency-based dictionary
        Args:
            partial_word: Partial word to complete
        Returns:
            Most likely completion
        """
        partial_upper = partial_word.upper()
        
        # Direct match
        if partial_upper in self.common_completions:
            return self.common_completions[partial_upper][0]  # Return most common
        
        # Prefix match
        for key, completions in self.common_completions.items():
            if key.startswith(partial_upper) and len(partial_upper) >= 2:
                return completions[0]
        
        # Fallback: return original
        return partial_word
    
    def _try_local_completion(self, text: str) -> str:
        """
        Try to complete text using local frequency-based predictions
        Args:
            text: Input text to complete
        Returns:
            Completed text or original if no completion found
        """
        words = text.strip().split()
        if not words:
            return text
        
        # Check if last word is incomplete (common pattern)
        last_word = words[-1].upper()
        
        # Try to complete the last word
        completed_word = self._predict_word_locally(last_word)
        
        if completed_word.upper() != last_word:
            # Replace last word with completion
            words[-1] = completed_word.lower()
            completed_text = ' '.join(words)
            # Capitalize first letter
            if completed_text:
                completed_text = completed_text[0].upper() + completed_text[1:] if len(completed_text) > 1 else completed_text.upper()
            return completed_text
        
        return text
    
    def _clean_completion(self, original: str, completed: str) -> str:
        """
        Clean the completion to ensure it doesn't add unnecessary extra content
        Args:
            original: Original partial text
            completed: AI completed text
        Returns:
            Cleaned completion
        """
        # Convert to lowercase for comparison
        original_lower = original.lower().strip()
        completed_lower = completed.lower().strip()
        
        # If the completion is much longer than expected, truncate it
        original_words = original_lower.split()
        completed_words = completed_lower.split()
        
        # Allow at most 2 additional words beyond the original
        max_additional_words = 2
        if len(completed_words) > len(original_words) + max_additional_words:
            # Truncate to reasonable length
            truncated_words = completed_words[:len(original_words) + max_additional_words]
            completed = ' '.join(truncated_words)
        
        # Capitalize first letter
        if completed:
            completed = completed[0].upper() + completed[1:] if len(completed) > 1 else completed.upper()
        
        return completed
    
    def complete_sentence(self, partial_text: str) -> str:
        """
        Send partial text to OpenAI to complete the sentence with smart word prediction
        Args:
            partial_text: The partial sentence from sign language detection
        Returns:
            Completed sentence from OpenAI
        """
        try:
            # Clean the input text first
            cleaned_text = self._clean_input_text(partial_text)
            print(f"🧹 Cleaned text: '{cleaned_text}'")
            
            # If text is too messy or empty after cleaning, return a helpful message
            if not cleaned_text or len(cleaned_text) < 2:
                result = "Please try again with clearer gestures"
                self.speak_text(result)
                return result
            
            # First, try local prediction for quick common words
            local_prediction = self._try_local_completion(cleaned_text)
            if local_prediction != cleaned_text:
                print(f"🔍 Local prediction: {local_prediction}")
                self.speak_text(local_prediction)
                return local_prediction
            
            # If local prediction doesn't help, use OpenAI
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system", 
                        "content": """You are an intelligent word completion assistant for sign language input. Your job is to predict and complete incomplete words and sentences.

                        CORE RULES:
                        - ONLY complete the given text, do NOT add extra words or sentences
                        - Focus on completing the LAST incomplete word first
                        - If all words seem complete, return the text as-is
                        - Fix obvious spelling errors
                        - Use common, everyday words (avoid rare/technical terms)
                        - Consider context from previous words
                        - If input seems garbled or unclear, try to find the intended word
                        
                        WORD PREDICTION STRATEGIES:
                        1. Complete partial words based on common patterns
                        2. Prioritize high-frequency English words
                        3. Consider word context and grammar
                        4. Avoid uncommon or technical vocabulary
                        5. If multiple completions possible, choose the most common one
                        6. Clean up garbled input to find intended words
                        
                        EXAMPLES:
                        Input: "I WANT TO GO TO TH" → Output: "I want to go to the"
                        Input: "HOW AR YOU" → Output: "How are you"
                        Input: "WHAT IS YOUR NAM" → Output: "What is your name"
                        Input: "I AM HUNDR" → Output: "I am hungry" (not "hundred")
                        Input: "CAN YOU HEL" → Output: "Can you help"
                        Input: "GOOD MORN" → Output: "Good morning"
                        Input: "THANK Y" → Output: "Thank you"
                        Input: "HELO" → Output: "Hello"
                        
                        FREQUENCY-BASED COMPLETION:
                        - "TH" → "the" (most common)
                        - "AN" → "and" (very common)
                        - "YOU" → complete as-is
                        - "WH" → "what", "when", "where" (choose based on context)
                        - "HEL" → "help" (more common than "hello" in most contexts)
                        
                        Return ONLY the completed text, nothing else."""
                    },
                    {
                        "role": "user", 
                        "content": cleaned_text
                    }
                ],
                max_tokens=30,  # Reduced to prevent adding extra words
                temperature=0.1,  # Very low temperature for consistent, predictable completions
                frequency_penalty=0.5,  # Reduce repetition
                presence_penalty=0.3   # Encourage diverse but relevant completions
            )
            
            completed_sentence = response.choices[0].message.content.strip()
            
            # Additional post-processing to ensure we don't add extra content
            completed_sentence = self._clean_completion(cleaned_text, completed_sentence)
            
            # Speak the completed sentence
            self.speak_text(completed_sentence)
            
            return completed_sentence
            
        except Exception as e:
            # Fallback to local prediction if OpenAI fails
            try:
                cleaned_text = self._clean_input_text(partial_text)
                local_fallback = self._try_local_completion(cleaned_text)
                if local_fallback != cleaned_text and cleaned_text:
                    print(f"🔄 Using local fallback: {local_fallback}")
                    self.speak_text(local_fallback)
                    return local_fallback
            except:
                pass
            
            error_msg = f"Error: {str(e)}"
            print(f"❌ OpenAI Error: {error_msg}")
            return partial_text  # Return original if all fails

# Simple function for easy import
def process_text(text: str) -> str:
    """
    Simple function to process text with OpenAI and speak the result
    Args:
        text: The text to process
    Returns:
        Completed sentence
    """
    try:
        ai = OpenAIIntegrator()
        return ai.complete_sentence(text)
    except Exception as e:
        error_msg = f"OpenAI Error: {str(e)}"
        print(f"❌ {error_msg}")
        return error_msg

# Example usage:
if __name__ == "__main__":
    # Test the integration
    try:
        ai = OpenAIIntegrator()
        
        # Test sentence completion with new smart prediction
        test_texts = [
            "HELLO WOR",      # Should complete to "Hello world"
            "I WANT TO GO TO TH",  # Should complete to "I want to go to the"
            "HOW AR YOU",     # Should complete to "How are you"
            "WHAT IS YOUR NAM",    # Should complete to "What is your name"
            "CAN YOU HEL",    # Should complete to "Can you help"
            "GOOD MORN",      # Should complete to "Good morning"
            "THANK Y",        # Should complete to "Thank you"
            "I AM HUN",       # Should complete to "I am hungry"
            "WH",             # Should complete to "What" (most common)
            "TH",             # Should complete to "The"
            "AN",             # Should complete to "And"
            "HHHHEEEELLLLLLOOOO",  # Should clean to "HELLO"
        ]
        
        for test_text in test_texts:
            print(f"\nTesting: '{test_text}'")
            result = ai.complete_sentence(test_text)
            print(f"Completed: '{result}'")
        
        print("\n✅ OpenAI integration test completed!")
        
    except Exception as e:
        print(f"❌ Setup error: {e}")
        print("Make sure to install required packages:")
        print("pip install openai pyttsx3")