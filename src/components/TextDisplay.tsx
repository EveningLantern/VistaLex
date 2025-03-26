
import { useState, useEffect, useRef } from 'react';
import { processDyslexiaText } from '@/lib/textProcessing';
import { cn } from '@/lib/utils';

type TextDisplayProps = {
  text: string;
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

const TextDisplay = ({ 
  text, 
  colorTheme,
  dyslexiaOptions,
  textFormatting = {
    letterSpacing: 'normal',
    lineHeight: 'normal',
    paragraphSpacing: 'normal'
  }
}: TextDisplayProps) => {
  const [processedHtml, setProcessedHtml] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!text) {
      setProcessedHtml('');
      return;
    }
    
    // Process text based on dyslexia options
    const processedText = processDyslexiaText(text, {
      boldFirstLetter: dyslexiaOptions.boldFirstLetter,
      underlineVerbs: dyslexiaOptions.underlineVerbs,
      underlineComplexWords: dyslexiaOptions.underlineComplexWords
    });
    
    // Split by newlines and wrap in paragraphs with spacing class
    const paragraphClass = `mb-4 paragraph-spacing-${textFormatting.paragraphSpacing}`;
    const paragraphs = processedText.split('\n').map(para => 
      para.trim() ? `<p class="${paragraphClass}">${para}</p>` : '<br />'
    );
    
    setProcessedHtml(paragraphs.join(''));
  }, [text, dyslexiaOptions, textFormatting.paragraphSpacing]);
  
  return (
    <div className="w-full h-full">
      <div 
        ref={contentRef}
        className={cn(
          "prose prose-lg max-w-none p-8 rounded-lg transition-all duration-300 animate-fade-in text-content",
          dyslexiaOptions.useDyslexicFont && "dyslexia-friendly",
          colorTheme && colorTheme !== 'default' && colorTheme,
          `letter-spacing-${textFormatting.letterSpacing}`,
          `line-height-${textFormatting.lineHeight}`,
          "bg-white/80 backdrop-blur-sm shadow-sm border border-border/20"
        )}
        dangerouslySetInnerHTML={{ __html: processedHtml || '<p class="text-muted-foreground text-center italic">Enter or upload text to begin...</p>' }}
      />
    </div>
  );
};

export default TextDisplay;
