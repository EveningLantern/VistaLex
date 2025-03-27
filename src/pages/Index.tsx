
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TextProcessor from "@/components/TextProcessor";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-6 mt-16">
        <div className="container mx-auto px-4 pb-6">
          <h1 className="text-3xl font-bold text-center mb-8 text-primary">Text Processing & Accessibility Tools</h1>
        </div>
        <TextProcessor />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
