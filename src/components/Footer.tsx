
const Footer = () => {
  return (
    <footer className="py-6 border-t border-border/40 mt-16">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="font-bold text-lg flex items-center">
              <span className="bg-primary text-white w-6 h-6 rounded flex items-center justify-center mr-2">V</span>
              VistaLex
            </h3>
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
