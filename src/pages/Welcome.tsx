
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import { 
  Eye, 
  MonitorSmartphone, 
  Activity, 
  Book, 
  Image, 
  Languages, 
  BookOpen,
  ArrowRight,
  Settings
} from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="w-full py-6 px-6 lg:px-12 flex items-center justify-between">
        <Logo size="large" />
        <Button 
          variant="outline" 
          className="transition-all hover:scale-105"
          onClick={handleGetStarted}
        >
          Get Started
        </Button>
      </header>

      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-b from-background to-muted py-20 px-6 lg:px-12">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-primary tracking-tight animate-fade-in">
              A Clear Vision For Text Accessibility
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 animate-fade-in">
              VistaLex makes text accessible to everyone, regardless of visual impairments, 
              learning disabilities, or reading preferences.
            </p>
            <Button 
              size="lg" 
              className="animate-fade-in transition-all hover:scale-105"
              onClick={handleGetStarted}
            >
              Get Started <ArrowRight className="ml-2" />
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">Powerful Accessibility Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-card border rounded-lg p-6 transition-all hover:shadow-md">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Eye className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Vision Accessibility</h3>
                <p className="text-muted-foreground">
                  Customizable themes for different vision impairments including protanopia, deuteranopia, 
                  tritanopia, and high contrast mode.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-card border rounded-lg p-6 transition-all hover:shadow-md">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Book className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Dyslexia Support</h3>
                <p className="text-muted-foreground">
                  OpenDyslexic font, verb highlighting, and special formatting options to make reading 
                  easier for those with dyslexia.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-card border rounded-lg p-6 transition-all hover:shadow-md">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Activity className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">ADHD Mode</h3>
                <p className="text-muted-foreground">
                  Word-by-word reading with colorful animated display to help maintain focus and 
                  reduce distractions.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-card border rounded-lg p-6 transition-all hover:shadow-md">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Image className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Advanced OCR</h3>
                <p className="text-muted-foreground">
                  Extract text from images and documents with our powerful OCR technology, making visual content accessible.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-card border rounded-lg p-6 transition-all hover:shadow-md">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Settings className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Text Formatting</h3>
                <p className="text-muted-foreground">
                  Customize letter spacing, line height, paragraph spacing, and more to create the perfect 
                  reading experience.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-card border rounded-lg p-6 transition-all hover:shadow-md">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Read Aloud</h3>
                <p className="text-muted-foreground">
                  Text-to-speech functionality that reads content aloud, with adjustable speed and voice options.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Solutions Section */}
        <section className="py-20 px-6 lg:px-12 bg-muted">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">Solutions for Every Vision Need</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
              <div className="bg-card rounded-lg p-8 border">
                <h3 className="text-2xl font-semibold mb-4">Color Blindness</h3>
                <p className="mb-6 text-muted-foreground">
                  Our specialized themes transform the interface for different types of color blindness:
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-[#073B80] mr-3 flex-shrink-0 mt-1"></div>
                    <div>
                      <span className="font-medium">Protanopia</span> - Optimized for those with red-green color blindness with blue-yellow contrast
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-[#634024] mr-3 flex-shrink-0 mt-1"></div>
                    <div>
                      <span className="font-medium">Deuteranopia</span> - Enhanced browns and yellows for those who cannot see green
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-[#8A0A0A] mr-3 flex-shrink-0 mt-1"></div>
                    <div>
                      <span className="font-medium">Tritanopia</span> - Red-focused palette for those who cannot perceive blue
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-card rounded-lg p-8 border">
                <h3 className="text-2xl font-semibold mb-4">Reading Disabilities</h3>
                <p className="mb-6 text-muted-foreground">
                  Our app provides specialized tools for different reading challenges:
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="mr-3 font-['OpenDyslexic'] text-xl font-bold w-6 flex-shrink-0">D</div>
                    <div>
                      <span className="font-medium">Dyslexia</span> - OpenDyslexic font, increased letter spacing, and verb highlighting
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-3 font-bold flex-shrink-0 w-6">A</div>
                    <div>
                      <span className="font-medium">ADHD</span> - Word-by-word focus with motion and color to maintain attention
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-3 text-xl font-bold w-6 flex-shrink-0">C</div>
                    <div>
                      <span className="font-medium">Low Vision</span> - High contrast mode with increased font size and spacing
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Future Vision Section */}
        <section className="py-20 px-6 lg:px-12 bg-gradient-to-b from-background to-primary/5">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Our Future Vision</h2>
            <div className="max-w-3xl mx-auto">
              <div className="glass p-8 rounded-xl">
                <MonitorSmartphone className="h-16 w-16 text-primary mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-4">Mobile Accessibility Everywhere</h3>
                <p className="text-lg mb-6">
                  We're developing a mobile application to bring these powerful accessibility 
                  features to your smartphone and tablet, so you can access text comfortably 
                  anywhere, anytime.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                      <Languages className="text-primary h-4 w-4" />
                    </div>
                    <p>Multi-language support with 50+ languages</p>
                  </div>
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                      <Image className="text-primary h-4 w-4" />
                    </div>
                    <p>Camera-based real-time OCR for street signs and menus</p>
                  </div>
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                      <BookOpen className="text-primary h-4 w-4" />
                    </div>
                    <p>Offline reading mode with all accessibility features</p>
                  </div>
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                      <Settings className="text-primary h-4 w-4" />
                    </div>
                    <p>Personal AI assistant to optimize text for your needs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-16">Meet Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Team Member 1 */}
              <Card className="bg-white/70 backdrop-blur-sm border border-primary/10 shadow-sm transition-all hover:shadow-md hover:translate-y-[-5px]">
                <CardContent className="pt-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">AR</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-1">Aiden Rivera</h3>
                  <p className="text-sm text-muted-foreground mb-4">Lead Developer</p>
                  <p className="text-sm">
                    Accessibility advocate with expertise in creating solutions for visual impairments.
                  </p>
                </CardContent>
              </Card>

              {/* Team Member 2 */}
              <Card className="bg-white/70 backdrop-blur-sm border border-primary/10 shadow-sm transition-all hover:shadow-md hover:translate-y-[-5px]">
                <CardContent className="pt-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">SL</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-1">Sophia Lee</h3>
                  <p className="text-sm text-muted-foreground mb-4">UX Designer</p>
                  <p className="text-sm">
                    Expert in creating inclusive interfaces that work for users with diverse needs.
                  </p>
                </CardContent>
              </Card>

              {/* Team Member 3 */}
              <Card className="bg-white/70 backdrop-blur-sm border border-primary/10 shadow-sm transition-all hover:shadow-md hover:translate-y-[-5px]">
                <CardContent className="pt-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">JT</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-1">Julian Thomas</h3>
                  <p className="text-sm text-muted-foreground mb-4">AI Specialist</p>
                  <p className="text-sm">
                    Develops machine learning models for enhanced text processing and OCR capabilities.
                  </p>
                </CardContent>
              </Card>

              {/* Team Member 4 */}
              <Card className="bg-white/70 backdrop-blur-sm border border-primary/10 shadow-sm transition-all hover:shadow-md hover:translate-y-[-5px]">
                <CardContent className="pt-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">MK</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-1">Maya Khan</h3>
                  <p className="text-sm text-muted-foreground mb-4">Accessibility Researcher</p>
                  <p className="text-sm">
                    Studies and implements the latest accessibility standards and best practices.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 lg:px-12 bg-primary/5">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-3xl font-bold mb-8">Ready to Experience Accessible Reading?</h2>
            <p className="text-lg mb-10">
              Try VistaLex today and discover how our tools can transform your reading experience.
            </p>
            <Button 
              size="lg" 
              className="animate-fade-in transition-all hover:scale-105"
              onClick={handleGetStarted}
            >
              Get Started <ArrowRight className="ml-2" />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Welcome;
