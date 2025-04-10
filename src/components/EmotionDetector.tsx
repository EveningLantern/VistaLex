
'use client';
import { useCallback, useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { detectEmotion } from '@/lib/api';
import { Button } from './ui/button';
import { Smile, Camera, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/lib/toast';

export function EmotionDetector() {
  const webcamRef = useRef<Webcam>(null);
  const [emotion, setEmotion] = useState<string>('neutral');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isRealtimeMode, setIsRealtimeMode] = useState(false);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

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

      // Convert base64 to blob
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

  const toggleCamera = () => {
    setShowCamera(!showCamera);
    if (!showCamera) {
      // Start detection after a short delay to allow camera initialization
      setTimeout(() => captureAndDetect(), 1000);
    } else {
      stopRealtimeDetection();
    }
  };

  const toggleRealtimeMode = () => {
    if (isRealtimeMode) {
      stopRealtimeDetection();
    } else {
      startRealtimeDetection();
    }
  };

  const startRealtimeDetection = () => {
    setIsRealtimeMode(true);
    // Run emotion detection every 2 seconds
    detectionIntervalRef.current = setInterval(captureAndDetect, 2000);
    toast.success('Real-time emotion detection started');
  };

  const stopRealtimeDetection = () => {
    setIsRealtimeMode(false);
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    toast.info('Real-time emotion detection stopped');
  };

  return (
    <div className="flex flex-col gap-4 p-4 glass rounded-lg animate-fade-in">
      <h3 className="text-sm font-medium mb-1">Emotion Detection</h3>
      
      <Button 
        onClick={toggleCamera}
        variant="outline"
        className="w-full flex items-center gap-2"
      >
        <Camera className="h-4 w-4" />
        {showCamera ? 'Hide Camera' : 'Start Detection'}
      </Button>
      
      {showCamera && (
        <div className="space-y-2">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: 'user' }}
            className="rounded-lg w-full border border-border"
            onUserMediaError={() => setError('Webcam access denied')}
          />
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <div className="flex items-center gap-2 justify-center p-2 bg-background/50 rounded-md border">
            <Smile className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium capitalize">{emotion}</span>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={captureAndDetect}
              variant="secondary"
              size="sm"
              className="flex-1"
              disabled={isLoading || isRealtimeMode}
            >
              {isLoading ? 'Processing...' : 'Detect Once'}
            </Button>
            
            <Button
              onClick={toggleRealtimeMode}
              variant={isRealtimeMode ? "destructive" : "default"}
              size="sm"
              className="flex-1 flex items-center gap-2"
            >
              {isRealtimeMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {isRealtimeMode ? 'Stop Real-time' : 'Start Real-time'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
