
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
          src="/lovable-uploads/65a41b9e-a0a7-45ac-a2b5-53b8d91231c4.png" 
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
