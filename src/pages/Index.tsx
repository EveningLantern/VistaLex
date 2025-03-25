
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TextProcessor from "@/components/TextProcessor";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-6">
        <TextProcessor />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
