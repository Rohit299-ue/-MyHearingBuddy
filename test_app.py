"""
Quick test script to verify app.py works correctly
Run this before deploying to Hugging Face Spaces
"""

import os
import sys

def test_imports():
    """Test if all required packages can be imported"""
    print("🧪 Testing imports...")
    
    try:
        import gradio as gr
        print("✅ gradio imported")
    except ImportError as e:
        print(f"❌ gradio import failed: {e}")
        return False
    
    try:
        import cv2
        print("✅ opencv imported")
    except ImportError as e:
        print(f"❌ opencv import failed: {e}")
        return False
    
    try:
        import mediapipe as mp
        print("✅ mediapipe imported")
    except ImportError as e:
        print(f"❌ mediapipe import failed: {e}")
        return False
    
    try:
        import numpy as np
        print("✅ numpy imported")
    except ImportError as e:
        print(f"❌ numpy import failed: {e}")
        return False
    
    try:
        import pickle
        print("✅ pickle imported")
    except ImportError as e:
        print(f"❌ pickle import failed: {e}")
        return False
    
    try:
        from sklearn.ensemble import RandomForestClassifier
        print("✅ scikit-learn imported")
    except ImportError as e:
        print(f"❌ scikit-learn import failed: {e}")
        return False
    
    return True

def test_files():
    """Test if required model files exist"""
    print("\n📁 Testing required files...")
    
    required_files = [
        'app.py',
        'requirements.txt',
        'backend/model.p',
        'backend/hand_landmarker.task'
    ]
    
    all_exist = True
    for file_path in required_files:
        if os.path.exists(file_path):
            size = os.path.getsize(file_path)
            print(f"✅ {file_path} exists ({size:,} bytes)")
        else:
            print(f"❌ {file_path} NOT FOUND")
            all_exist = False
    
    return all_exist

def test_app_structure():
    """Test if app.py has correct structure"""
    print("\n🔍 Testing app.py structure...")
    
    try:
        with open('app.py', 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check for required functions
        required_items = [
            'def predict(',
            'def initialize_models(',
            'def create_interface(',
            'gr.Interface',
            'LABELS_DICT',
        ]
        
        all_found = True
        for item in required_items:
            if item in content:
                print(f"✅ Found: {item}")
            else:
                print(f"❌ Missing: {item}")
                all_found = False
        
        return all_found
        
    except Exception as e:
        print(f"❌ Error reading app.py: {e}")
        return False

def main():
    """Run all tests"""
    print("=" * 70)
    print("🚀 Testing Sign Language Detection App")
    print("=" * 70)
    
    # Test 1: Imports
    imports_ok = test_imports()
    
    # Test 2: Files
    files_ok = test_files()
    
    # Test 3: App structure
    structure_ok = test_app_structure()
    
    # Summary
    print("\n" + "=" * 70)
    print("📊 TEST SUMMARY")
    print("=" * 70)
    print(f"Imports:       {'✅ PASS' if imports_ok else '❌ FAIL'}")
    print(f"Files:         {'✅ PASS' if files_ok else '❌ FAIL'}")
    print(f"App Structure: {'✅ PASS' if structure_ok else '❌ FAIL'}")
    print("=" * 70)
    
    if imports_ok and files_ok and structure_ok:
        print("\n🎉 All tests passed! Ready to deploy to Hugging Face Spaces!")
        print("\n📝 Next steps:")
        print("1. Read HUGGINGFACE_DEPLOYMENT.md for deployment instructions")
        print("2. Upload files to Hugging Face Spaces")
        print("3. Wait for build to complete")
        print("4. Test your live app!")
        return True
    else:
        print("\n⚠️ Some tests failed. Please fix the issues before deploying.")
        if not imports_ok:
            print("\n💡 To install dependencies:")
            print("   pip install -r requirements.txt")
        if not files_ok:
            print("\n💡 Make sure model files are in the backend/ folder")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
