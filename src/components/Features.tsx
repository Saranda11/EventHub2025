
import React, { useEffect, useRef } from 'react';
import { Calendar, Search, Users, Award, Bell, Lock, Share2, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const Features = () => {
  const features: FeatureProps[] = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Krijo dhe Menaxho Evente",
      description: "Krijo evente të personalizuara, cakto datën, vendin dhe shto detajet e nevojshme në një platformë të lehtë për përdorim.",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Zbulo Evente Sipas Interesave",
      description: "Kërko evente sipas kategorive, universiteteve, ose interesave të tua, gjithçka personalizuar për nevojat e studentëve.",
      color: "bg-purple-50 text-purple-600"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Bashkohu me Komunitetin Studentor",
      description: "Ndërto rrjetin tënd të kontakteve, njohu me studentë të tjerë dhe bashkohu me komunitete me interesa të përbashkëta.",
      color: "bg-green-50 text-green-600"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Rezervo Bileta për Evente",
      description: "Siguro vendin tënd në evente me rezervim të biletave dixhitale të përshtatura për lehtësirat e studentëve.",
      color: "bg-orange-50 text-orange-600"
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Njoftime në Kohë Reale",
      description: "Merr njoftime personalizuara për eventet e ardhshme dhe ndryshimet në orare, nëpërmjet emailit ose aplikacionit.",
      color: "bg-red-50 text-red-600"
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Siguri dhe Besueshmëri",
      description: "Të gjitha të dhënat dhe transaksionet janë të siguruara për të garantuar një përvojë të besueshme për studentët.",
      color: "bg-indigo-50 text-indigo-600"
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: "Ndaj dhe Promovo Evente",
      description: "Ndaj eventet me miqtë tuaj në rrjetet sociale dhe promovo aktivitetet që organizon në mënyrë të lehtë.",
      color: "bg-teal-50 text-teal-600"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Mbështetje Shumëgjuhësore",
      description: "Platforma disponohet në dy gjuhë, shqip dhe anglisht, për të përmbushur nevojat e të gjithë studentëve në Kosovë.",
      color: "bg-cyan-50 text-cyan-600"
    }
  ];

  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (featuresRef.current) {
      const elements = featuresRef.current.querySelectorAll('.feature-card');
      elements.forEach(el => observer.observe(el));
    }

    return () => {
      if (featuresRef.current) {
        const elements = featuresRef.current.querySelectorAll('.feature-card');
        elements.forEach(el => observer.unobserve(el));
      }
    };
  }, []);

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Çfarë Ofron EventHub?
          </h2>
          <p className="text-lg text-foreground/70">
            Platforma jonë është e dizajnuar për të lehtësuar organizimin dhe pjesëmarrjen në evente studentore, 
            duke ofruar një eksperiencë të personalizuar për nevojat tuaja.
          </p>
        </div>

        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card opacity-0 glass rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", feature.color)}>
                {feature.icon}
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-foreground/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
