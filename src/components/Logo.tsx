
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "small" | "medium" | "large";
}

const Logo = ({ className, size = "medium" }: LogoProps) => {
  const sizeClass = {
    small: "w-6 h-6",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="relative">
        <img 
          src="/favicon.ico" 
          alt="VistaLex Logo" 
          className={cn(sizeClass[size])}
        />
      </div>
      <h1 className="text-xl font-medium">
        <span className="font-bold">Vista</span>Lex
      </h1>
    </div>
  );
};

export default Logo;
