
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuthClick = () => {
    if (user) {
      signOut();
    } else {
      navigate('/auth');
    }
  };

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
          <Button
            variant="outline"
            size="sm"
            onClick={handleAuthClick}
            className="flex items-center gap-2"
          >
            {user ? (
              <>
                <LogOut className="h-4 w-4" />
                Sign Out
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Sign In
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
