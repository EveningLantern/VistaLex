
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type ColorTheme = 'default' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'high-contrast';

type ColorBlindnessThemesProps = {
  currentTheme: ColorTheme;
  onChange: (theme: ColorTheme) => void;
};

const ColorBlindnessThemes = ({ currentTheme, onChange }: ColorBlindnessThemesProps) => {
  const themes = [
    { id: 'default', name: 'Normal Vision', description: 'Standard color scheme' },
    { id: 'protanopia', name: 'Protanopia', description: 'Red-green color blindness' },
    { id: 'deuteranopia', name: 'Deuteranopia', description: 'Green-blind' },
    { id: 'tritanopia', name: 'Tritanopia', description: 'Blue-blind' },
    { id: 'high-contrast', name: 'High Contrast', description: 'Maximum contrast for visibility' },
  ] as const;

  return (
    <div className="space-y-3 animate-fade-in">
      <h3 className="text-sm font-medium mb-2">Color Vision Settings</h3>
      <div className="grid grid-cols-1 gap-2">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onChange(theme.id)}
            className={cn(
              "flex items-center p-3 rounded-lg transition-all text-left",
              currentTheme === theme.id
                ? "glass-darker shadow-md"
                : "hover:bg-secondary/50"
            )}
          >
            <div className={cn(
              "w-4 h-4 rounded-full mr-3 flex items-center justify-center",
              currentTheme === theme.id ? "bg-primary text-white" : "border border-muted-foreground"
            )}>
              {currentTheme === theme.id && <Check className="h-3 w-3" />}
            </div>
            <div>
              <div className="font-medium text-sm">{theme.name}</div>
              <div className="text-xs text-muted-foreground">{theme.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorBlindnessThemes;
