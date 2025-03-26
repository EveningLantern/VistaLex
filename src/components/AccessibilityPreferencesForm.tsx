
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Eye, BookOpen, Brain } from 'lucide-react';
import ColorBlindnessThemes from '@/components/ColorBlindnessThemes';
import DyslexiaSettings from '@/components/DyslexiaSettings';
import { useAuth } from '@/context/AuthContext';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { UserAccessibilityPreferences } from '@/lib/supabase';
import { toast } from '@/lib/toast';

interface AccessibilityPreferencesFormProps {
  onComplete?: () => void;
}

const AccessibilityPreferencesForm = ({ onComplete }: AccessibilityPreferencesFormProps) => {
  const { updateAccessibilityPreferences } = useAuth();
  const { colorTheme, adhdMode, dyslexiaSettings } = useUserPreferences();
  const [activeTab, setActiveTab] = useState("vision");
  
  const [preferences, setPreferences] = useState<UserAccessibilityPreferences>({
    colorTheme: colorTheme as 'default' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'high-contrast',
    adhdMode,
    dyslexiaSettings: { ...dyslexiaSettings }
  });

  const handleColorThemeChange = (theme: 'default' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'high-contrast') => {
    setPreferences(prev => ({
      ...prev,
      colorTheme: theme
    }));
  };

  const handleDyslexiaSettingChange = (setting: keyof typeof preferences.dyslexiaSettings) => {
    setPreferences(prev => ({
      ...prev,
      dyslexiaSettings: {
        ...prev.dyslexiaSettings,
        [setting]: !prev.dyslexiaSettings[setting]
      }
    }));
  };

  const handleAdhdModeToggle = (enabled: boolean) => {
    setPreferences(prev => ({
      ...prev,
      adhdMode: enabled
    }));
  };

  const handleSavePreferences = async () => {
    try {
      await updateAccessibilityPreferences(preferences);
      toast.success('Preferences saved successfully');
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    }
  };

  return (
    <div className="space-y-6">
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
            <h3 className="text-sm font-medium mb-3">Color Vision Settings</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Do you have any color vision deficiency? Select the appropriate setting:
            </p>
            <ColorBlindnessThemes 
              currentTheme={preferences.colorTheme} 
              onChange={handleColorThemeChange} 
            />
          </TabsContent>
          
          <TabsContent value="dyslexia" className="mt-0">
            <h3 className="text-sm font-medium mb-3">Dyslexia Support</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Select options that make reading easier for you:
            </p>
            <DyslexiaSettings
              useDyslexicFont={preferences.dyslexiaSettings.useDyslexicFont}
              boldFirstLetter={preferences.dyslexiaSettings.boldFirstLetter}
              underlineVerbs={preferences.dyslexiaSettings.underlineVerbs}
              underlineComplexWords={preferences.dyslexiaSettings.underlineComplexWords}
              onToggleDyslexicFont={() => handleDyslexiaSettingChange('useDyslexicFont')}
              onToggleBoldFirstLetter={() => handleDyslexiaSettingChange('boldFirstLetter')}
              onToggleUnderlineVerbs={() => handleDyslexiaSettingChange('underlineVerbs')}
              onToggleUnderlineComplexWords={() => handleDyslexiaSettingChange('underlineComplexWords')}
            />
          </TabsContent>
          
          <TabsContent value="adhd" className="mt-0">
            <div className="space-y-4">
              <h3 className="text-sm font-medium mb-3">Focus Settings</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Would you like help focusing on text?
              </p>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="adhd-mode">ADHD Focus Mode</Label>
                  <p className="text-xs text-muted-foreground">
                    Display 3 words at a time for improved focus
                  </p>
                </div>
                <Switch
                  id="adhd-mode"
                  checked={preferences.adhdMode}
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
      
      <div className="flex justify-between mt-6">
        <Button 
          variant="outline" 
          onClick={() => setActiveTab(activeTab === "vision" ? "vision" : activeTab === "dyslexia" ? "vision" : "dyslexia")}
          disabled={activeTab === "vision"}
        >
          Previous
        </Button>
        
        {activeTab !== "adhd" ? (
          <Button 
            onClick={() => setActiveTab(activeTab === "vision" ? "dyslexia" : "adhd")}
          >
            Next
          </Button>
        ) : (
          <Button 
            onClick={handleSavePreferences}
          >
            Save Preferences
          </Button>
        )}
      </div>
    </div>
  );
};

export default AccessibilityPreferencesForm;
