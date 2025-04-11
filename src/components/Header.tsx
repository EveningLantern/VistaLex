
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Logo from './Logo';
import AttentionTracker from './AttentionTracker';
import ProfileIcon from './ProfileIcon';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      scrolled 
        ? "py-3 bg-background/80 backdrop-blur-lg shadow-sm" 
        : "py-5 bg-transparent"
    )}>
      <div className="container flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground italic hidden md:block animate-fade-in">
            A Clear Vision For Text Accessibility
          </p>
          <div className="flex items-center gap-2">
            <AttentionTracker />
            <ProfileIcon />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
