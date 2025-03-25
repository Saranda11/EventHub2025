
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-primary/5 to-secondary/30 pt-16 pb-8">
      <div className="container mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-display font-bold text-primary">EventHub</h3>
            <p className="text-foreground/70 text-sm max-w-xs">
              Platforma e parë në Kosovë për menaxhimin e eventeve të studentëve, duke i ndihmuar ata të organizojnë dhe të marrin pjesë në aktivitete akademike, kulturore dhe sociale.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-lg mb-3">Navigimi i Shpejtë</h4>
            <nav className="flex flex-col space-y-2 text-foreground/70">
              <Link to="/" className="hover:text-primary transition-colors">Ballina</Link>
              <Link to="/events" className="hover:text-primary transition-colors">Evente</Link>
              <Link to="/how-it-works" className="hover:text-primary transition-colors">Si Funksionon</Link>
              <Link to="/about" className="hover:text-primary transition-colors">Rreth Nesh</Link>
              <Link to="/contact" className="hover:text-primary transition-colors">Kontakti</Link>
            </nav>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-lg mb-3">Kategorite e Eventeve</h4>
            <nav className="flex flex-col space-y-2 text-foreground/70">
              <Link to="/events?category=akademik" className="hover:text-primary transition-colors">Akademike</Link>
              <Link to="/events?category=kulturor" className="hover:text-primary transition-colors">Kulturore</Link>
              <Link to="/events?category=sportiv" className="hover:text-primary transition-colors">Sportive</Link>
              <Link to="/events?category=teknologjik" className="hover:text-primary transition-colors">Teknologjike</Link>
              <Link to="/events?category=social" className="hover:text-primary transition-colors">Sociale</Link>
            </nav>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-lg mb-3">Kontakti</h4>
            <div className="text-foreground/70 space-y-3 text-sm">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Mitrovicë, Kosovë</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:info@eventhub.com" className="hover:text-primary transition-colors">info@eventhub.com</a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:+38344123456" className="hover:text-primary transition-colors"></a>
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border/40 pt-8 mt-8 text-center">
          <p className="text-foreground/60 text-sm">
            © {currentYear} EventHub - Platforma për Menaxhimin e Eventeve të Studentëve në Kosovë
          </p>
          <div className="mt-4 flex justify-center space-x-4 text-sm text-foreground/60">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Politika e Privatësisë</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-primary transition-colors">Kushtet e Përdorimit</Link>
            <span>•</span>
            <Link to="/cookies" className="hover:text-primary transition-colors">Politika e Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
