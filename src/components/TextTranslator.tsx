
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Globe } from 'lucide-react';
import { translateTextWithGemini, INDIAN_LANGUAGES } from '@/lib/translateText';
import { toast } from '@/lib/toast';

interface TextTranslatorProps {
  text: string;
  onTranslated?: (translatedText: string) => void;
}

const TextTranslator = ({ text, onTranslated }: TextTranslatorProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  
  const handleTranslate = async () => {
    if (!text.trim()) {
      toast.warning('No text to translate', {
        description: 'Please enter or upload some text first'
      });
      return;
    }
    
    if (!selectedLanguage) {
      toast.warning('Please select a language', {
        description: 'Choose a target language for translation'
      });
      return;
    }
    
    setIsTranslating(true);
    toast.info(`Translating to ${selectedLanguage}...`, {
      description: 'This may take a moment depending on the length of the text'
    });
    
    try {
      const translatedText = await translateTextWithGemini(text, selectedLanguage);
      
      if (onTranslated) {
        onTranslated(translatedText);
      }
      
      toast.success('Text translated successfully', {
        description: `The text has been translated to ${selectedLanguage}`
      });
    } catch (error) {
      console.error('Error during translation:', error);
      toast.error('Failed to translate text', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsTranslating(false);
    }
  };
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {INDIAN_LANGUAGES.map((language) => (
              <SelectItem key={language.code} value={language.name}>
                {language.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button 
          onClick={handleTranslate}
          disabled={isTranslating || !text.trim() || !selectedLanguage}
          className="min-w-[120px]"
        >
          {isTranslating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Translating
            </>
          ) : (
            <>
              <Globe className="mr-2 h-4 w-4" />
              Translate
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default TextTranslator;
