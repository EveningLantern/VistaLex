
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, Image, FileText, XCircle } from 'lucide-react';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';

type ImageOCRProps = {
  onTextExtracted: (text: string) => void;
  onClose: () => void;
};

const ImageOCR: React.FC<ImageOCRProps> = ({ onTextExtracted, onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const processImage = async (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Unsupported file type', {
        description: 'Please upload a JPG, PNG, WebP, or GIF image.'
      });
      return;
    }
    
    setImage(file);
    
    // Create image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    setIsProcessing(true);
    
    // Simulate OCR progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        extractTextFromImage(file);
      }
    }, 200);
  };
  
  const extractTextFromImage = async (file: File) => {
    try {
      // In a real app, we would call an OCR service here
      // For this demo, we'll simulate OCR by using Tesseract.js
      // const Tesseract = await import('tesseract.js');
      // const { data } = await Tesseract.recognize(file);
      // onTextExtracted(data.text);
      
      // Simulating OCR result for demo purposes
      setTimeout(() => {
        const simulatedText = "This is simulated OCR text extracted from the uploaded image. In a real application, this would be the actual text recognized from the image using an OCR service like Tesseract.js or a cloud OCR API.";
        onTextExtracted(simulatedText);
        toast.success('Text extracted from image');
        setIsProcessing(false);
        onClose();
      }, 1000);
      
    } catch (error) {
      console.error('Error extracting text from image:', error);
      toast.error('Failed to extract text from image');
      setIsProcessing(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImage(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processImage(e.target.files[0]);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Extract Text from Image</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <XCircle className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-4">
          {!image ? (
            <div
              className={cn(
                "border-2 border-dashed border-primary/40 rounded-lg p-8 transition-all duration-300 ease-in-out",
                isDragging && "border-primary bg-primary/5"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <Upload className="h-10 w-10 text-primary/70 mb-3" />
                <h3 className="text-lg font-medium mb-1">Upload an image</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop an image, or click to browse
                </p>
                <Button
                  onClick={() => document.getElementById('image-upload')?.click()}
                  className="animate-pulse-subtle"
                >
                  Choose Image
                </Button>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground mt-4">
                  Supported formats: JPG, PNG, WebP, GIF
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Extracting text...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 p-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            disabled={!image || isProcessing}
            onClick={() => image && extractTextFromImage(image)}
          >
            {isProcessing ? 'Processing...' : 'Extract Text'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageOCR;
