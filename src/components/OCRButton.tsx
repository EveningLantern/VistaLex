
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScanText, FileImage, X } from 'lucide-react';
import { toast } from '@/lib/toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageOCR from './ImageOCR';

type OCRButtonProps = {
  onTextExtracted: (text: string) => void;
};

const OCRButton = ({ onTextExtracted }: OCRButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  
  const handleTextExtracted = (text: string) => {
    onTextExtracted(text);
    setIsDialogOpen(false);
    toast.success('Text extracted successfully', {
      description: 'The text has been processed and is ready for viewing'
    });
  };
  
  return (
    <>
      <Button
        onClick={handleOpenDialog}
        variant="secondary"
        className="flex items-center gap-2 w-full"
      >
        <ScanText className="h-4 w-4" />
        Extract Text with OCR
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Extract Text with OCR</DialogTitle>
            <DialogDescription>
              Upload an image or document to extract text using optical character recognition (OCR).
            </DialogDescription>
          </DialogHeader>
          
          <ImageOCR onTextExtracted={handleTextExtracted} onClose={handleCloseDialog} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OCRButton;
