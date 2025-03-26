
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ColorBlindnessThemes from '@/components/ColorBlindnessThemes';
import DyslexiaSettings from '@/components/DyslexiaSettings';
import { Button } from '@/components/ui/button';
import { Eye, BookOpen, Brain, Save } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { Link } from 'react-router-dom';
import { toast } from '@/lib/toast';

type ColorTheme = 'default' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'high-contrast';

type AccessibilitySettingsProps = {
  isLoggedIn?: boolean;
};

const AccessibilitySettings = ({ isLoggedIn = false }: AccessibilitySettingsProps) => {
  const [activeTab, setActiveTab] = useState("vision");
  const { user } = useAuth();
  const { 
    colorTheme, 
    adhdMode, 
    dyslexiaSettings, 
    updateColorTheme, 
    updateAdhdMode, 
    updateDyslexiaSettings 
  } = useUserPreferences();
  
  const [tempPreferences, setTempPreferences] = useState({
    colorTheme: colorTheme as ColorTheme,
    adhdMode,
    dyslexiaSettings: { ...dyslexiaSettings }
  });
  
  const handleDyslexicFontToggle = () => {
    setTempPreferences(prev => ({
      ...prev,
      dyslexiaSettings: {
        ...prev.dyslexiaSettings,
        useDyslexicFont: !prev.dyslexiaSettings.useDyslexicFont
      }
    }));
  };
  
  const handleBoldFirstLetterToggle = () => {
    setTempPreferences(prev => ({
      ...prev,
      dyslexiaSettings: {
        ...prev.dyslexiaSettings,
        boldFirstLetter: !prev.dyslexiaSettings.boldFirstLetter
      }
    }));
  };
  
  const handleUnderlineVerbsToggle = () => {
    setTempPreferences(prev => ({
      ...prev,
      dyslexiaSettings: {
        ...prev.dyslexiaSettings,
        underlineVerbs: !prev.dyslexiaSettings.underlineVerbs
      }
    }));
  };
  
  const handleUnderlineComplexWordsToggle = () => {
    setTempPreferences(prev => ({
      ...prev,
      dyslexiaSettings: {
        ...prev.dyslexiaSettings,
        underlineComplexWords: !prev.dyslexiaSettings.underlineComplexWords
      }
    }));
  };
  
  const handleColorThemeChange = (theme: ColorTheme) => {
    setTempPreferences(prev => ({
      ...prev,
      colorTheme: theme
    }));
  };
  
  const handleAdhdModeToggle = (enabled: boolean) => {
    setTempPreferences(prev => ({
      ...prev,
      adhdMode: enabled
    }));
  };
  
  const resetAllSettings = () => {
    const defaultSettings = {
      colorTheme: 'default' as ColorTheme,
      adhdMode: false,
      dyslexiaSettings: {
        useDyslexicFont: false,
        boldFirstLetter: false,
        underlineVerbs: false,
        underlineComplexWords: false
      }
    };
    
    setTempPreferences(defaultSettings);
    updateColorTheme(defaultSettings.colorTheme);
    updateAdhdMode(defaultSettings.adhdMode);
    updateDyslexiaSettings(defaultSettings.dyslexiaSettings);
    
    toast.success('Settings reset to defaults');
  };
  
  const savePreferences = () => {
    updateColorTheme(tempPreferences.colorTheme);
    updateAdhdMode(tempPreferences.adhdMode);
    updateDyslexiaSettings(tempPreferences.dyslexiaSettings);
    
    toast.success('Preferences saved successfully');
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
              currentTheme={tempPreferences.colorTheme} 
              onChange={handleColorThemeChange} 
            />
          </TabsContent>
          
          <TabsContent value="dyslexia" className="mt-0">
            <DyslexiaSettings
              useDyslexicFont={tempPreferences.dyslexiaSettings.useDyslexicFont}
              boldFirstLetter={tempPreferences.dyslexiaSettings.boldFirstLetter}
              underlineVerbs={tempPreferences.dyslexiaSettings.underlineVerbs}
              underlineComplexWords={tempPreferences.dyslexiaSettings.underlineComplexWords}
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
                  checked={tempPreferences.adhdMode}
                  onCheckedChange={handleAdhdModeToggle}
                />
              </div>
              
              <p className="text-sm mt-4">
                ADHD mode displays text in a more focused way, showing only a few words at a time with dynamic colors to help maintain attention.
              </p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
      
      <div className="flex flex-col gap-3 mt-4">
        <Button 
          className="w-full flex items-center gap-2"
          onClick={savePreferences}
        >
          <Save className="h-4 w-4" />
          Save Preferences
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full text-sm h-8"
          onClick={resetAllSettings}
        >
          Reset All Settings
        </Button>

        {!user && (
          <div className="text-center mt-2">
            <p className="text-sm text-muted-foreground mb-2">
              To save your preferences permanently:
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link to="/auth">Create an Account</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessibilitySettings;
