
import React, { useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { CheckCircle2, Users, Calendar, Search, PenTool, Bell, Rocket, ArrowRight, Clipboard, Lock, Star, Flag, HelpCircle, Smartphone } from 'lucide-react';

const HowItWorks = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const steps = [
    {
      title: "Regjistrohu në Platformë",
      description: "Krijoni një llogari duke përdorur email-in tuaj universitar për të konfirmuar statusin tuaj si student.",
      icon: <Users className="h-6 w-6" />,
      color: "bg-blue-50 text-blue-600",
      details: [
        "Klikoni butonin 'Regjistrohu' në këndin e sipërm djathtas",
        "Plotësoni formularin me të dhënat tuaja personale",
        "Verifikoni emailin tuaj universitar",
        "Përfundoni profilin tuaj duke shtuar informacione shtesë"
      ]
    },
    {
      title: "Eksploro Eventet",
      description: "Shfleto nëpër kategori të ndryshme të eventeve për të gjetur ato që ju interesojnë.",
      icon: <Search className="h-6 w-6" />,
      color: "bg-purple-50 text-purple-600",
      details: [
        "Përdorni filtrat për të gjetur evente sipas kategorisë, datës ose universitetit",
        "Shikoni evente të rekomanduara bazuar në interesat tuaja",
        // "Ruani eventet që ju interesojnë për t'i parë më vonë",
        "Ndiqni organizatorët për të parë eventet e tyre të ardhshme"
      ]
    },
    {
      title: "Regjistrohu për Evente",
      description: "Rezervoni vendin tuaj në evente me një klikim të thjeshtë.",
      icon: <Calendar className="h-6 w-6" />,
      color: "bg-green-50 text-green-600",
      details: [
        "Klikoni butonin 'Regjistrohu' në faqen e eventit",
        "Konfirmoni pjesëmarrjen tuaj dhe plotësoni çdo informacion shtesë të kërkuar",
       , "Nëse nuk mund të merrni pjesë, ju lutemi anuloni regjistrimin për të liruar vendin për pjesëmarrës të tjerë",
      
      ]
    },
    {
      title: "Krijo dhe Menaxho Eventet Tua",
      description: "Organizoni eventet tuaja dhe menaxhoni pjesëmarrësit me lehtësi.",
      icon: <PenTool className="h-6 w-6" />,
      color: "bg-orange-50 text-orange-600",
      details: [
        "Klikoni 'Krijo Event' në dashboard-in tuaj",
        "Plotësoni të gjitha detajet e nevojshme për eventin tuaj",
        "Shtoni informacione për lokacionin, datën, përshkrimin dhe kategorinë",
        "Publikoni eventin"
      ]
    }
  ];

  const faqs = [
    {
      question: "Si mund të bëhem organizator eventesh?",
      answer: "Çdo përdorues i regjistruar në platformë mund të bëhet organizator eventesh. Pasi të keni krijuar llogarinë tuaj, mund të shkoni te profili juaj dhe të klikoni në 'Bëhu Organizator'. Pas verifikimit të të dhënave tuaja, do të keni qasje në panelin e organizatorit ku mund të krijoni dhe menaxhoni eventet tuaja."
    },
    {
      question: "A mund të anuloj pjesëmarrjen time në një event?",
      answer: "Po, mund ta anuloni pjesëmarrjen tuaj në një event."
    },
    {
      question: "A mund të marr certifikatë pjesëmarrjeje në një event?",
      answer: "Po, disa organizatorë eventesh ofrojnë certifikata pjesëmarrjeje."
    },
    {
      question: "Si mund të gjej eventet që më interesojnë?",
      answer: "EventHub ofron filtra të avancuar për kërkim, përfshirë kategoritë (akademik, kulturor, social), vendndodhjen, datën. Mund të përdorni edhe fjalë kyçe për të kërkuar evente specifike."
    },
    {
      question: "Si mund të promovoj eventin tim?",
      answer: "EventHub ofron disa mjete për promovimin e eventeve. Mund të përdorni opsionin 'Ndaj në Rrjete Sociale' për të shpërndarë eventin tuaj në platforma si Facebook, Instagram ose LinkedIn. Gjithashtu, eventet me cilësi të lartë mund të zgjidhen për t'u shfaqur në seksionin 'Të Rekomanduara' në faqen kryesore."
    },
    {
      question: "Si mund të rris pjesëmarrjen në eventin tim?",
      answer: "Për të rritur pjesëmarrjen, sigurohuni që përshkrimi i eventit të jetë tërheqës dhe i qartë. Përdorni imazhe cilësore, ndani eventin në rrjete sociale dhe ftoni drejtpërdrejt pjesëmarrës përmes emailit. ."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto max-w-7xl px-6 md:px-10">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-r from-primary/20 to-secondary/30 rounded-2xl p-10 mb-16">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-secondary/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                Thjesht dhe Efektive
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
                Si Funksionon EventHub
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 mb-8">
                EventHub është dizajnuar për të qenë i thjeshtë për t'u përdorur, duke ju ndihmuar 
                të gjeni dhe të merrni pjesë në evente studentore me lehtësi, ose të organizoni eventet tuaja.
              </p>
            </div>
          </div>
          
          {/* Main Steps Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-semibold mb-12 text-center">Katër Hapa të Thjeshtë</h2>
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              {steps.map((step, index) => (
                <div key={index} className="bg-background rounded-xl p-8 shadow-sm border border-border/40 hover:shadow-md transition-shadow transform hover:-translate-y-1 duration-300 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="flex items-start gap-4">
                    <div className={`${step.color} p-3 rounded-full`}>
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-foreground/70 mb-4">{step.description}</p>
                      
                      <ul className="space-y-2">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                            <span className="text-sm text-foreground/80">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Mobile App Section */}
          {/* <div className="mb-20">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-semibold mb-6">EventHub në telefonin tuaj</h2>
                <p className="text-lg text-foreground/70 mb-6">
                  Qasja në evente është edhe më e lehtë me aplikacionin tonë mobil, 
                  i disponueshëm për Android dhe iOS. Shkarkoni aplikacionin për të pasur 
                  qasje të shpejtë në të gjitha funksionalitetet kryesore të platformës.
                </p>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium">Njoftime në kohë reale</h3>
                      <p className="text-foreground/70">Merr njoftime të menjëhershme për eventet dhe ndryshimet.</p>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium">Bileta offline</h3>
                      <p className="text-foreground/70">Qasje në biletat tuaja edhe pa internet.</p>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium">Navigim i thjeshtë</h3>
                      <p className="text-foreground/70">Gjeni vendndodhjen e eventeve me Google Maps të integruar.</p>
                    </div>
                  </li>
                </ul>
                
                <div className="flex flex-wrap gap-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/1024px-Google_Play_Store_badge_EN.svg.png" alt="Google Play" className="h-8" />
                  </Button>
                  
                  <Button variant="outline" className="flex items-center gap-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/1280px-Download_on_the_App_Store_Badge.svg.png" alt="App Store" className="h-8" />
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -z-10 -inset-4 bg-gradient-to-tr from-primary/10 to-secondary/20 rounded-3xl transform -rotate-3 blur-sm"></div>
                <img 
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
                  alt="EventHub mobile app" 
                  className="rounded-xl shadow-lg transform hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </div>
          </div> */}
          
          {/* FAQ Section */}
          <div className="mb-20">
            <div className="text-center mb-10">
              <span className="inline-block bg-secondary/20 text-secondary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                Ndihmë & Mbështetje
              </span>
              <h2 className="text-3xl font-semibold">Pyetje të Shpeshta</h2>
            </div>
            
            <div className="bg-card border border-border/40 rounded-xl p-6 md:p-8 shadow-sm">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b border-border/60 last:border-0">
                    <AccordionTrigger className="text-lg font-medium py-4 hover:text-primary transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/70 text-base pb-6">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            
            <div className="mt-10 text-center">
              <p className="text-lg mb-4">Ke pyetje të tjera?</p>
              <Link to="/contact" className="btn-secondary inline-flex items-center gap-2 bg-primary/10 px-6 py-2 rounded-lg text-primary hover:bg-primary/20 transition-colors">
                <HelpCircle className="w-4 h-4" />
                <span>Na Kontaktoni</span>
              </Link>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-xl overflow-hidden relative">
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1511988617509-a57c8a288659?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
            </div>
            <div className="relative z-10 p-10 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Gati për të filluar?
              </h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto text-white/90">
                Regjistrohu sot dhe eksploro të gjitha mundësitë që EventHub ofron për studentët 
                dhe organizatorët e eventeve në Kosovë.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/register" className="bg-white text-primary font-semibold px-8 py-3 rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2 shadow-lg">
                  <span>Regjistrohu Tani</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                
                <Link to="/events" className="bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center gap-2 border border-white/30">
                  <span>Eksploro Eventet</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;
