
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Profile, UserAccessibilityPreferences, supabase } from '@/lib/supabase';

type UserPreferencesContextType = {
  colorTheme: string;
  adhdMode: boolean;
  dyslexiaSettings: {
    useDyslexicFont: boolean;
    boldFirstLetter: boolean;
    underlineVerbs: boolean;
    underlineComplexWords: boolean;
  };
  textFormatting: {
    letterSpacing: string;
    lineHeight: string;
    paragraphSpacing: string;
  };
  updateColorTheme: (theme: 'default' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'high-contrast') => void;
  updateAdhdMode: (enabled: boolean) => void;
  updateDyslexiaSettings: (settings: {
    useDyslexicFont: boolean;
    boldFirstLetter: boolean;
    underlineVerbs: boolean;
    underlineComplexWords: boolean;
  }) => void;
  updateTextFormatting: (settings: {
    letterSpacing: string;
    lineHeight: string;
    paragraphSpacing: string;
  }) => void;
};

const defaultPreferences: UserAccessibilityPreferences & { 
  textFormatting: { 
    letterSpacing: string;
    lineHeight: string;
    paragraphSpacing: string;
  }
} = {
  colorTheme: 'default',
  adhdMode: false,
  dyslexiaSettings: {
    useDyslexicFont: false,
    boldFirstLetter: false,
    underlineVerbs: false,
    underlineComplexWords: false
  },
  textFormatting: {
    letterSpacing: 'normal',
    lineHeight: 'normal',
    paragraphSpacing: 'normal'
  }
};

const UserPreferencesContext = createContext<UserPreferencesContextType>({
  ...defaultPreferences,
  updateColorTheme: () => {},
  updateAdhdMode: () => {},
  updateDyslexiaSettings: () => {},
  updateTextFormatting: () => {}
});

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const { user, profile, updateAccessibilityPreferences } = useAuth();
  const [preferences, setPreferences] = useState<typeof defaultPreferences>(defaultPreferences);

  useEffect(() => {
    if (profile) {
      // Load preferences from user profile
      setPreferences({
        colorTheme: profile.color_theme || defaultPreferences.colorTheme,
        adhdMode: profile.adhd_mode || defaultPreferences.adhdMode,
        dyslexiaSettings: profile.dyslexia_settings || defaultPreferences.dyslexiaSettings,
        textFormatting: defaultPreferences.textFormatting // Initialize with defaults as this is a new feature
      });
    } else {
      // Use default preferences if no profile exists
      setPreferences(defaultPreferences);
    }
  }, [profile]);

  const updateColorTheme = async (theme: 'default' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'high-contrast') => {
    setPreferences(prev => ({ ...prev, colorTheme: theme }));
    
    if (user) {
      await updateAccessibilityPreferences({
        ...preferences,
        colorTheme: theme
      });
    }
  };

  const updateAdhdMode = async (enabled: boolean) => {
    setPreferences(prev => ({ ...prev, adhdMode: enabled }));
    
    if (user) {
      await updateAccessibilityPreferences({
        ...preferences,
        adhdMode: enabled
      });
    }
  };

  const updateDyslexiaSettings = async (settings: {
    useDyslexicFont: boolean;
    boldFirstLetter: boolean;
    underlineVerbs: boolean;
    underlineComplexWords: boolean;
  }) => {
    setPreferences(prev => ({ ...prev, dyslexiaSettings: settings }));
    
    if (user) {
      await updateAccessibilityPreferences({
        ...preferences,
        dyslexiaSettings: settings
      });
    }
  };

  const updateTextFormatting = async (settings: {
    letterSpacing: string;
    lineHeight: string;
    paragraphSpacing: string;
  }) => {
    setPreferences(prev => ({ ...prev, textFormatting: settings }));
    
    // Store text formatting in local storage for persistence
    localStorage.setItem('textFormatting', JSON.stringify(settings));
    
    // In a full implementation, we would store this in the user profile
    // This is a placeholder for future implementation
  };

  // Try to load text formatting from local storage on initial load
  useEffect(() => {
    try {
      const savedFormatting = localStorage.getItem('textFormatting');
      if (savedFormatting) {
        const parsedFormatting = JSON.parse(savedFormatting);
        setPreferences(prev => ({
          ...prev,
          textFormatting: parsedFormatting
        }));
      }
    } catch (error) {
      console.error('Error loading text formatting from localStorage:', error);
    }
  }, []);

  return (
    <UserPreferencesContext.Provider 
      value={{ 
        ...preferences, 
        updateColorTheme, 
        updateAdhdMode, 
        updateDyslexiaSettings,
        updateTextFormatting
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
}

export const useUserPreferences = () => useContext(UserPreferencesContext);

export default UserPreferencesProvider;
