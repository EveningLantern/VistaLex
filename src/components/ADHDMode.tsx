
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

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
    
    // Auto-advance every 2 seconds if there are more words
    const timer = setTimeout(() => {
      if (currentIndex + wordsPerGroup < words.length) {
        setCurrentIndex(prevIndex => prevIndex + wordsPerGroup);
      } else if (words.length > wordsPerGroup) {
        // Loop back to start when reaching the end
        setCurrentIndex(0);
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [currentIndex, words, isActive, wordsPerGroup]);
  
  const handlePrevGroup = () => {
    setCurrentIndex(prevIndex => Math.max(0, prevIndex - wordsPerGroup));
  };
  
  const handleNextGroup = () => {
    setCurrentIndex(prevIndex => Math.min(words.length - 1, prevIndex + wordsPerGroup));
  };
  
  if (!isActive || words.length === 0) {
    return null;
  }
  
  // Calculate progress percentage
  const progress = words.length <= wordsPerGroup 
    ? 100 
    : Math.min(100, (currentIndex / (words.length - wordsPerGroup)) * 100);
  
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
      
      <div className="mb-8">
        {displayWords.map((word, index) => (
          <span 
            key={index} 
            className={cn(
              "adhd-word",
              dyslexiaOptions.useDyslexicFont && "font-['OpenDyslexic']",
              dyslexiaOptions.boldFirstLetter && "first-letter:font-bold"
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
        <button 
          onClick={handlePrevGroup}
          disabled={currentIndex === 0}
          className={cn(
            "px-4 py-2 rounded-full bg-primary/20 text-primary-foreground",
            "hover:bg-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          Previous
        </button>
        <button 
          onClick={handleNextGroup}
          disabled={currentIndex + wordsPerGroup >= words.length}
          className={cn(
            "px-4 py-2 rounded-full bg-primary/20 text-primary-foreground",
            "hover:bg-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ADHDMode;
