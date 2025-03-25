import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Heart, Target, Users, Lightbulb, BookOpen, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto max-w-7xl px-6 md:px-10">

          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-2xl mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80"></div>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
            <div className="relative z-10 py-20 px-8 text-center text-white">
              <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                Platforma #1 për Evente Studentore
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
                Rreth EventHub
              </h1>
              <p className="text-lg md:text-xl mb-0 max-w-3xl mx-auto text-white/90">
                Mision ynë është të lidhim studentët me mundësi të vlefshme për edukim, 
                rrjetëzim dhe zhvillim profesional përmes eventeve të ndryshme.
              </p>
            </div>
          </div>

          {/* Historiku */}
          <div className="mb-16">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-semibold mb-6 text-primary">Historiku ynë</h2>
                <div className="space-y-4">
                  <p className="text-lg leading-relaxed">
                    EventHub është themeluar në vitin 2025 nga një grup studentësh të Universitetit të Mitrovicës, të cilët
                    vunë re nevojën për një platformë të dedikuar për organizimin dhe promovimin e eventeve studentore.
                  </p>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -z-10 -inset-1 bg-gradient-to-tr from-primary/10 to-secondary/20 rounded-xl transform rotate-3 blur-sm group-hover:blur-md transition-all duration-300"></div>
                <img 
                  src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
                  alt="EventHub foundation" 
                  className="rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Tabs: Misioni, Vizioni, Vlerat */}
          <div className="mb-16">
            <Tabs defaultValue="mission" className="animate-fade-in">
              <TabsList className="grid w-full grid-cols-3 mb-10 p-1 bg-background border border-border/40 rounded-lg">
                <TabsTrigger value="mission" className="text-lg py-3 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Target className="mr-2 h-4 w-4" />
                  Misioni Ynë
                </TabsTrigger>
                <TabsTrigger value="vision" className="text-lg py-3 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Vizioni Ynë
                </TabsTrigger>
                <TabsTrigger value="values" className="text-lg py-3 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Heart className="mr-2 h-4 w-4" />
                  Vlerat Tona
                </TabsTrigger>
              </TabsList>

              <TabsContent value="mission" className="mt-0">
                <div className="bg-secondary/10 backdrop-blur-sm rounded-xl p-8 border border-secondary/20">
                  <div className="max-w-3xl mx-auto">
                    <h3 className="text-2xl font-semibold mb-6 flex items-center">
                      <Target className="h-6 w-6 text-primary mr-3" />
                      <span>Misioni Ynë</span>
                    </h3>
                    <p className="text-lg leading-relaxed mb-6">
                      Ne besojmë se jeta studentore nuk është vetëm për studimet akademike, por edhe për krijimin e lidhjeve 
                      sociale, zhvillimin e aftësive të reja dhe eksplorimin e interesave të ndryshme. 
                    </p>
                    <p className="text-lg leading-relaxed mb-6">
                      EventHub synon të bëjë të mundur këtë përvojë të pasur studentore duke ndërtuar urën mes studentëve, 
                      organizatorëve të eventeve dhe universiteteve përmes një platforme moderne dhe të lehtë për përdorim.
                    </p>
                    <p className="text-lg leading-relaxed">
                      Misioni ynë është të krijojmë një komunitet vibrant të studentëve në Kosovë, ku shkëmbimi i dijeve, 
                      kulturës dhe përvojave bëhet në mënyrë të organizuar dhe të aksesueshme për të gjithë.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="vision" className="mt-0">
                <div className="bg-primary/10 backdrop-blur-sm rounded-xl p-8 border border-primary/20">
                  <div className="max-w-3xl mx-auto">
                    <h3 className="text-2xl font-semibold mb-6 flex items-center">
                      <Lightbulb className="h-6 w-6 text-primary mr-3" />
                      <span>Vizioni Ynë</span>
                    </h3>
                    <p className="text-lg leading-relaxed mb-6">
                      EventHub aspiron të bëhet platforma kryesore dhe më gjithëpërfshirëse për menaxhimin e eventeve studentore në 
                      Kosovë dhe më gjerë në rajonin e Ballkanit Perëndimor.
                    </p>
                    <p className="text-lg leading-relaxed mb-6">
                      Ne synojmë të krijojmë një ekosistem dixhital ku çdo student në Kosovë të ketë qasje në mundësi të reja, 
                      të lidhet me ekspertë të fushave të ndryshme dhe të zhvillojë aftësitë e tij përmes eventeve të ndryshme.
                    </p>
                    <p className="text-lg leading-relaxed">
                      Në të ardhmen, shikojmë EventHub si një platformë që mbështet jo vetëm organizimin e eventeve, por edhe 
                      ndërlidhjen e studentëve me mundësi karriere, bursa akademike dhe projekte kërkimore.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="values" className="mt-0">
                <div className="bg-accent/10 backdrop-blur-sm rounded-xl p-8 border border-accent/20">
                  <div className="max-w-3xl mx-auto">
                    <h3 className="text-2xl font-semibold mb-6 flex items-center">
                      <Heart className="h-6 w-6 text-primary mr-3" />
                      <span>Vlerat Tona</span>
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="flex gap-4">
                        <div className="bg-primary/10 p-3 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold mb-2">Komunitet</h4>
                          <p className="text-foreground/70">Ne besojmë në fuqinë e komunitetit dhe bashkëpunimit.</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="bg-primary/10 p-3 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold mb-2">Edukim</h4>
                          <p className="text-foreground/70">Qëllimi ynë është të avancojmë edukimin e studentëve në Kosovë.</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="bg-primary/10 p-3 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0">
                          <Award className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold mb-2">Cilësi</h4>
                          <p className="text-foreground/70">Ofrojmë një platformë cilësore dhe evente të besueshme.</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="bg-primary/10 p-3 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0">
                          <Globe className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold mb-2">Gjithëpërfshirje</h4>
                          <p className="text-foreground/70">EventHub është i hapur për të gjithë studentët, pa përjashtime.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-8 text-center text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">Bëhu Pjesë e Komunitetit tonë</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
                Nëse jeni të interesuar për të bashkëpunuar me ne, për të sponsorizuar platformën, apo për të na ndihmuar në çfarëdo mënyre, ju ftojmë të na kontaktoni.
              </p>
              <Link to="/contact" className="bg-white text-primary font-semibold px-8 py-3 rounded-lg hover:bg-white/90 transition-colors inline-flex items-center gap-2 shadow-lg">
                <span>Na Kontaktoni</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
