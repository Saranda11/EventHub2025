
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Mail, Phone, MessageSquare, Clock, Send, CheckCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(2, { message: "Emri duhet të jetë së paku 2 karaktere" }),
  email: z.string().email({ message: "Emaili nuk është valid" }),
  subject: z.string().min(5, { message: "Subjekti duhet të jetë së paku 5 karaktere" }),
  message: z.string().min(10, { message: "Mesazhi duhet të jetë së paku 10 karaktere" }),
  department: z.string()
});

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      department: "general"
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log(values);
      setIsSubmitting(false);
      setIsSuccess(true);
      
      toast({
        title: "Mesazhi u dërgua me sukses!",
        description: "Do t'ju kontaktojmë së shpejti.",
      });
      
      form.reset();
      
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto max-w-7xl px-6 md:px-10">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Na Kontaktoni
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Keni pyetje, sugjerime apo dëshironi të bashkëpunoni me ne? 
              Jemi këtu për t'ju ndihmuar. Na kontaktoni dhe do t'ju përgjigjemi brenda 24 orëve.
            </p>
          </div>
          
          <div className="grid md:grid-cols-12 gap-10 mb-16">
            {/* Contact Info Column */}
            <div className="md:col-span-4">
              <Card className="bg-secondary/5 border-secondary/20 h-full">
                <CardContent className="p-6 space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-1">Adresa jonë</h3>
                      <p className="text-foreground/70"> <br />Mitrovicë 40000, Kosovë</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-1">Email</h3>
                      <p className="text-foreground/70">info@eventhub.com<br />support@eventhub.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-1">Telefoni</h3>
                      <p className="text-foreground/70"><br /></p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-1">Orari i punës</h3>
                      <p className="text-foreground/70">E Hënë - E Premte: 9:00 - 17:00<br />E Shtunë: 10:00 - 14:00</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Contact Form Column */}
            <div className="md:col-span-8">
              <Card className="border border-border/40">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-semibold">Na dërgoni një mesazh</h2>
                  </div>
                  
                  {isSuccess ? (
                    <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-6 flex items-center gap-4 animate-fade-in">
                      <div className="bg-green-100 p-3 rounded-full">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg mb-1">Faleminderit për mesazhin tuaj!</h3>
                        <p>Mesazhi juaj u dërgua me sukses. Do t'ju kontaktojmë së shpejti.</p>
                      </div>
                    </div>
                  ) : (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-foreground/70">Emri i plotë</FormLabel>
                                <FormControl>
                                  <Input placeholder="Emri juaj i plotë" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-foreground/70">Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="email@juaj.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-foreground/70">Subjekti</FormLabel>
                                <FormControl>
                                  <Input placeholder="Subjekti i mesazhit" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="department"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-foreground/70">Departamenti</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Zgjidhni departamentin" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="general">Pyetje të përgjithshme</SelectItem>
                                    <SelectItem value="technical">Mbështetje teknike</SelectItem>
                                    <SelectItem value="partnerships">Partneritete</SelectItem>
                                    <SelectItem value="careers">Karriera</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground/70">Mesazhi</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Shkruani mesazhin tuaj këtu..." 
                                  className="min-h-[150px]" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full md:w-auto bg-primary hover:bg-primary/90"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>Dërgimi në proces...</>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Dërgo Mesazhin
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Map Section */}
          <div className="mb-16">
  <h2 className="text-2xl font-semibold mb-6 text-center">Gjeni Lokacionin Tonë</h2>
  <div className="bg-secondary/5 border border-secondary/20 rounded-xl overflow-hidden shadow-sm h-[400px] relative">
    <iframe 
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2937.3774894640386!2d20.866748476736354!3d42.891681271153224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1352f5d9c1e1f6a5%3A0x7d142d9b212ac4ce!2sUniversity%20of%20Mitrovica%20%22Isa%20Boletini%22!5e0!3m2!1sen!2s!4v1711378705675!5m2!1sen!2s" 
      width="100%" 
      height="100%" 
      style={{ border: 0 }} 
      allowFullScreen 
      loading="lazy" 
      referrerPolicy="no-referrer-when-downgrade"
      title="UMIB Location"
    ></iframe>
  </div>
</div>

          {/* FAQ Section */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/20 rounded-xl p-8 md:p-10 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center">Pyetje të Shpeshta për Kontaktin</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
                  <span className="bg-primary/20 text-primary w-6 h-6 inline-flex items-center justify-center rounded-full text-sm font-bold">1</span>
                  Sa shpejt do të merrni përgjigje?
                </h3>
                <p className="text-foreground/70 pl-8">
                  Përpiqemi t'i përgjigjemi të gjitha mesazheve brenda 24 orëve gjatë ditëve të punës. 
                  Për raste urgjente, ne rekomandojmë të na kontaktoni drejtpërdrejt në numrin e telefonit.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
                  <span className="bg-primary/20 text-primary w-6 h-6 inline-flex items-center justify-center rounded-full text-sm font-bold">2</span>
                  A ofrojmë mbështetje teknike gjatë fundjavës?
                </h3>
                <p className="text-foreground/70 pl-8">
                  Po, ekipi ynë i mbështetjes teknike është i disponueshëm edhe në fundjavë për të zgjidhur probleme urgjente. 
                  Megjithatë, përgjigjet mund të vonohen pak krahasuar me ditët e punës.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
                  <span className="bg-primary/20 text-primary w-6 h-6 inline-flex items-center justify-center rounded-full text-sm font-bold">3</span>
                  Si mund të bëhem partner me EventHub?
                </h3>
                <p className="text-foreground/70 pl-8">
                  Për mundësi partneriteti, ju lutemi zgjidhni "Partneritete" në formularin e kontaktit ose na dërgoni një email direkt 
                  në partnerships@eventhub.com me detaje për organizatën tuaj dhe llojin e bashkëpunimit që kërkoni.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
