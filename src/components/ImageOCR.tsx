
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, Image as ImageIcon, FileText, XCircle, Settings2 } from 'lucide-react';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createWorker } from 'tesseract.js';

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
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("upload");
  
  // OCR settings
  const [ocrSettings, setOcrSettings] = useState({
    language: 'eng',
    enhanceImage: true,
    recognizeHandwriting: false,
    detectOrientation: true,
    preserveInterwordSpaces: true,
    contentType: 'document' // 'document', 'handwriting', 'photo'
  });
  
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
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
  
  const preprocessImage = (
    canvas: HTMLCanvasElement, 
    ctx: CanvasRenderingContext2D, 
    img: HTMLImageElement
  ) => {
    // Check if we need to enhance the image
    if (!ocrSettings.enhanceImage) {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      return canvas;
    }
    
    // Draw image to canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Apply different preprocessing based on content type
    if (ocrSettings.contentType === 'document') {
      // Increase contrast and apply thresholding for documents
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const threshold = 128;
        const value = avg > threshold ? 255 : 0;
        data[i] = data[i + 1] = data[i + 2] = value;
      }
    } else if (ocrSettings.contentType === 'handwriting') {
      // Enhance handwriting by applying a different thresholding method
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Calculate luminance (weighted sum)
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        
        // Apply adaptive thresholding - better for handwriting
        const threshold = 180;
        const value = luminance < threshold ? 0 : 255;
        data[i] = data[i + 1] = data[i + 2] = value;
      }
    } else {
      // For photos, just increase contrast a bit
      for (let i = 0; i < data.length; i += 4) {
        // Increase contrast
        data[i] = Math.min(255, Math.max(0, (data[i] - 128) * 1.2 + 128));
        data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * 1.2 + 128));
        data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * 1.2 + 128));
      }
    }
    
    // Put the modified pixels back
    ctx.putImageData(imageData, 0, 0);
    return canvas;
  };
  
  const processImage = async (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff'];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Unsupported file type', {
        description: 'Please upload a JPG, PNG, WebP, GIF, BMP, or TIFF image.'
      });
      return;
    }
    
    setImage(file);
    
    // Create image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
      setActiveTab("preview");
    };
    reader.readAsDataURL(file);
  };
  
  const extractTextFromImage = async () => {
    try {
      if (!image || !previewUrl) {
        toast.error('No image selected');
        return;
      }
  
      setIsProcessing(true);
      setProgress(0);
  
      // Preprocess the image on canvas
      const img = imageRef.current;
      const canvas = canvasRef.current;
      if (!img || !canvas) throw new Error("Canvas/image ref missing");
  
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Could not get canvas context");
  
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      preprocessImage(canvas, ctx, img);
  
      // Convert canvas to blob (better for FormData)
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => b && resolve(b), 'image/png')
      );
      
      const formData = new FormData();
      formData.append('image', blob, 'upload.png');
  
      const response = await fetch('http://localhost:5000/ocr-image', {
        method: 'POST',
        body: formData,
      });
  
      const result = await response.json();
  
      if (result.text?.trim()) {
        onTextExtracted(result.text);
        toast.success('Text extracted successfully');
        onClose();
      } else {
        toast.warning('No text detected in image');
      }
    } catch (error) {
      console.error('OCR error:', error);
      toast.error('Failed to extract text');
    } finally {
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
  
  const handleContentTypeChange = (type: string) => {
    setOcrSettings({
      ...ocrSettings,
      contentType: type as 'document' | 'handwriting' | 'photo'
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Extract Text from Image</h2>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={isProcessing}>
            <XCircle className="h-5 w-5" />
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 pt-2">
            <TabsList className="w-full">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" /> Upload
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2" disabled={!image}>
                <ImageIcon className="h-4 w-4" /> Preview
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="flex items-center gap-2"
                onClick={() => setShowAdvanced(true)}
              >
                <Settings2 className="h-4 w-4" /> Settings
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="p-4">
            <TabsContent value="upload" className="mt-0">
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
                    Supported formats: JPG, PNG, WebP, GIF, BMP, TIFF
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="mt-0">
              <div className="space-y-4">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative">
                  {previewUrl && (
                    <img
                      ref={imageRef}
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  )}
                  
                  {/* Hidden canvas for image processing */}
                  <canvas 
                    ref={canvasRef} 
                    className="hidden"
                  ></canvas>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={cn(
                      ocrSettings.contentType === 'document' && "bg-primary/10 border-primary"
                    )}
                    onClick={() => handleContentTypeChange('document')}
                  >
                    Document
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={cn(
                      ocrSettings.contentType === 'handwriting' && "bg-primary/10 border-primary"
                    )}
                    onClick={() => handleContentTypeChange('handwriting')}
                  >
                    Handwriting
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={cn(
                      ocrSettings.contentType === 'photo' && "bg-primary/10 border-primary"
                    )}
                    onClick={() => handleContentTypeChange('photo')}
                  >
                    Photo
                  </Button>
                </div>
                
                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Extracting text...</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="mt-0">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">OCR Language</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={cn(
                        ocrSettings.language === 'eng' && "bg-primary/10 border-primary"
                      )}
                      onClick={() => setOcrSettings({...ocrSettings, language: 'eng'})}
                    >
                      English
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={cn(
                        ocrSettings.language === 'fra' && "bg-primary/10 border-primary"
                      )}
                      onClick={() => setOcrSettings({...ocrSettings, language: 'fra'})}
                    >
                      French
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={cn(
                        ocrSettings.language === 'deu' && "bg-primary/10 border-primary"
                      )}
                      onClick={() => setOcrSettings({...ocrSettings, language: 'deu'})}
                    >
                      German
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={cn(
                        ocrSettings.language === 'spa' && "bg-primary/10 border-primary"
                      )}
                      onClick={() => setOcrSettings({...ocrSettings, language: 'spa'})}
                    >
                      Spanish
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={cn(
                        ocrSettings.language === 'ita' && "bg-primary/10 border-primary"
                      )}
                      onClick={() => setOcrSettings({...ocrSettings, language: 'ita'})}
                    >
                      Italian
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={cn(
                        ocrSettings.language === 'por' && "bg-primary/10 border-primary"
                      )}
                      onClick={() => setOcrSettings({...ocrSettings, language: 'por'})}
                    >
                      Portuguese
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Recognition Options</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="enhance-image" 
                        checked={ocrSettings.enhanceImage}
                        onCheckedChange={(checked) => 
                          setOcrSettings({...ocrSettings, enhanceImage: checked === true})
                        }
                      />
                      <label htmlFor="enhance-image" className="text-sm">
                        Enhance image before processing
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="recognize-handwriting" 
                        checked={ocrSettings.recognizeHandwriting}
                        onCheckedChange={(checked) => 
                          setOcrSettings({...ocrSettings, recognizeHandwriting: checked === true})
                        }
                      />
                      <label htmlFor="recognize-handwriting" className="text-sm">
                        Optimize for handwriting
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="detect-orientation" 
                        checked={ocrSettings.detectOrientation}
                        onCheckedChange={(checked) => 
                          setOcrSettings({...ocrSettings, detectOrientation: checked === true})
                        }
                      />
                      <label htmlFor="detect-orientation" className="text-sm">
                        Auto-detect text orientation
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="preserve-spaces" 
                        checked={ocrSettings.preserveInterwordSpaces}
                        onCheckedChange={(checked) => 
                          setOcrSettings({...ocrSettings, preserveInterwordSpaces: checked === true})
                        }
                      />
                      <label htmlFor="preserve-spaces" className="text-sm">
                        Preserve spacing between words
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
        
        <div className="flex justify-end gap-2 p-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            disabled={!image || isProcessing}
            onClick={extractTextFromImage}
          >
            {isProcessing ? 'Processing...' : 'Extract Text'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageOCR;
