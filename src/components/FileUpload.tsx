
import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, FileText, FileIcon, ImageIcon, XCircle, ScanText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from '@/lib/toast';
import { extractTextFromFile } from '@/lib/textProcessing';
import { Progress } from '@/components/ui/progress';
import OCRButton from './OCRButton';

type FileUploadProps = {
  onTextExtracted: (text: string) => void;
};

const FileUpload = ({ onTextExtracted }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState('');
  const [isScannedDocument, setIsScannedDocument] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const processFile = async (file: File) => {
    const allowedTypes = [
      'text/plain',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/bmp',
      'image/tiff'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Unsupported file type', {
        description: 'Please upload a text, PDF, Word document, or image file.'
      });
      return;
    }
    
    setFile(file);
    setIsProcessing(true);
    setProgress(10);
    setIsScannedDocument(false);
    
    try {
      // Different processing stages with better feedback
      if (file.type === 'application/pdf') {
        setProcessingStage('Analyzing PDF document...');
        // Progress simulation for better UX
        setTimeout(() => {
          setProgress(20);
          setProcessingStage('Extracting text from PDF pages...');
        }, 300);
      } else if (file.type.includes('word')) {
        setProcessingStage('Extracting text from Word document...');
      } else if (file.type.includes('image')) {
        setProcessingStage('Analyzing image...');
      } else {
        setProcessingStage('Reading text file...');
      }
      
      // Initial processing started
      setProgress(30);
      
      // Simulate additional progress for PDF files which take longer
      let progressInterval: NodeJS.Timeout | null = null;
      
      if (file.type === 'application/pdf' || file.type.includes('image')) {
        const simulateProgress = () => {
          setProgress(prev => {
            if (prev < 80) {
              return prev + 5;
            }
            return prev;
          });
        };
        
        // Simulate progress at intervals
        progressInterval = setInterval(simulateProgress, 500);
      }
      
      // Use our enhanced utility to extract text from the file
      const extractedText = await extractTextFromFile(file);
      
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      
      // Check if the result indicates a scanned document
      if (extractedText.includes('scanned document') || extractedText.includes('OCR feature')) {
        setIsScannedDocument(true);
        toast.info('Scanned document detected', {
          description: 'This appears to be a scanned document. Use OCR for better results.'
        });
      }
      
      // Processing complete
      setProgress(100);
      setProcessingStage('Processing complete');
      
      onTextExtracted(extractedText);
      
      if (extractedText.includes('No text could be extracted') || extractedText.includes('No text was detected')) {
        toast.warning('Limited text extraction', {
          description: 'The document may be scanned or have limited machine-readable text.'
        });
      } else {
        toast.success('Document processed successfully');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Failed to process file', {
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
        setProcessingStage('');
      }, 1000);
    }
  };
  
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const clearFile = () => {
    setFile(null);
    setIsScannedDocument(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="w-full animate-fade-in space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".txt,.pdf,.docx,.jpg,.jpeg,.png,.webp,.gif,.bmp,.tiff"
        className="hidden"
      />
      
      {!file ? (
        <div
          className={cn(
            "file-drop-area p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all",
            isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-accent/50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <Upload className="h-10 w-10 text-primary/70 mb-3" />
            <h3 className="text-lg font-medium mb-1">Upload a document</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop a file, or click to browse
            </p>
            <Button onClick={(e) => { e.stopPropagation(); handleButtonClick(); }} className="animate-pulse-subtle">
              Choose File
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Supports PDF, TXT, DOCX, and image files (JPG, PNG, etc.)
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 border rounded-lg glass animate-scale-in">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                {file.type.includes('pdf') ? (
                  <FileText className="h-8 w-8 text-primary mr-3" />
                ) : file.type.includes('word') ? (
                  <FileIcon className="h-8 w-8 text-primary mr-3" />
                ) : file.type.includes('image') ? (
                  <ImageIcon className="h-8 w-8 text-primary mr-3" />
                ) : (
                  <FileText className="h-8 w-8 text-primary mr-3" />
                )}
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {isProcessing ? processingStage || 'Processing...' : 'Processed'}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={clearFile} disabled={isProcessing}>
                <XCircle className="h-5 w-5" />
              </Button>
            </div>
            
            {isProcessing && (
              <div className="w-full">
                <Progress value={progress} className="h-2 mb-1" />
                <p className="text-xs text-muted-foreground text-right">
                  {progress}%
                </p>
              </div>
            )}
          </div>
          
          {/* Show OCR button if scanned document is detected */}
          {isScannedDocument && !isProcessing && (
            <div className="animate-slide-up">
              <OCRButton onTextExtracted={onTextExtracted} />
            </div>
          )}
        </div>
      )}
      
      {/* Always show OCR button as an alternative */}
      {!isProcessing && (
        <div className="mt-4 border-t pt-4">
          <p className="text-sm text-muted-foreground mb-2">
            Working with images or scanned documents?
          </p>
          <OCRButton onTextExtracted={onTextExtracted} />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
