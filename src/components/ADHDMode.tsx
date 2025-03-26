
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { processDyslexiaText } from '@/lib/textProcessing';

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
  const [processedWords, setProcessedWords] = useState<string[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  
  // Set how many words to display at once (3 is a good default)
  const wordsPerGroup = 3;
  
  // Process words with dyslexia settings
  useEffect(() => {
    if (!isActive || words.length === 0) return;
    
    const processed = words.map(word => {
      return processDyslexiaText(word, {
        boldFirstLetter: dyslexiaOptions.boldFirstLetter,
        underlineVerbs: dyslexiaOptions.underlineVerbs,
        underlineComplexWords: dyslexiaOptions.underlineComplexWords
      });
    });
    
    setProcessedWords(processed);
  }, [words, isActive, dyslexiaOptions]);
  
  useEffect(() => {
    if (!isActive) return;
    
    setCurrentIndex(0);
  }, [words, isActive]);
  
  useEffect(() => {
    if (!isActive || processedWords.length === 0) {
      setDisplayWords([]);
      return;
    }
    
    // Get the current group of words
    const startIndex = currentIndex;
    const endIndex = Math.min(startIndex + wordsPerGroup, processedWords.length);
    const currentWords = processedWords.slice(startIndex, endIndex);
    
    setDisplayWords(currentWords);
    
    // Auto-advance every 2 seconds if there are more words and not paused
    if (!isPaused) {
      const timer = setTimeout(() => {
        if (currentIndex + wordsPerGroup < processedWords.length) {
          setCurrentIndex(prevIndex => prevIndex + wordsPerGroup);
        } else if (processedWords.length > wordsPerGroup) {
          // Loop back to start when reaching the end
          setCurrentIndex(0);
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [currentIndex, processedWords, isActive, wordsPerGroup, isPaused]);
  
  const handlePrevGroup = () => {
    setCurrentIndex(prevIndex => Math.max(0, prevIndex - wordsPerGroup));
  };
  
  const handleNextGroup = () => {
    setCurrentIndex(prevIndex => Math.min(processedWords.length - 1, prevIndex + wordsPerGroup));
  };
  
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  
  if (!isActive || words.length === 0) {
    return null;
  }
  
  // Calculate progress percentage
  const progress = processedWords.length <= wordsPerGroup 
    ? 100 
    : Math.min(100, (currentIndex / (processedWords.length - wordsPerGroup)) * 100);
  
  // Get color classes for words based on the color theme
  const getWordColors = (index: number) => {
    // Multiple vibrant colors for each theme
    const colors = {
      default: [
        "text-blue-500", "text-indigo-600", "text-purple-500", 
        "text-pink-500", "text-red-500", "text-orange-500",
        "text-green-500", "text-teal-500", "text-cyan-500"
      ],
      protanopia: [
        "text-blue-600", "text-blue-800", "text-yellow-600", 
        "text-yellow-800", "text-amber-700", "text-amber-900"
      ],
      deuteranopia: [
        "text-amber-600", "text-orange-700", "text-amber-800",
        "text-blue-600", "text-blue-700", "text-blue-800" 
      ],
      tritanopia: [
        "text-red-600", "text-red-700", "text-red-800",
        "text-yellow-600", "text-yellow-700", "text-yellow-800"
      ],
      "high-contrast": ["text-white", "text-gray-200", "text-gray-100"]
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
          <div 
            key={index} 
            className={cn(
              "adhd-word",
              dyslexiaOptions.useDyslexicFont && "font-['OpenDyslexic']",
              colorTheme === "high-contrast" ? "text-white" : getWordColors(index + currentIndex)
            )}
            style={{
              animationDelay: `${index * 0.2}s`,
            }}
            dangerouslySetInnerHTML={{ __html: word }}
          />
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
          disabled={currentIndex + wordsPerGroup >= processedWords.length}
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
