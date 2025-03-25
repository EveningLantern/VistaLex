
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Profile } from '@/lib/supabase';

type UserPreferencesContextType = {
  colorTheme: string;
  adhdMode: boolean;
  dyslexiaSettings: {
    useDyslexicFont: boolean;
    boldFirstLetter: boolean;
    underlineVerbs: boolean;
    underlineComplexWords: boolean;
  };
};

const defaultPreferences: UserPreferencesContextType = {
  colorTheme: 'default',
  adhdMode: false,
  dyslexiaSettings: {
    useDyslexicFont: false,
    boldFirstLetter: false,
    underlineVerbs: false,
    underlineComplexWords: false
  }
};

const UserPreferencesContext = createContext<UserPreferencesContextType>(defaultPreferences);

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferencesContextType>(defaultPreferences);

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

  return (
    <UserPreferencesContext.Provider value={preferences}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export const useUserPreferences = () => useContext(UserPreferencesContext);

export default UserPreferencesProvider;
