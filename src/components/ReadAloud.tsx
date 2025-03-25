
import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';

type ReadAloudProps = {
  text: string;
  className?: string;
};

const ReadAloud = ({ text, className }: ReadAloudProps) => {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentVoice, setCurrentVoice] = useState<string>('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const previousVolume = useRef(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Initialize speech synthesis and load available voices
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      toast.error('Text-to-speech not supported', {
        description: 'Your browser does not support the speech synthesis API'
      });
      return;
    }
    
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        // Try to find and set an English voice as default
        const englishVoice = availableVoices.find(voice => 
          voice.lang.includes('en') && voice.localService
        );
        if (englishVoice) {
          setCurrentVoice(englishVoice.name);
        } else {
          setCurrentVoice(availableVoices[0].name);
        }
      }
    };
    
    loadVoices();
    
    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    // Clean up
    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  // Handle speech end
  useEffect(() => {
    const handleSpeechEnd = () => {
      setSpeaking(false);
      setPaused(false);
    };
    
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      if (utteranceRef.current) {
        utteranceRef.current.onend = handleSpeechEnd;
      }
    }
  }, [utteranceRef.current]);
  
  const toggleSpeech = () => {
    if (!text) {
      toast.warning('No text to read', {
        description: 'Please enter or upload some text first'
      });
      return;
    }
    
    if (speaking && !paused) {
      // Pause speech
      window.speechSynthesis.pause();
      setPaused(true);
    } else if (speaking && paused) {
      // Resume speech
      window.speechSynthesis.resume();
      setPaused(false);
    } else {
      // Start new speech
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Apply settings
      const selectedVoice = voices.find(voice => voice.name === currentVoice);
      if (selectedVoice) utterance.voice = selectedVoice;
      
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = muted ? 0 : volume;
      
      // Store reference for later control
      utteranceRef.current = utterance;
      
      // Start speaking
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      window.speechSynthesis.speak(utterance);
      setSpeaking(true);
      setPaused(false);
    }
  };
  
  const stopSpeech = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      setPaused(false);
    }
  };
  
  const toggleMute = () => {
    if (muted) {
      // Unmute
      setVolume(previousVolume.current);
      setMuted(false);
      if (utteranceRef.current) {
        utteranceRef.current.volume = previousVolume.current;
      }
    } else {
      // Mute
      previousVolume.current = volume;
      setVolume(0);
      setMuted(true);
      if (utteranceRef.current) {
        utteranceRef.current.volume = 0;
      }
    }
  };
  
  const handleVoiceChange = (value: string) => {
    setCurrentVoice(value);
    if (speaking) {
      // Restart speech with new voice
      stopSpeech();
      setTimeout(() => toggleSpeech(), 100);
    }
  };
  
  const handleRateChange = (value: number[]) => {
    setRate(value[0]);
    if (utteranceRef.current) {
      utteranceRef.current.rate = value[0];
      if (speaking) {
        // Restart speech with new rate
        stopSpeech();
        setTimeout(() => toggleSpeech(), 100);
      }
    }
  };
  
  const handlePitchChange = (value: number[]) => {
    setPitch(value[0]);
    if (utteranceRef.current) {
      utteranceRef.current.pitch = value[0];
      if (speaking) {
        // Restart speech with new pitch
        stopSpeech();
        setTimeout(() => toggleSpeech(), 100);
      }
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setMuted(value[0] === 0);
    if (utteranceRef.current) {
      utteranceRef.current.volume = value[0];
    }
  };
  
  return (
    <div className={cn("flex flex-col w-full space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant={speaking ? "default" : "outline"}
            size="icon"
            onClick={toggleSpeech}
            className="h-10 w-10 rounded-full"
          >
            {speaking && !paused ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
          >
            {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
          
          <div className="w-24 mx-2">
            <Slider
              value={[volume]}
              min={0}
              max={1}
              step={0.1}
              onValueChange={handleVolumeChange}
            />
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
      
      {showSettings && (
        <div className="p-4 bg-background/50 rounded-lg border animate-fade-in space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Voice</label>
            <Select value={currentVoice} onValueChange={handleVoiceChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {voices.map((voice) => (
                  <SelectItem key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Speed</label>
              <span className="text-xs text-muted-foreground">{rate}x</span>
            </div>
            <Slider
              value={[rate]}
              min={0.5}
              max={2}
              step={0.1}
              onValueChange={handleRateChange}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Pitch</label>
              <span className="text-xs text-muted-foreground">{pitch}</span>
            </div>
            <Slider
              value={[pitch]}
              min={0.5}
              max={2}
              step={0.1}
              onValueChange={handlePitchChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadAloud;
