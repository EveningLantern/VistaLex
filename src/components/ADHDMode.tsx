
import { useState, useEffect } from 'react';
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { processDyslexiaText } from '@/lib/textProcessing';
import { cn } from '@/lib/utils';

type ADHDModeProps = {
  words: string[];
  isActive: boolean;
  colorTheme?: string;
  dyslexiaOptions?: {
    useDyslexicFont: boolean;
    boldFirstLetter: boolean;
    underlineVerbs: boolean;
    underlineComplexWords: boolean;
  };
};

// Base color palettes
const defaultColors = [
  'text-blue-500',
  'text-purple-500',
  'text-pink-500',
  'text-orange-500',
  'text-green-500',
  'text-indigo-500',
  'text-rose-500',
  'text-teal-500',
];

const protanopiaColors = [
  'text-yellow-500',
  'text-blue-500',
  'text-slate-700',
  'text-amber-500',
  'text-sky-500',
  'text-slate-600',
];

const deuteranopiaColors = [
  'text-blue-500',
  'text-amber-600',
  'text-indigo-600',
  'text-slate-700',
  'text-sky-600',
  'text-yellow-600',
];

const tritanopiaColors = [
  'text-red-500',
  'text-pink-600',
  'text-amber-600',
  'text-rose-600',
  'text-orange-600',
  'text-slate-800',
];

const highContrastColors = [
  'text-white',
  'text-yellow-300',
  'text-cyan-300',
  'text-rose-300',
];

const ADHDMode = ({ words, isActive, colorTheme = 'default', dyslexiaOptions }: ADHDModeProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [processedWords, setProcessedWords] = useState<string[]>([]);
  
  // Get color palette based on color theme
  const getColorPalette = () => {
    switch (colorTheme) {
      case 'protanopia':
        return protanopiaColors;
      case 'deuteranopia':
        return deuteranopiaColors;
      case 'tritanopia':
        return tritanopiaColors;
      case 'high-contrast':
        return highContrastColors;
      default:
        return defaultColors;
    }
  };
  
  // Reset state when switching modes or loading new text
  useEffect(() => {
    setCurrentIndex(0);
    setIsPlaying(true);
  }, [isActive, words]);
  
  // Process words for dyslexia if needed
  useEffect(() => {
    if (dyslexiaOptions && words.length > 0) {
      // Process each word individually with dyslexia options
      const processed = words.map(word => {
        const processedText = processDyslexiaText(word, {
          boldFirstLetter: dyslexiaOptions.boldFirstLetter,
          underlineVerbs: dyslexiaOptions.underlineVerbs,
          underlineComplexWords: dyslexiaOptions.underlineComplexWords
        });
        return processedText;
      });
      setProcessedWords(processed);
    } else {
      setProcessedWords(words);
    }
  }, [words, dyslexiaOptions]);
  
  useEffect(() => {
    if (!isActive || words.length === 0) return;
    
    // Get current words to display (3 at a time)
    const start = currentIndex;
    const end = Math.min(start + 3, words.length);
    setCurrentWords(processedWords.slice(start, end));
    
    // Auto-advance when playing
    let intervalId: number | undefined;
    
    if (isPlaying && currentIndex < words.length - 3) {
      intervalId = window.setInterval(() => {
        setCurrentIndex(prev => {
          const next = prev + 1;
          if (next >= words.length - 2) {
            setIsPlaying(false);
            return words.length - 3;
          }
          return next;
        });
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isActive, words, processedWords, currentIndex, isPlaying]);
  
  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };
  
  const handleNext = () => {
    setCurrentIndex(prev => Math.min(words.length - 3, prev + 1));
  };
  
  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };
  
  const handleRestart = () => {
    setCurrentIndex(0);
    setIsPlaying(true);
  };
  
  if (!isActive || words.length === 0) return null;
  
  const colorPalette = getColorPalette();
  
  return (
    <div className={cn(
      "h-full flex flex-col items-center justify-center overflow-hidden animate-fade-in",
      dyslexiaOptions?.useDyslexicFont && "dyslexia-friendly"
    )}>
      <div className="mb-8 flex flex-wrap justify-center gap-4">
        {currentWords.map((word, idx) => (
          <span 
            key={`${word}-${currentIndex + idx}`} 
            className={`adhd-word ${colorPalette[Math.floor(Math.random() * colorPalette.length)]}`}
            style={{ 
              animationDelay: `${idx * 0.2}s`, 
              animationDuration: `${2 + idx * 0.5}s` 
            }}
            dangerouslySetInnerHTML={{ __html: word }}
          />
        ))}
      </div>
      
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        
        <Button 
          size="icon" 
          onClick={togglePlayPause}
          variant={isPlaying ? "default" : "outline"}
          className="h-12 w-12 rounded-full"
        >
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleNext}
          disabled={currentIndex >= words.length - 3}
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>
      
      {currentIndex >= words.length - 3 && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRestart}
          className="mt-4"
        >
          Start Over
        </Button>
      )}
      
      <div className="mt-6 text-xs text-muted-foreground">
        {currentIndex + 1}-{Math.min(currentIndex + 3, words.length)} of {words.length} words
      </div>
    </div>
  );
};

export default ADHDMode;
