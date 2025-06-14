import Header from '../Header';
import Footer from '../Footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#f4f6fa] min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-1 w-full mx-auto max-w-[1440px] px-4 md:px-8 pt-4 pb-12">
        {children}
      </main>
      <Footer />
    </div>
  );
} 