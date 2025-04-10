
import { EmotionDetector } from '@/components/EmotionDetector';

export default function EmotionDetectionPage() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Emotion Detection</h1>
      <p className="text-muted-foreground mb-8">
        Our AI analyzes your facial expressions in real-time
      </p>
      <EmotionDetector />
    </main>
  );
}
