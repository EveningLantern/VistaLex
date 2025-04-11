
import { useState, useEffect } from 'react';
import TextDisplay from './TextDisplay';
import TextFormatting from './TextFormatting';
import FileUpload from './FileUpload';
import ReadAloud from './ReadAloud';
import { summarizeTextWithGemini } from '@/lib/summarizeText';
import TextTranslator from './TextTranslator';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { supabase } from '@/lib/supabase';
import { toast } from '@/lib/toast';
import UserStreak from './UserStreak';
import { useAuth } from '@/context/AuthContext';
import { useUserPreferences } from '@/context/UserPreferencesContext';

const TextProcessor = () => {
  const [processedText, setProcessedText] = useState<string>('');
  const [originalText, setOriginalText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [summarizedText, setSummarizedText] = useState<string>('');
  const { user } = useAuth();
  const { colorTheme, dyslexiaSettings, textFormatting } = useUserPreferences();

  // Reset error state when text changes
  useEffect(() => {
    if (processingError) {
      setProcessingError(null);
    }
  }, [originalText]);

  const handleTextExtracted = (content: string) => {
    setOriginalText(content);
    setProcessedText(content);
    setSummarizedText('');
  };

  const handleLetterSpacingChange = (value: string) => {
    // Handled by UserPreferencesContext
  };
  
  const handleLineHeightChange = (value: string) => {
    // Handled by UserPreferencesContext
  };
  
  const handleParagraphSpacingChange = (value: string) => {
    // Handled by UserPreferencesContext
  };

  const handleFormat = (formattedText: string) => {
    setProcessedText(formattedText);
  };

  const handleSummarize = async () => {
    if (!originalText || originalText.trim().length === 0) {
      toast.error("No text to summarize");
      return;
    }

    setIsProcessing(true);
    setProcessingError(null);

    try {
      const summaryResult = await summarizeTextWithGemini(originalText);
      
      if (summaryResult.startsWith('Error')) {
        throw new Error(summaryResult);
      }
      
      setSummarizedText(summaryResult);
      setProcessedText(summaryResult);
    } catch (error) {
      console.error('Summarization error:', error);
      setProcessingError(error instanceof Error ? error.message : 'Unknown error occurred');
      toast.error('Failed to summarize text', { 
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex justify-between items-center">
                <span>Text Tools</span>
                <UserStreak />
              </CardTitle>
              <CardDescription>Upload and process text for accessibility</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                  <TabsTrigger value="formatting">Format</TabsTrigger>
                </TabsList>
                <TabsContent value="upload" className="space-y-4">
                  <FileUpload onTextExtracted={handleTextExtracted} />
                </TabsContent>
                <TabsContent value="formatting" className="space-y-4">
                  <TextFormatting 
                    onLetterSpacingChange={handleLetterSpacingChange}
                    onLineHeightChange={handleLineHeightChange}
                    onParagraphSpacingChange={handleParagraphSpacingChange}
                  />
                </TabsContent>
              </Tabs>
              
              <div className="space-y-4 pt-4 border-t mt-4">
                <ReadAloud text={processedText} />
                <TextTranslator text={processedText} />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-8">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle>Processed Text</CardTitle>
              <CardDescription>
                {summarizedText ? 'Summarized content' : 'Your processed text will appear here'}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[calc(100%-5rem)] overflow-auto">
              <TextDisplay 
                text={processedText} 
                colorTheme={colorTheme} 
                dyslexiaOptions={dyslexiaSettings}
                textFormatting={textFormatting}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TextProcessor;
