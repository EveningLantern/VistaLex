
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type DyslexiaSettingsProps = {
  useDyslexicFont: boolean;
  boldFirstLetter: boolean;
  underlineVerbs: boolean;
  underlineComplexWords: boolean;
  onToggleDyslexicFont: () => void;
  onToggleBoldFirstLetter: () => void;
  onToggleUnderlineVerbs: () => void;
  onToggleUnderlineComplexWords: () => void;
};

const DyslexiaSettings = ({
  useDyslexicFont,
  boldFirstLetter,
  underlineVerbs,
  underlineComplexWords,
  onToggleDyslexicFont,
  onToggleBoldFirstLetter,
  onToggleUnderlineVerbs,
  onToggleUnderlineComplexWords
}: DyslexiaSettingsProps) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-sm font-medium mb-2">Dyslexia Support</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="dyslexic-font">Dyslexic Font</Label>
            <p className="text-xs text-muted-foreground">
              Use a specialized font for dyslexia
            </p>
          </div>
          <Switch
            id="dyslexic-font"
            checked={useDyslexicFont}
            onCheckedChange={onToggleDyslexicFont}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="bold-first-letter">Bold First Letters</Label>
            <p className="text-xs text-muted-foreground">
              Make the first letter of each word bold
            </p>
          </div>
          <Switch
            id="bold-first-letter"
            checked={boldFirstLetter}
            onCheckedChange={onToggleBoldFirstLetter}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="underline-verbs">Highlight Verbs</Label>
            <p className="text-xs text-muted-foreground">
              Underline action words in the text
            </p>
          </div>
          <Switch
            id="underline-verbs"
            checked={underlineVerbs}
            onCheckedChange={onToggleUnderlineVerbs}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="underline-complex">Highlight Complex Words</Label>
            <p className="text-xs text-muted-foreground">
              Underline longer or complex words
            </p>
          </div>
          <Switch
            id="underline-complex"
            checked={underlineComplexWords}
            onCheckedChange={onToggleUnderlineComplexWords}
          />
        </div>
      </div>
    </div>
  );
};

export default DyslexiaSettings;
