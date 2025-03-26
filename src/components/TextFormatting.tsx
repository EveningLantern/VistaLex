import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Type, 
  AlignCenter,
  GanttChartSquare,
  Camera
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserPreferences } from '@/context/UserPreferencesContext';

type TextFormattingProps = {
  onLetterSpacingChange: (value: string) => void;
  onLineHeightChange: (value: string) => void;
  onParagraphSpacingChange: (value: string) => void;
  onImageUploadClick?: () => void;
};

const TextFormatting = ({
  onLetterSpacingChange,
  onLineHeightChange,
  onParagraphSpacingChange,
  onImageUploadClick
}: TextFormattingProps) => {
  const { textFormatting, updateTextFormatting } = useUserPreferences();
  
  const handleLetterSpacingChange = (value: string) => {
    onLetterSpacingChange(value);
    updateTextFormatting({
      ...textFormatting,
      letterSpacing: value
    });
  };
  
  const handleLineHeightChange = (value: string) => {
    onLineHeightChange(value);
    updateTextFormatting({
      ...textFormatting,
      lineHeight: value
    });
  };
  
  const handleParagraphSpacingChange = (value: string) => {
    onParagraphSpacingChange(value);
    updateTextFormatting({
      ...textFormatting,
      paragraphSpacing: value
    });
  };
  
  return (
    <div className="glass rounded-lg p-4 animate-fade-in space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Text Formatting</h3>
        
        {onImageUploadClick && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onImageUploadClick}
            className="flex gap-1 items-center"
          >
            <Camera className="h-4 w-4" />
            <span className="text-xs">Extract Text</span>
          </Button>
        )}
      </div>
      
      <div className="space-y-3">
        {/* Letter Spacing */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            <Label className="text-xs">Letter Spacing</Label>
          </div>
          
          <div className="flex gap-1">
            <Button 
              size="sm"
              variant={textFormatting.letterSpacing === "tight" ? "default" : "outline"}
              className="text-xs h-8 flex-1"
              onClick={() => handleLetterSpacingChange("tight")}
            >
              Tight
            </Button>
            <Button
              size="sm"
              variant={textFormatting.letterSpacing === "normal" ? "default" : "outline"}
              className="text-xs h-8 flex-1"
              onClick={() => handleLetterSpacingChange("normal")}
            >
              Normal
            </Button>
            <Button
              size="sm"
              variant={textFormatting.letterSpacing === "wide" ? "default" : "outline"}
              className="text-xs h-8 flex-1"
              onClick={() => handleLetterSpacingChange("wide")}
            >
              Wide
            </Button>
            <Button
              size="sm"
              variant={textFormatting.letterSpacing === "wider" ? "default" : "outline"}
              className="text-xs h-8 flex-1"
              onClick={() => handleLetterSpacingChange("wider")}
            >
              Wider
            </Button>
          </div>
        </div>
        
        {/* Line Height */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <AlignCenter className="h-4 w-4" />
            <Label className="text-xs">Line Height</Label>
          </div>
          
          <div className="flex gap-1">
            <Button 
              size="sm"
              variant={textFormatting.lineHeight === "tight" ? "default" : "outline"}
              className="text-xs h-8 flex-1"
              onClick={() => handleLineHeightChange("tight")}
            >
              Tight
            </Button>
            <Button
              size="sm"
              variant={textFormatting.lineHeight === "normal" ? "default" : "outline"}
              className="text-xs h-8 flex-1"
              onClick={() => handleLineHeightChange("normal")}
            >
              Normal
            </Button>
            <Button
              size="sm"
              variant={textFormatting.lineHeight === "relaxed" ? "default" : "outline"}
              className="text-xs h-8 flex-1"
              onClick={() => handleLineHeightChange("relaxed")}
            >
              Relaxed
            </Button>
            <Button
              size="sm"
              variant={textFormatting.lineHeight === "loose" ? "default" : "outline"}
              className="text-xs h-8 flex-1"
              onClick={() => handleLineHeightChange("loose")}
            >
              Loose
            </Button>
          </div>
        </div>
        
        {/* Paragraph Spacing */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <GanttChartSquare className="h-4 w-4" />
            <Label className="text-xs">Paragraph Spacing</Label>
          </div>
          
          <div className="flex gap-1">
            <Button 
              size="sm"
              variant={textFormatting.paragraphSpacing === "tight" ? "default" : "outline"}
              className="text-xs h-8 flex-1"
              onClick={() => handleParagraphSpacingChange("tight")}
            >
              Tight
            </Button>
            <Button
              size="sm"
              variant={textFormatting.paragraphSpacing === "normal" ? "default" : "outline"}
              className="text-xs h-8 flex-1"
              onClick={() => handleParagraphSpacingChange("normal")}
            >
              Normal
            </Button>
            <Button
              size="sm"
              variant={textFormatting.paragraphSpacing === "relaxed" ? "default" : "outline"}
              className="text-xs h-8 flex-1"
              onClick={() => handleParagraphSpacingChange("relaxed")}
            >
              Relaxed
            </Button>
            <Button
              size="sm"
              variant={textFormatting.paragraphSpacing === "loose" ? "default" : "outline"}
              className="text-xs h-8 flex-1"
              onClick={() => handleParagraphSpacingChange("loose")}
            >
              Loose
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextFormatting;
