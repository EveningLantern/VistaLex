
import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from '@/lib/toast';

const EMOJIS = ["😀", "😣", "😞", "😵‍💫", "📸"];

const AttentionTracker = () => {
  const [currentEmojiIndex, setCurrentEmojiIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState("happy");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cycle through emojis for the button
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEmojiIndex((prevIndex) => (prevIndex + 1) % EMOJIS.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Clean up video stream when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleButtonClick = async () => {
    try {
      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error("Camera access not supported", {
          description: "Your browser doesn't support camera access"
        });
        return;
      }

      // Request camera permissions first
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      
      streamRef.current = stream;
      
      // Show the dialog after permissions granted
      setDialogOpen(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error("Camera access denied", {
        description: "Please allow camera access to use emotion tracking"
      });
    }
  };

  const startTracking = () => {
    setDialogOpen(false);
    setTracking(true);
    toast.success("Attention tracking started", {
      description: "Your emotions will now be tracked during study"
    });
    
    // Simulate emotion detection (in a real app, this would use ML)
    const emotions = ["happy", "sad", "confused", "tired", "focused"];
    const emotionInterval = setInterval(() => {
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      setCurrentEmotion(randomEmotion);
    }, 5000);

    // Store the interval ID for cleanup
    return () => clearInterval(emotionInterval);
  };

  const stopTracking = () => {
    setTracking(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    toast.info("Attention tracking stopped");
  };

  const handleCancel = () => {
    setDialogOpen(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
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
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full rounded-md border"
              style={{ maxHeight: '200px', objectFit: 'cover' }}
            />
          </div>
          
          <DialogFooter className="flex flex-row justify-between sm:justify-between">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={startTracking}>Start Tracking</Button>
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
          <span className="text-primary font-bold">{currentEmotion}</span>
          <Button size="sm" variant="ghost" onClick={handleStopClick} className="ml-2">
            Stop
          </Button>
        </div>
      )}
    </>
  );
};

export default AttentionTracker;
