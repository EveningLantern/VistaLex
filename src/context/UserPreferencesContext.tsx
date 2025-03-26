
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
  updateColorTheme: (theme: 'default' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'high-contrast') => void;
  updateAdhdMode: (enabled: boolean) => void;
  updateDyslexiaSettings: (settings: {
    useDyslexicFont: boolean;
    boldFirstLetter: boolean;
    underlineVerbs: boolean;
    underlineComplexWords: boolean;
  }) => void;
};

const defaultPreferences: UserAccessibilityPreferences = {
  colorTheme: 'default',
  adhdMode: false,
  dyslexiaSettings: {
    useDyslexicFont: false,
    boldFirstLetter: false,
    underlineVerbs: false,
    underlineComplexWords: false
  }
};

const UserPreferencesContext = createContext<UserPreferencesContextType>({
  ...defaultPreferences,
  updateColorTheme: () => {},
  updateAdhdMode: () => {},
  updateDyslexiaSettings: () => {}
});

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const { user, profile, updateAccessibilityPreferences } = useAuth();
  const [preferences, setPreferences] = useState<UserAccessibilityPreferences>(defaultPreferences);

  useEffect(() => {
    if (profile) {
      setPreferences({
        colorTheme: profile.color_theme,
        adhdMode: profile.adhd_mode,
        dyslexiaSettings: profile.dyslexia_settings
      });
    } else {
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

  return (
    <UserPreferencesContext.Provider 
      value={{ 
        ...preferences, 
        updateColorTheme, 
        updateAdhdMode, 
        updateDyslexiaSettings 
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
}

export const useUserPreferences = () => useContext(UserPreferencesContext);

export default UserPreferencesProvider;
