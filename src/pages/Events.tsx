import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Calendar, MapPin, Users, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import EventCard, { EventProps } from "@/components/EventCard";
import { eventApi, EventResponse } from "@/lib/eventApi";
import { useQuery } from "@tanstack/react-query";

// Interface for the actual backend response (with _id instead of id)
interface BackendEventResponse {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  organizer: {
    _id: string;
    name: string;
    email: string;
  };
  category: string;
  maxAttendees: number;
  ticketPrice: number;
  imageUrl?: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const Events = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [universityFilter, setUniversityFilter] = useState("all");

  // Fetch events from the backend
  const {
    data: eventsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["events", searchTerm, categoryFilter],
    queryFn: async () => {
      console.log("Fetching events...");
      try {
        const result = await eventApi.getEvents({
          search: searchTerm || undefined,
          category: categoryFilter !== "all" ? categoryFilter : undefined,
          limit: 50, // Get more events to show
        });
        console.log("Events fetched successfully:", result);
        return result;
      } catch (error) {
        console.error("Error fetching events:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Add debugging logs
  console.log("Events component state:", { eventsData, isLoading, error });
  console.log("Transformed events:", eventsData?.events?.length || 0);

  // Transform backend data to match EventCard interface
  const transformEventData = (backendEvent: BackendEventResponse | EventResponse): EventProps => {
    const startDate = new Date(backendEvent.startDate);
    const endDate = new Date(backendEvent.endDate);

    // Handle both _id (MongoDB) and id fields
    const eventId = "_id" in backendEvent ? backendEvent._id : backendEvent.id;

    return {
      id: eventId,
      title: backendEvent.title,
      description: backendEvent.description,
      date: backendEvent.startDate,
      time: `${startDate.toLocaleTimeString("sq-AL", {
        hour: "2-digit",
        minute: "2-digit",
      })} - ${endDate.toLocaleTimeString("sq-AL", { hour: "2-digit", minute: "2-digit" })}`,
      location: backendEvent.location,
      category: backendEvent.category,
      image:
        backendEvent.imageUrl ||
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
      attendees: Math.floor(Math.random() * backendEvent.maxAttendees), // Mock attendees for now
      capacity: backendEvent.maxAttendees,
      organizer: backendEvent.organizer?.name || "Unknown Organizer",
    };
  };

  const events = eventsData?.events?.map(transformEventData) || [];

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const upcomingEvents = filteredEvents.filter((event) => new Date(event.date) >= new Date());
  const pastEvents = filteredEvents.filter((event) => new Date(event.date) < new Date());

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        {/* Hero Banner with Wave Effect */}
        <div className="relative bg-gradient-to-r from-primary/40 to-secondary/30 py-16 mb-16 overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-24 text-background">
              <path
                fill="currentColor"
                fillOpacity="1"
                d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>

          <div className="container mx-auto max-w-7xl px-6 md:px-10 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-block mb-6 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full">
                <span className="flex items-center text-sm font-medium">
                  <Sparkles className="w-4 h-4 mr-2 text-primary" />
                  <span>Eksploro eventet më të fundit për studentët</span>
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Zbulo Eventet Studentore
              </h1>

              <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
                Gjej mundësi unike për të mësuar, rrjetëzuar dhe u argëtuar me eventet e dizajnuara posaçërisht për
                studentët!
              </p>

              <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm shadow-lg rounded-xl p-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary/80 h-5 w-5" />
                  <Input
                    placeholder="Kërko për evente, tema, ose organizatorë..."
                    className="pl-12 py-6 rounded-lg text-lg border-none ring-offset-0 focus-visible:ring-primary/30"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-7xl px-6 md:px-10">
          {/* Category Pills */}
          <div className="mb-12 overflow-x-auto pb-4">
            <div className="flex gap-2 md:gap-3 min-w-max md:justify-center">
              <Button
                variant={categoryFilter === "all" ? "default" : "outline"}
                className="rounded-full px-6 py-2 transition-all duration-300"
                onClick={() => setCategoryFilter("all")}
              >
                Të gjitha
              </Button>
              <Button
                variant={categoryFilter === "Akademik" ? "default" : "outline"}
                className="rounded-full px-6 py-2 transition-all duration-300"
                onClick={() => setCategoryFilter("Akademik")}
              >
                <Book className="mr-2 h-4 w-4" />
                Akademike
              </Button>
              <Button
                variant={categoryFilter === "Teknologjik" ? "default" : "outline"}
                className="rounded-full px-6 py-2 transition-all duration-300"
                onClick={() => setCategoryFilter("Teknologjik")}
              >
                <Laptop className="mr-2 h-4 w-4" />
                Teknologjike
              </Button>
              <Button
                variant={categoryFilter === "Kulturor" ? "default" : "outline"}
                className="rounded-full px-6 py-2 transition-all duration-300"
                onClick={() => setCategoryFilter("Kulturor")}
              >
                <Music className="mr-2 h-4 w-4" />
                Kulturore
              </Button>
              <Button
                variant={categoryFilter === "Sportiv" ? "default" : "outline"}
                className="rounded-full px-6 py-2 transition-all duration-300"
                onClick={() => setCategoryFilter("Sportiv")}
              >
                <Trophy className="mr-2 h-4 w-4" />
                Sportive
              </Button>
              <Button
                variant={categoryFilter === "Social" ? "default" : "outline"}
                className="rounded-full px-6 py-2 transition-all duration-300"
                onClick={() => setCategoryFilter("Social")}
              >
                <Users className="mr-2 h-4 w-4" />
                Sociale
              </Button>
            </div>
          </div>

          {/* Advanced Filter */}
          <div className="bg-secondary/10 backdrop-blur-sm rounded-xl p-6 mb-12 shadow-sm border border-secondary/20 animate-fade-in">
            <div className="grid gap-6 md:grid-cols-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block text-foreground/70">Kërko</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Kërko evente..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block text-foreground/70">Kategoria</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <span className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="Kategoria" />
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Të gjitha kategoritë</SelectItem>
                    <SelectItem value="Akademik">Akademik</SelectItem>
                    <SelectItem value="Teknologjik">Teknologjik</SelectItem>
                    <SelectItem value="Kulturor">Kulturor</SelectItem>
                    <SelectItem value="Sportiv">Sportiv</SelectItem>
                    <SelectItem value="Social">Social</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block text-foreground/70">Universiteti</label>
                <Select value={universityFilter} onValueChange={setUniversityFilter}>
                  <SelectTrigger>
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <SelectValue placeholder="Universiteti" />
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Të gjitha universitetet</SelectItem>
                    <SelectItem value="UMIB">Universiteti i Mitrovicës</SelectItem>
                    <SelectItem value="UP">Universiteti i Prishtinës</SelectItem>
                    <SelectItem value="UBT">UBT</SelectItem>
                    <SelectItem value="AAB">AAB</SelectItem>
                    <SelectItem value="FAMA">Kolegji FAMA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg">Duke ngarkuar eventet...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16 bg-red-50 rounded-xl border border-red-200">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <Calendar className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl text-red-800 font-semibold mb-2">Gabim në ngarkim</h3>
              <p className="text-red-600 max-w-md mx-auto">
                Ka ndodhur një gabim gjatë ngarkimit të eventeve. Ju lutemi provoni përsëri.
              </p>
            </div>
          )}

          {/* Events Tabs */}
          {!isLoading && !error && (
            <Tabs defaultValue="upcoming" className="mb-12">
              <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-background/80 backdrop-blur-sm shadow-sm border border-border/40 rounded-lg">
                <TabsTrigger
                  value="upcoming"
                  className="text-lg py-3 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Eventet e Ardhshme
                </TabsTrigger>
                <TabsTrigger
                  value="past"
                  className="text-lg py-3 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Eventet e Kaluara
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="mt-0">
                {upcomingEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingEvents.map((event, index) => (
                      <div key={event.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="group hover:scale-[1.02] transition-all duration-300">
                          <EventCard event={event} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-secondary/5 rounded-xl border border-secondary/20">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                      <Calendar className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl text-primary font-semibold mb-2">Nuk u gjetën evente</h3>
                    <p className="text-foreground/70 max-w-md mx-auto">
                      Nuk ka evente që përputhen me kriteret e kërkimit tuaj. Provoni të ndryshoni filtrat ose të
                      kërkoni diçka tjetër.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="past" className="mt-0">
                {pastEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastEvents.map((event, index) => (
                      <div
                        key={event.id}
                        className="animate-fade-in opacity-70 hover:opacity-100 transition-opacity"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <EventCard event={event} />
                          <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                            Përfunduar
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-secondary/5 rounded-xl border border-secondary/20">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                      <Calendar className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl text-primary font-semibold mb-2">Nuk u gjetën evente të kaluara</h3>
                    <p className="text-foreground/70 max-w-md mx-auto">
                      Nuk ka evente të kaluara që përputhen me kriteret e kërkimit tuaj.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}

          {/* Call-to-Action Section */}
          <div className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary rounded-xl p-10 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-overlay opacity-20 transform translate-x-1/4 -translate-y-1/4"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full mix-blend-overlay opacity-10 transform -translate-x-1/4 translate-y-1/4"></div>

            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Dëshiron të krijosh dhe menaxhosh eventet e tua?
              </h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto text-white/90">
                Si organizues eventesh, mund të krijosh dhe promovosh aktivitetet tua akademike, kulturore ose sociale
                për të gjithë komunitetin studentor të Kosovës.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/create-event"
                  className="bg-white text-primary font-semibold px-8 py-3 rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>Krijo një Event</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/how-it-works"
                  className="bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center gap-2 border border-white/30"
                >
                  <span>Mëso si funksionon</span>
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

export default Events;

// These components don't exist in the original file, but we need them for the new design
const Book = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);

const Laptop = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    <line x1="2" y1="20" x2="22" y2="20"></line>
  </svg>
);

const Music = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 18V5l12-2v13"></path>
    <circle cx="6" cy="18" r="3"></circle>
    <circle cx="18" cy="16" r="3"></circle>
  </svg>
);

const Trophy = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
    <path d="M4 22h16"></path>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
  </svg>
);
