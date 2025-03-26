
import React from 'react';
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
  LineHeight, 
  Spacing, 
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
  return (
    <div className="w-full mb-4 glass rounded-lg p-2 animate-fade-in">
      <Menubar className="border-none bg-transparent p-0">
        <MenubarMenu>
          <MenubarTrigger className="gap-1">
            <Type className="h-4 w-4" /> Letter Spacing
          </MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>Letter Spacing</MenubarLabel>
            <MenubarRadioGroup value="normal">
              <MenubarRadioItem value="tight" onClick={() => onLetterSpacingChange('tight')}>
                Tight
              </MenubarRadioItem>
              <MenubarRadioItem value="normal" onClick={() => onLetterSpacingChange('normal')}>
                Normal
              </MenubarRadioItem>
              <MenubarRadioItem value="wide" onClick={() => onLetterSpacingChange('wide')}>
                Wide
              </MenubarRadioItem>
              <MenubarRadioItem value="wider" onClick={() => onLetterSpacingChange('wider')}>
                Wider
              </MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="gap-1">
            <LineHeight className="h-4 w-4" /> Line Height
          </MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>Line Height</MenubarLabel>
            <MenubarRadioGroup value="normal">
              <MenubarRadioItem value="tight" onClick={() => onLineHeightChange('tight')}>
                Tight
              </MenubarRadioItem>
              <MenubarRadioItem value="normal" onClick={() => onLineHeightChange('normal')}>
                Normal
              </MenubarRadioItem>
              <MenubarRadioItem value="relaxed" onClick={() => onLineHeightChange('relaxed')}>
                Relaxed
              </MenubarRadioItem>
              <MenubarRadioItem value="loose" onClick={() => onLineHeightChange('loose')}>
                Loose
              </MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="gap-1">
            <Spacing className="h-4 w-4" /> Paragraph Spacing
          </MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>Paragraph Spacing</MenubarLabel>
            <MenubarRadioGroup value="normal">
              <MenubarRadioItem value="tight" onClick={() => onParagraphSpacingChange('tight')}>
                Tight
              </MenubarRadioItem>
              <MenubarRadioItem value="normal" onClick={() => onParagraphSpacingChange('normal')}>
                Normal
              </MenubarRadioItem>
              <MenubarRadioItem value="relaxed" onClick={() => onParagraphSpacingChange('relaxed')}>
                Relaxed
              </MenubarRadioItem>
              <MenubarRadioItem value="loose" onClick={() => onParagraphSpacingChange('loose')}>
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
