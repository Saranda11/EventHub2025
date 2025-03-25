
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturedEvents from '@/components/FeaturedEvents';
import Features from '@/components/Features';
import Footer from '@/components/Footer';

const Index = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/30 opacity-50 -z-10"></div>
          <FeaturedEvents />
        </div>
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
