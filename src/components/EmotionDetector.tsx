'use client';
import { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { detectEmotion } from '@/lib/api';
import { Button } from './ui/button';

export function EmotionDetector() {
  const webcamRef = useRef<Webcam>(null);
  const [emotion, setEmotion] = useState<string>('neutral');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const captureAndDetect = useCallback(async () => {
    if (!webcamRef.current) {
      setError('Webcam not available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        setError('Failed to capture image');
        return;
      }

      // Convert base64 to blob (optimized)
      const blob = await fetch(imageSrc).then((res) => res.blob());

      // Call API
      const result = await detectEmotion(blob);

      if (result.success) {
        setEmotion(result.dominant_emotion);
      } else {
        setError(result.error || 'Emotion detection failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: 'user' }}
        className="rounded-lg"
        onUserMediaError={() => setError('Webcam access denied')}
      />
      
      <Button 
        onClick={captureAndDetect}
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Detect Emotion'}
      </Button>
      
      {error && <p className="text-red-500">{error}</p>}
      
      <div className="text-xl font-semibold">
        Detected Emotion: <span className="capitalize">{emotion}</span>
      </div>
    </div>
  );
}