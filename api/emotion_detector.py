import cv2
import numpy as np
from deepface import DeepFace

class EmotionDetector:
    def __init__(self):
        self.emotion_labels = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral']
        
    def detect_emotion(self, image_bytes: bytes) -> dict:
        try:
            # Convert bytes to OpenCV image
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            # Analyze emotion
            results = DeepFace.analyze(img, actions=['emotion'], enforce_detection=False)
            
            if isinstance(results, list):
                results = results[0]
                
            return {
                "dominant_emotion": results["dominant_emotion"],
                "emotions": results["emotion"],
                "success": True
            }
        except Exception as e:
            return {
                "error": str(e),
                "success": False
            }