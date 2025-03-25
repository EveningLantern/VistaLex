
import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, FileText, FileIcon, ImageIcon, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/sonner';

type FileUploadProps = {
  onTextExtracted: (text: string) => void;
};

const FileUpload = ({ onTextExtracted }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
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
    
    try {
      // In a real app, use proper libraries to extract text
      // For this demo, we'll simulate extraction
      const text = await simulateTextExtraction(file);
      onTextExtracted(text);
      toast.success('File processed successfully');
    } catch (error) {
      toast.error('Failed to process file', {
        description: 'There was an error processing your file.'
      });
      console.error('Error processing file:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const simulateTextExtraction = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      // Simulate processing time
      setTimeout(() => {
        // For this demo, return mock text based on file type
        if (file.type === 'application/pdf') {
          resolve(`This is sample text extracted from the PDF document "${file.name}". The accessibility features of VistaLex make text content more accessible to people with various visual, cognitive, and learning needs. This demonstration shows how the application can process documents and provide adjustable viewing options.`);
        } else if (file.type.includes('word')) {
          resolve(`This is sample text extracted from the Word document "${file.name}". VistaLex provides features like color themes for people with color blindness, dyslexia-friendly formatting, ADHD focus mode, and text-to-speech capabilities. These features ensure that everyone can access and engage with textual content according to their unique needs.`);
        } else {
          // For text files, use FileReader to get actual content
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve(e.target?.result as string || `Text extracted from ${file.name}`);
          };
          reader.readAsText(file);
        }
      }, 1500);
    });
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
            "file-drop-area",
            isDragging && "active"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <Upload className="h-10 w-10 text-primary/70 mb-3" />
            <h3 className="text-lg font-medium mb-1">Upload a document</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop a file, or click to browse
            </p>
            <Button onClick={handleButtonClick} className="animate-pulse-subtle">
              Choose File
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Supported formats: TXT, PDF, DOCX
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 border rounded-lg flex items-center justify-between glass animate-scale-in">
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
                {isProcessing ? 'Processing...' : 'Processed'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={clearFile}>
            <XCircle className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
