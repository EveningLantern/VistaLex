from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from emotion_detector import EmotionDetector
import uvicorn

app = FastAPI()
detector = EmotionDetector()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/detect-emotion")
async def detect_emotion(file: UploadFile = File(...)):
    if not file.content_type.startswith('image/'):
        raise HTTPException(400, "File must be an image")
    
    image_bytes = await file.read()
    return detector.detect_emotion(image_bytes)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)