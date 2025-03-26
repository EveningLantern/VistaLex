
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ADHDModeProps = {
  words: string[];
  isActive: boolean;
  colorTheme: string;
  dyslexiaOptions: {
    useDyslexicFont: boolean;
    boldFirstLetter: boolean;
    underlineVerbs: boolean;
    underlineComplexWords: boolean;
  };
  textFormatting?: {
    letterSpacing: string;
    lineHeight: string;
    paragraphSpacing: string;
  };
};

const ADHDMode = ({ 
  words, 
  isActive,
  colorTheme,
  dyslexiaOptions,
  textFormatting = {
    letterSpacing: 'normal',
    lineHeight: 'normal',
    paragraphSpacing: 'normal'
  }
}: ADHDModeProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayWords, setDisplayWords] = useState<string[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  
  // Set how many words to display at once (3 is a good default)
  const wordsPerGroup = 3;
  
  useEffect(() => {
    if (!isActive) return;
    
    setCurrentIndex(0);
  }, [words, isActive]);
  
  useEffect(() => {
    if (!isActive || words.length === 0) {
      setDisplayWords([]);
      return;
    }
    
    // Get the current group of words
    const startIndex = currentIndex;
    const endIndex = Math.min(startIndex + wordsPerGroup, words.length);
    const currentWords = words.slice(startIndex, endIndex);
    
    setDisplayWords(currentWords);
    
    // Auto-advance every 2 seconds if there are more words and not paused
    if (!isPaused) {
      const timer = setTimeout(() => {
        if (currentIndex + wordsPerGroup < words.length) {
          setCurrentIndex(prevIndex => prevIndex + wordsPerGroup);
        } else if (words.length > wordsPerGroup) {
          // Loop back to start when reaching the end
          setCurrentIndex(0);
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [currentIndex, words, isActive, wordsPerGroup, isPaused]);
  
  const handlePrevGroup = () => {
    setCurrentIndex(prevIndex => Math.max(0, prevIndex - wordsPerGroup));
  };
  
  const handleNextGroup = () => {
    setCurrentIndex(prevIndex => Math.min(words.length - 1, prevIndex + wordsPerGroup));
  };
  
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  
  if (!isActive || words.length === 0) {
    return null;
  }
  
  // Calculate progress percentage
  const progress = words.length <= wordsPerGroup 
    ? 100 
    : Math.min(100, (currentIndex / (words.length - wordsPerGroup)) * 100);
  
  // Get color classes for words based on the color theme
  const getWordColors = (index: number) => {
    const colors = {
      default: ["text-blue-500", "text-indigo-600", "text-purple-500"],
      protanopia: ["text-blue-600", "text-amber-700", "text-blue-800"],
      deuteranopia: ["text-amber-600", "text-orange-700", "text-amber-800"],
      tritanopia: ["text-red-600", "text-red-700", "text-red-800"],
      "high-contrast": ["text-white", "text-white", "text-white"]
    };
    
    const themeKey = colorTheme as keyof typeof colors;
    const themeColors = colors[themeKey] || colors.default;
    return themeColors[index % themeColors.length];
  };
  
  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-[60vh] p-8 rounded-lg transition-all duration-300",
      "glass-darker shadow-lg border border-border/30",
      colorTheme && colorTheme !== 'default' && colorTheme,
      `letter-spacing-${textFormatting.letterSpacing}`
    )}>
      <div className="relative w-full h-2 bg-muted mb-8 rounded-full overflow-hidden">
        <div 
          className="absolute h-full bg-primary" 
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="mb-8 flex flex-col items-center justify-center">
        {displayWords.map((word, index) => (
          <span 
            key={index} 
            className={cn(
              "adhd-word",
              dyslexiaOptions.useDyslexicFont && "font-['OpenDyslexic']",
              dyslexiaOptions.boldFirstLetter && "first-letter:font-bold",
              colorTheme === "high-contrast" ? "text-white" : getWordColors(index)
            )}
            style={{
              animationDelay: `${index * 0.2}s`,
            }}
          >
            {word}
          </span>
        ))}
      </div>
      
      <div className="flex gap-4 mt-4">
        <Button 
          onClick={handlePrevGroup}
          disabled={currentIndex === 0}
          variant={colorTheme === "high-contrast" ? "outline" : "secondary"}
          size="icon"
          className={cn(
            "rounded-full",
            colorTheme === "high-contrast" && "border-white text-white hover:bg-white/20"
          )}
        >
          <SkipBack className="h-5 w-5" />
        </Button>
        
        <Button 
          onClick={togglePause}
          variant={colorTheme === "high-contrast" ? "outline" : "secondary"}
          size="icon"
          className={cn(
            "rounded-full",
            colorTheme === "high-contrast" && "border-white text-white hover:bg-white/20"
          )}
        >
          {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
        </Button>
        
        <Button 
          onClick={handleNextGroup}
          disabled={currentIndex + wordsPerGroup >= words.length}
          variant={colorTheme === "high-contrast" ? "outline" : "secondary"}
          size="icon"
          className={cn(
            "rounded-full",
            colorTheme === "high-contrast" && "border-white text-white hover:bg-white/20"
          )}
        >
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ADHDMode;
