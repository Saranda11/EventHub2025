
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Users, MapPin, Star, TrendingUp } from 'lucide-react';

const Hero = () => {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!parallaxRef.current) return;
      
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      const parallaxItems = parallaxRef.current.querySelectorAll('.parallax-item');
      
      parallaxItems.forEach((item, i) => {
        const depth = (i + 1) * 0.01;
        const moveX = (x - 0.5) * depth * 50;
        const moveY = (y - 0.5) * depth * 50;
        
        (item as HTMLElement).style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-10">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-secondary/30 z-0"></div>
      
      {/* Animated Shapes */}
      <div ref={parallaxRef} className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-primary/5 animate-float parallax-item"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 rounded-full bg-accent/5 animate-float animation-delay-1000 parallax-item"></div>
        <div className="absolute top-1/3 left-1/5 w-72 h-72 rounded-full bg-secondary/20 animate-float animation-delay-2000 parallax-item"></div>
        <div className="absolute bottom-1/4 right-1/5 w-80 h-80 rounded-full bg-primary/10 animate-pulse-slow parallax-item"></div>
      </div>
      
      <div className="container px-6 md:px-10 lg:px-24 max-w-7xl relative z-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-8 items-center">
          <div className="order-2 md:order-1 animate-fade-in" style={{animationDelay: "0.2s"}}>
            <div className="flex flex-col space-y-6">
              <div className="inline-flex mb-2">
                <span className="label-badge">
                  <Calendar className="w-3 h-3 mr-1" />
                  Platforma #1 për Evente Studentore në Kosovë
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-balance">
                Zbulo, Lidhu dhe Merr Pjesë në <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Evente Studentore</span>
              </h1>
              
              <p className="text-lg md:text-xl text-foreground/80 max-w-lg text-balance">
                Platforma e parë në Kosovë për organizimin dhe menaxhimin e eventeve 
                për studentët. Mëso, rrjeto dhe argëtohu me studentë të tjerë.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/events" className="btn-primary flex items-center justify-center space-x-2 group">
                  <span>Eksploro Eventet</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/create-event" className="btn-secondary flex items-center justify-center space-x-2">
                  <span>Krijo një Event</span>
                </Link>
              </div>
              
              <div className="flex flex-wrap gap-y-4 gap-x-6 pt-6 items-center text-sm text-foreground/70">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>100+ Evente Çdo Muaj</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4 text-primary" />
                  <span>10,000+ Studentë</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>5+ Universitete</span>
                </div>
               
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span>Përvoja të reja çdo ditë</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 md:order-2 animate-fade-in" style={{animationDelay: "0.4s"}}>
            <div className="relative">
              {/* Main Image */}
              <div className="glass rounded-2xl overflow-hidden shadow-xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                  alt="Student event"
                  className="w-full h-auto rounded-2xl"
                />
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -bottom-6 -left-6 glass p-4 rounded-lg shadow-lg max-w-[200px] animate-float">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Eventi i ardhshëm</p>
                    <p className="text-xs text-foreground/70">FrontEnd Development • 15 Nëntor</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 glass p-4 rounded-lg shadow-lg max-w-[200px] animate-float" style={{animationDelay: "2s"}}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Komunitet në rritje</p>
                    <p className="text-xs text-foreground/70">500+ pjesëmarrës të rinj këtë muaj</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-1/2 right-[-80px] glass p-4 rounded-lg shadow-lg max-w-[180px] animate-float" style={{animationDelay: "1s"}}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-primary" />
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave effect at the bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
          <path fill="rgba(241, 245, 249, 0.5)" fillOpacity="1" d="M0,128L48,133.3C96,139,192,149,288,176C384,203,480,245,576,234.7C672,224,768,160,864,144C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
