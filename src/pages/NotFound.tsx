
import React, { useEffect } from 'react';
import { useLocation, Link } from "react-router-dom";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center py-24">
        <div className="text-center px-6">
          <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
          <p className="text-2xl text-foreground/80 mb-8">Faqja që kërkuat nuk u gjet</p>
          <p className="text-lg text-foreground/60 max-w-md mx-auto mb-8">
            Na vjen keq, por faqja që po kërkoni nuk ekziston ose është zhvendosur.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium">
            <ArrowLeft className="h-4 w-4" />
            <span>Kthehu në Ballinë</span>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
