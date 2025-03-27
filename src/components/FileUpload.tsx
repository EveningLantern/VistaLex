
import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, FileText, FileIcon, ImageIcon, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from '@/lib/toast';
import { extractTextFromFile } from '@/lib/textProcessing';
import { Progress } from '@/components/ui/progress';

type FileUploadProps = {
  onTextExtracted: (text: string) => void;
};

const FileUpload = ({ onTextExtracted }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState('');
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
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Unsupported file type', {
        description: 'Please upload a text, PDF, or Word document.'
      });
      return;
    }
    
    setFile(file);
    setIsProcessing(true);
    setProgress(10);
    
    try {
      // Different processing stages
      if (file.type === 'application/pdf') {
        setProcessingStage('Extracting text from PDF...');
      } else if (file.type.includes('word')) {
        setProcessingStage('Extracting text from Word document...');
      } else {
        setProcessingStage('Reading text file...');
      }
      
      // Initial processing started
      setProgress(30);
      
      // For PDFs, show extra stages for OCR if needed
      const onProgressUpdate = (stage: string, percent: number) => {
        setProcessingStage(stage);
        setProgress(percent);
      };
      
      // Use our enhanced utility to extract text from the file
      const extractedText = await extractTextFromFile(file);
      
      // Processing complete
      setProgress(100);
      setProcessingStage('Processing complete');
      
      onTextExtracted(extractedText);
      toast.success('File processed successfully');
    } catch (error) {
      toast.error('Failed to process file', {
        description: 'There was an error processing your file.'
      });
      console.error('Error processing file:', error);
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="w-full animate-fade-in">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".txt,.pdf,.docx"
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
              Supports PDF (including scanned documents), TXT, DOCX
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 border rounded-lg glass animate-scale-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              {file.type.includes('pdf') ? (
                <FileText className="h-8 w-8 text-primary mr-3" />
              ) : file.type.includes('word') ? (
                <FileIcon className="h-8 w-8 text-primary mr-3" />
              ) : (
                <ImageIcon className="h-8 w-8 text-primary mr-3" />
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
      )}
    </div>
  );
};

export default FileUpload;
