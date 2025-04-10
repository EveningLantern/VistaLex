
import { useState, useEffect, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from '@/lib/toast';
import Webcam from 'react-webcam';
import { loadFaceApiModels, detectFaceExpressions } from '@/lib/faceApi';

const EMOJIS = ["😀", "😣", "😞", "😵‍💫", "📸"];

const AttentionTracker = () => {
  const [currentEmojiIndex, setCurrentEmojiIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState("neutral");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cycle through emojis for the button
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEmojiIndex((prevIndex) => (prevIndex + 1) % EMOJIS.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Load face-api models when component mounts
  useEffect(() => {
    const loadModels = async () => {
      try {
        await loadFaceApiModels();
        setModelsLoaded(true);
        setError(null);
      } catch (err) {
        setError('Failed to load facial recognition models');
        console.error('Error loading face-api models:', err);
      }
    };

    loadModels();

    // Clean up when component unmounts or tracking stops
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  const handleButtonClick = () => {
    setDialogOpen(true);
  };

  const detectEmotionFromWebcam = useCallback(async () => {
    if (!webcamRef.current || !modelsLoaded) {
      setError('Webcam or face models not available');
      return;
    }

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        setError('Failed to capture image');
        return;
      }

      // Detect expressions using face-api.js
      const detectedEmotion = await detectFaceExpressions(imageSrc);
      
      if (detectedEmotion) {
        setCurrentEmotion(detectedEmotion);
        setError(null);
      } else {
        // Just set to neutral if no face detected, but don't show error
        // to avoid disrupting the user experience
        setCurrentEmotion('neutral');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  }, [modelsLoaded]);

  const startTracking = async () => {
    setDialogOpen(false);
    setIsLoading(true);
    
    try {
      // Initial detection
      await detectEmotionFromWebcam();
      
      // Start periodic detection
      detectionIntervalRef.current = setInterval(detectEmotionFromWebcam, 5000);
      setTracking(true);
      
      toast.success("Attention tracking started", {
        description: "Your emotions will now be tracked during study"
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start tracking');
      toast.error("Failed to start tracking", {
        description: "Could not initialize emotion detection"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stopTracking = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    setTracking(false);
    setAlertOpen(false);
    toast.info("Attention tracking stopped");
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  const handleStopClick = () => {
    setAlertOpen(true);
  };

  return (
    <>
      {/* Button in the header */}
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleButtonClick}
        className="relative h-9 w-9 overflow-hidden"
        title="Attention Tracking"
      >
        <span className="text-lg">{EMOJIS[currentEmojiIndex]}</span>
      </Button>

      {/* Dialog for starting tracking */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Attention Tracking</DialogTitle>
            <DialogDescription>
              Allow the app to track your attention and emotions during your study session.
              This helps analyze your focus patterns.
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-4">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: 'user' }}
              className="w-full rounded-md border"
              style={{ maxHeight: '200px', objectFit: 'cover' }}
              onUserMediaError={() => setError('Webcam access denied')}
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          
          <DialogFooter className="flex flex-row justify-between sm:justify-between">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={startTracking} disabled={isLoading || !modelsLoaded}>
              {isLoading ? 'Starting...' : 'Start Tracking'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation for stopping tracking */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Stop Attention Tracking?</AlertDialogTitle>
            <AlertDialogDescription>
              This will end your current attention tracking session. Any collected data will still be available.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={stopTracking}>Stop Tracking</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Display for current tracked emotion */}
      {tracking && (
        <div className="fixed bottom-4 right-4 bg-background/80 backdrop-blur-sm p-2 rounded-lg border shadow-sm flex items-center gap-2 z-50">
          <span className="text-sm font-medium">Current emotion:</span>
          <span className="text-primary font-bold capitalize">{currentEmotion}</span>
          <Button size="sm" variant="ghost" onClick={handleStopClick} className="ml-2">
            Stop
          </Button>
        </div>
      )}
    </>
  );
};

export default AttentionTracker;
