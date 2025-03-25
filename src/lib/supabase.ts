
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qvtqyjusegveoewitlif.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2dHF5anVzZWd2ZW9ld2l0bGlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MTQ0MDIsImV4cCI6MjA1ODQ5MDQwMn0.xhNJHBzKgEem-Pzu9XjtT1MLfwMtzJFIn11UKocZy5M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});

export type UserAccessibilityPreferences = {
  colorTheme: 'default' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'high-contrast';
  adhdMode: boolean;
  dyslexiaSettings: {
    useDyslexicFont: boolean;
    boldFirstLetter: boolean;
    underlineVerbs: boolean;
    underlineComplexWords: boolean;
  };
};

export type Profile = {
  id: string;
  created_at?: string;
  color_theme: 'default' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'high-contrast';
  adhd_mode: boolean;
  dyslexia_settings: {
    useDyslexicFont: boolean;
    boldFirstLetter: boolean;
    underlineVerbs: boolean;
    underlineComplexWords: boolean;
  };
};
