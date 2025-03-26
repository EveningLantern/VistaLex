
import React, { useState } from 'react';
import { 
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarLabel
} from "@/components/ui/menubar";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Type, 
  TextIcon, 
  GanttChartSquare, 
  ImagePlus 
} from 'lucide-react';
import { Label } from './ui/label';

type TextFormattingProps = {
  onLetterSpacingChange: (value: string) => void;
  onLineHeightChange: (value: string) => void;
  onParagraphSpacingChange: (value: string) => void;
  onImageUploadClick: () => void;
};

const TextFormatting: React.FC<TextFormattingProps> = ({
  onLetterSpacingChange,
  onLineHeightChange,
  onParagraphSpacingChange,
  onImageUploadClick
}) => {
  const [letterSpacing, setLetterSpacing] = useState<string>('normal');
  const [lineHeight, setLineHeight] = useState<string>('normal');
  const [paragraphSpacing, setParagraphSpacing] = useState<string>('normal');

  const handleLetterSpacingChange = (value: string) => {
    setLetterSpacing(value);
    onLetterSpacingChange(value);
  };

  const handleLineHeightChange = (value: string) => {
    setLineHeight(value);
    onLineHeightChange(value);
  };

  const handleParagraphSpacingChange = (value: string) => {
    setParagraphSpacing(value);
    onParagraphSpacingChange(value);
  };

  return (
    <div className="w-full mb-4 glass rounded-lg p-2 animate-fade-in">
      <Menubar className="border-none bg-transparent p-0">
        <MenubarMenu>
          <MenubarTrigger className="gap-1">
            <Type className="h-4 w-4" /> Letter Spacing
          </MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>Letter Spacing</MenubarLabel>
            <MenubarRadioGroup value={letterSpacing}>
              <MenubarRadioItem value="tight" onClick={() => handleLetterSpacingChange('tight')}>
                Tight
              </MenubarRadioItem>
              <MenubarRadioItem value="normal" onClick={() => handleLetterSpacingChange('normal')}>
                Normal
              </MenubarRadioItem>
              <MenubarRadioItem value="wide" onClick={() => handleLetterSpacingChange('wide')}>
                Wide
              </MenubarRadioItem>
              <MenubarRadioItem value="wider" onClick={() => handleLetterSpacingChange('wider')}>
                Wider
              </MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="gap-1">
            <TextIcon className="h-4 w-4" /> Line Height
          </MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>Line Height</MenubarLabel>
            <MenubarRadioGroup value={lineHeight}>
              <MenubarRadioItem value="tight" onClick={() => handleLineHeightChange('tight')}>
                Tight
              </MenubarRadioItem>
              <MenubarRadioItem value="normal" onClick={() => handleLineHeightChange('normal')}>
                Normal
              </MenubarRadioItem>
              <MenubarRadioItem value="relaxed" onClick={() => handleLineHeightChange('relaxed')}>
                Relaxed
              </MenubarRadioItem>
              <MenubarRadioItem value="loose" onClick={() => handleLineHeightChange('loose')}>
                Loose
              </MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="gap-1">
            <GanttChartSquare className="h-4 w-4" /> Paragraph Spacing
          </MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>Paragraph Spacing</MenubarLabel>
            <MenubarRadioGroup value={paragraphSpacing}>
              <MenubarRadioItem value="tight" onClick={() => handleParagraphSpacingChange('tight')}>
                Tight
              </MenubarRadioItem>
              <MenubarRadioItem value="normal" onClick={() => handleParagraphSpacingChange('normal')}>
                Normal
              </MenubarRadioItem>
              <MenubarRadioItem value="relaxed" onClick={() => handleParagraphSpacingChange('relaxed')}>
                Relaxed
              </MenubarRadioItem>
              <MenubarRadioItem value="loose" onClick={() => handleParagraphSpacingChange('loose')}>
                Loose
              </MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>

        <MenubarSeparator />
        
        <MenubarMenu>
          <MenubarTrigger 
            className="gap-1 hover:bg-primary/10 text-primary"
            onClick={onImageUploadClick}
          >
            <ImagePlus className="h-4 w-4" /> Extract Text from Image
          </MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    </div>
  );
};

export default TextFormatting;
