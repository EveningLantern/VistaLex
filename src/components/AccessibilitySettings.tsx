
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ColorBlindnessThemes from '@/components/ColorBlindnessThemes';
import DyslexiaSettings from '@/components/DyslexiaSettings';
import { Button } from '@/components/ui/button';
import { Eye, BookOpen, Brain } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type ColorTheme = 'default' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'high-contrast';

type AccessibilitySettingsProps = {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  dyslexiaSettings: {
    useDyslexicFont: boolean;
    boldFirstLetter: boolean;
    underlineVerbs: boolean;
    underlineComplexWords: boolean;
  };
  setDyslexiaSettings: React.Dispatch<React.SetStateAction<{
    useDyslexicFont: boolean;
    boldFirstLetter: boolean;
    underlineVerbs: boolean;
    underlineComplexWords: boolean;
  }>>;
  adhdMode: boolean;
  setAdhdMode: (enabled: boolean) => void;
};

const AccessibilitySettings = ({
  colorTheme,
  setColorTheme,
  dyslexiaSettings,
  setDyslexiaSettings,
  adhdMode,
  setAdhdMode
}: AccessibilitySettingsProps) => {
  const [activeTab, setActiveTab] = useState("vision");
  
  const handleDyslexicFontToggle = () => {
    setDyslexiaSettings(prev => ({
      ...prev,
      useDyslexicFont: !prev.useDyslexicFont
    }));
  };
  
  const handleBoldFirstLetterToggle = () => {
    setDyslexiaSettings(prev => ({
      ...prev,
      boldFirstLetter: !prev.boldFirstLetter
    }));
  };
  
  const handleUnderlineVerbsToggle = () => {
    setDyslexiaSettings(prev => ({
      ...prev,
      underlineVerbs: !prev.underlineVerbs
    }));
  };
  
  const handleUnderlineComplexWordsToggle = () => {
    setDyslexiaSettings(prev => ({
      ...prev,
      underlineComplexWords: !prev.underlineComplexWords
    }));
  };
  
  const resetAllSettings = () => {
    setColorTheme('default');
    setDyslexiaSettings({
      useDyslexicFont: false,
      boldFirstLetter: false,
      underlineVerbs: false,
      underlineComplexWords: false
    });
    setAdhdMode(false);
  };
  
  return (
    <div className="w-full animate-fade-in">
      <Tabs defaultValue="vision" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="vision" className="flex items-center gap-2">
            <Eye className="h-4 w-4" /> Vision
          </TabsTrigger>
          <TabsTrigger value="dyslexia" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" /> Dyslexia
          </TabsTrigger>
          <TabsTrigger value="adhd" className="flex items-center gap-2">
            <Brain className="h-4 w-4" /> ADHD
          </TabsTrigger>
        </TabsList>
        
        <div className="p-4 border rounded-lg bg-secondary/30">
          <TabsContent value="vision" className="mt-0">
            <ColorBlindnessThemes 
              currentTheme={colorTheme} 
              onChange={setColorTheme} 
            />
          </TabsContent>
          
          <TabsContent value="dyslexia" className="mt-0">
            <DyslexiaSettings
              useDyslexicFont={dyslexiaSettings.useDyslexicFont}
              boldFirstLetter={dyslexiaSettings.boldFirstLetter}
              underlineVerbs={dyslexiaSettings.underlineVerbs}
              underlineComplexWords={dyslexiaSettings.underlineComplexWords}
              onToggleDyslexicFont={handleDyslexicFontToggle}
              onToggleBoldFirstLetter={handleBoldFirstLetterToggle}
              onToggleUnderlineVerbs={handleUnderlineVerbsToggle}
              onToggleUnderlineComplexWords={handleUnderlineComplexWordsToggle}
            />
          </TabsContent>
          
          <TabsContent value="adhd" className="mt-0">
            <div className="space-y-4">
              <h3 className="text-sm font-medium mb-2">Focus Settings</h3>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="adhd-mode">ADHD Focus Mode</Label>
                  <p className="text-xs text-muted-foreground">
                    Display 3 words at a time for improved focus
                  </p>
                </div>
                <Switch
                  id="adhd-mode"
                  checked={adhdMode}
                  onCheckedChange={setAdhdMode}
                />
              </div>
              
              <p className="text-sm mt-4">
                ADHD mode displays text in a more focused way, showing only a few words at a time with dynamic colors to help maintain attention.
              </p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
      
      <Button 
        variant="outline" 
        className="w-full mt-4 text-sm h-8"
        onClick={resetAllSettings}
      >
        Reset All Settings
      </Button>
    </div>
  );
};

export default AccessibilitySettings;
