
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FileText, Text, Settings, LogOut, Camera } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import AccessibilitySettings from '@/components/AccessibilitySettings';
import TextDisplay from '@/components/TextDisplay';
import ADHDMode from '@/components/ADHDMode';
import ReadAloud from '@/components/ReadAloud';
import TextFormatting from '@/components/TextFormatting';
import ImageOCR from '@/components/ImageOCR';
import { processADHDText } from '@/lib/textProcessing';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { Link } from 'react-router-dom';

const TextProcessor = () => {
  const [text, setText] = useState('');
  const [processedWords, setProcessedWords] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeLeftTab, setActiveLeftTab] = useState("text");
  const [showImageOCR, setShowImageOCR] = useState(false);
  
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
  
  // Text formatting handlers
  const handleLetterSpacingChange = (value: string) => {
    updateTextFormatting({
      ...textFormatting,
      letterSpacing: value
    });
  };
  
  const handleLineHeightChange = (value: string) => {
    updateTextFormatting({
      ...textFormatting,
      lineHeight: value
    });
  };
  
  const handleParagraphSpacingChange = (value: string) => {
    updateTextFormatting({
      ...textFormatting,
      paragraphSpacing: value
    });
  };
  
  // Apply color theme to body
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
      {/* Left Column - Input */}
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
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowImageOCR(true)}
                  title="Extract text from image"
                >
                  <Camera className="h-5 w-5" />
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
                  <div className="flex space-x-2">
                    <Button 
                      onClick={processText} 
                      disabled={!text.trim() || isProcessing}
                      className="w-full"
                    >
                      {isProcessing ? 'Processing...' : 'Process Text'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleClearText}
                      disabled={!text.trim()}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="file" className="mt-0">
                <FileUpload onTextExtracted={handleTextExtracted} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
        
        {/* Settings Panel - Show only when settings button is clicked */}
        {showSettings && (
          <div className="animate-scale-in">
            <AccessibilitySettings isLoggedIn={!!user} />
          </div>
        )}
      </div>
      
      {/* Middle Column - Text Display */}
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
      
      {/* Right Column - Text Formatting and Text-to-Speech */}
      <div className="lg:col-span-3 space-y-6">
        {/* Text Formatting Toolbar */}
        {text && (
          <TextFormatting 
            onLetterSpacingChange={handleLetterSpacingChange}
            onLineHeightChange={handleLineHeightChange}
            onParagraphSpacingChange={handleParagraphSpacingChange}
            onImageUploadClick={() => setShowImageOCR(true)}
          />
        )}
        
        {/* Text-to-Speech Controls */}
        <div className="glass rounded-lg p-4 animate-fade-in">
          <h3 className="text-sm font-medium mb-3">Text-to-Speech</h3>
          <ReadAloud text={text} />
        </div>
      </div>
      
      {/* Image OCR Modal */}
      {showImageOCR && (
        <ImageOCR 
          onTextExtracted={handleTextExtracted}
          onClose={() => setShowImageOCR(false)}
        />
      )}
    </div>
  );
};

export default TextProcessor;
