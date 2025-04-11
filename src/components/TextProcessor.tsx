import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FileText, Text, Settings, LogOut, BookOpen, ScanText, Globe } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import AccessibilitySettings from '@/components/AccessibilitySettings';
import TextDisplay from '@/components/TextDisplay';
import ADHDMode from '@/components/ADHDMode';
import ReadAloud from '@/components/ReadAloud';
import TextFormatting from '@/components/TextFormatting';
import TextTranslator from '@/components/TextTranslator';
import { EmotionDetector } from '@/components/EmotionDetector';
import { processADHDText } from '@/lib/textProcessing';
import { summarizeTextWithGemini } from '@/lib/summarizeText';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { Link } from 'react-router-dom';
import OCRButton from './OCRButton';

const TextProcessor = () => {
  const [text, setText] = useState('');
  const [processedWords, setProcessedWords] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeLeftTab, setActiveLeftTab] = useState("text");
  const [isSummarizing, setIsSummarizing] = useState(false);
  
  const { user, signOut } = useAuth();
  const { colorTheme, adhdMode, dyslexiaSettings, textFormatting, updateTextFormatting } = useUserPreferences();

  useEffect(() => {
    if (text) {
      setProcessedWords(processADHDText(text));
    } else {
      setProcessedWords([]);
    }
  }, [text]);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  
  const handleTextExtracted = (extractedText: string) => {
    setText(extractedText);
    toast.success('Text extracted successfully', {
      description: 'The text has been processed and is ready for viewing'
    });
  };
  
  const handleClearText = () => {
    setText('');
    toast.info('Text cleared', {
      description: 'All content has been cleared'
    });
  };
  
  const handleToggleSettings = () => {
    setShowSettings(!showSettings);
  };
  
  const handleSummarize = async () => {
    if (!text.trim()) {
      toast.warning('No text to summarize', {
        description: 'Please enter or upload some text first'
      });
      return;
    }
    
    setIsSummarizing(true);
    toast.info('Summarizing text...', {
      description: 'This may take a moment depending on the length of the text'
    });
    
    try {
      const summary = await summarizeTextWithGemini(text);
      setText(summary);
      toast.success('Text summarized successfully', {
        description: 'The original text has been replaced with a summary'
      });
    } catch (error) {
      console.error('Error during summarization:', error);
      toast.error('Failed to summarize text', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsSummarizing(false);
    }
  };
  
  const processText = () => {
    if (!text.trim()) {
      toast.warning('No text to process', {
        description: 'Please enter or upload some text first'
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate processing with a slight delay
    setTimeout(() => {
      toast.success('Text processed successfully');
      setIsProcessing(false);
    }, 600);
  };
  
  const handleTranslated = (translatedText: string) => {
    setText(translatedText);
  };
  
  useEffect(() => {
    document.body.className = colorTheme;
    
    return () => {
      document.body.className = '';
    };
  }, [colorTheme]);
  
  return (
    <div className={cn(
      "container mx-auto p-4 md:p-6 pt-24",
      "grid grid-cols-1 lg:grid-cols-12 gap-6 h-full",
      colorTheme
    )}>
      <div className="lg:col-span-3 space-y-6">
        <div className="flex items-center justify-between">
          <Tabs value={activeLeftTab} onValueChange={setActiveLeftTab} className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <Text className="h-4 w-4" /> Text
                </TabsTrigger>
                <TabsTrigger value="file" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" /> File
                </TabsTrigger>
                <TabsTrigger value="ocr" className="flex items-center gap-2">
                  <ScanText className="h-4 w-4" /> OCR
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleToggleSettings}
                  className={showSettings ? "text-primary" : ""}
                >
                  <Settings className="h-5 w-5" />
                </Button>
                
                {user ? (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={signOut}
                    title="Sign out"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                  >
                    <Link to="/auth">Login</Link>
                  </Button>
                )}
              </div>
            </div>
            
            <div className="p-4 glass rounded-lg animate-fade-in">
              <TabsContent value="text" className="mt-0">
                <div className="space-y-4">
                  <Textarea 
                    placeholder="Enter your text here..."
                    className="min-h-[200px] resize-y"
                    value={text}
                    onChange={handleTextChange}
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      onClick={processText} 
                      disabled={!text.trim() || isProcessing}
                      className="flex-1 min-w-[120px]"
                    >
                      {isProcessing ? 'Processing...' : 'Process Text'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleClearText}
                      disabled={!text.trim()}
                      className="flex-grow-0"
                    >
                      Clear
                    </Button>
                  </div>
                  
                  {text.trim() && (
                    <Button
                      onClick={handleSummarize}
                      disabled={isSummarizing}
                      className="w-full flex items-center gap-2"
                      variant="secondary"
                    >
                      <BookOpen className="h-4 w-4" />
                      {isSummarizing ? 'Summarizing...' : 'Summarize Text'}
                    </Button>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="file" className="mt-0">
                <FileUpload onTextExtracted={handleTextExtracted} />
                
                {text.trim() && (
                  <div className="mt-4">
                    <Button
                      onClick={handleSummarize}
                      disabled={isSummarizing}
                      className="w-full flex items-center gap-2"
                      variant="secondary"
                    >
                      <BookOpen className="h-4 w-4" />
                      {isSummarizing ? 'Summarizing...' : 'Summarize Text'}
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="ocr" className="mt-0">
                <div className="space-y-4">
                  <div className="text-center p-4 border border-dashed rounded-lg">
                    <ScanText className="h-10 w-10 text-primary mx-auto mb-2" />
                    <h3 className="font-medium mb-1">Extract Text from Images</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Use OCR to extract text from images or scanned documents
                    </p>
                    <OCRButton onTextExtracted={handleTextExtracted} />
                  </div>
                  
                  {text.trim() && (
                    <div className="mt-4">
                      <Button
                        onClick={handleSummarize}
                        disabled={isSummarizing}
                        className="w-full flex items-center gap-2"
                        variant="secondary"
                      >
                        <BookOpen className="h-4 w-4" />
                        {isSummarizing ? 'Summarizing...' : 'Summarize Text'}
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
        
        {showSettings && (
          <div className="animate-scale-in">
            <AccessibilitySettings isLoggedIn={!!user} />
          </div>
        )}

        <div className="glass rounded-lg p-4 animate-fade-in">
          <h3 className="text-sm font-medium mb-3">Text-to-Speech</h3>
          <ReadAloud text={text} />
        </div>
        
        <div className="glass rounded-lg p-4 animate-fade-in">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            Translate
          </h3>
          <TextTranslator text={text} onTranslated={handleTranslated} />
        </div>
      </div>
      
      <div className="lg:col-span-6 min-h-[60vh]">
        {adhdMode ? (
          <ADHDMode 
            words={processedWords} 
            isActive={adhdMode}
            colorTheme={colorTheme}
            dyslexiaOptions={dyslexiaSettings}
            textFormatting={textFormatting}
          />
        ) : (
          <TextDisplay 
            text={text} 
            colorTheme={colorTheme}
            dyslexiaOptions={dyslexiaSettings}
            textFormatting={textFormatting}
          />
        )}
      </div>
      
      <div className="lg:col-span-3 space-y-6">
        {text && (
          <TextFormatting 
            onLetterSpacingChange={(value) => updateTextFormatting({...textFormatting, letterSpacing: value})}
            onLineHeightChange={(value) => updateTextFormatting({...textFormatting, lineHeight: value})}
            onParagraphSpacingChange={(value) => updateTextFormatting({...textFormatting, paragraphSpacing: value})}
          />
        )}
        
        <EmotionDetector />
      </div>
    </div>
  );
};

export default TextProcessor;
