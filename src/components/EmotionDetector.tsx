'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Button } from './ui/button';
import { Smile, Camera, Eye, EyeOff } from 'lucide-react';
import * as faceapi from 'face-api.js';
import { toast } from '@/lib/toast';

export function EmotionDetector() {
  const webcamRef = useRef<Webcam>(null);
  const [emotion, setEmotion] = useState<string>('neutral');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isRealtimeMode, setIsRealtimeMode] = useState(false);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load models on mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models/tiny_face_detector'),
          faceapi.nets.faceExpressionNet.loadFromUri('/models/face_expression'),
        ]);
        console.log('Models loaded');
      } catch (err) {
        setError('Failed to load face-api models');
      }
    };
    
    loadModels();
    return () => stopRealtimeDetection(); // Cleanup
  }, []);

  const detectEmotion = useCallback(async () => {
    if (!webcamRef.current?.video) return;

    const video = webcamRef.current.video;
    const detections = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (!detections || !detections.expressions) {
      setEmotion('undetected');
      return;
    }

    const expressions = detections.expressions;
    const topEmotion = Object.entries(expressions).reduce((max, curr) =>
      curr[1] > max[1] ? curr : max
    );

    setEmotion(topEmotion[0]); // e.g., "happy"
  }, []);

  const toggleCamera = () => {
    setShowCamera(!showCamera);
    if (!showCamera) {
      setTimeout(() => detectEmotion(), 1000);
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
    detectionIntervalRef.current = setInterval(() => detectEmotion(), 2000);
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
              onClick={detectEmotion}
              variant="secondary"
              size="sm"
              className="flex-1"
              disabled={isLoading || isRealtimeMode}
            >
              Detect Once
            </Button>

            <Button
              onClick={toggleRealtimeMode}
              variant={isRealtimeMode ? 'destructive' : 'default'}
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
