
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="py-6 border-t border-border/40 mt-16">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Logo size="small" />
            <p className="text-sm text-muted-foreground mt-1">
              A Clear Vision For Text Accessibility
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} VistaLex. All rights reserved.</p>
            <p className="mt-1">Made with accessibility in mind.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
