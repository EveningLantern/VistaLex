
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

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
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">V</span>
          </div>
          <h1 className="text-xl font-medium">
            <span className="font-bold">Vista</span>Lex
          </h1>
        </div>
        <p className="text-sm text-muted-foreground italic hidden md:block animate-fade-in">
          A Clear Vision For Text Accessibility
        </p>
      </div>
    </header>
  );
};

export default Header;
