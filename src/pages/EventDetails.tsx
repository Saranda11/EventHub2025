import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { eventApi, EventResponse } from "@/lib/eventApi";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  Share2,
  Heart,
  DollarSign,
  User,
  Tag,
  Loader2,
  CheckCircle,
  X,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/authContext";
import { toast } from "sonner";

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [event, setEvent] = useState<EventResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEvent();
      if (isAuthenticated) {
        checkRegistrationStatus();
      }
    }
  }, [id, isAuthenticated]);

  const fetchEvent = async () => {
    try {
      const eventData = await eventApi.getEvent(id!);
      setEvent(eventData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching event:", error);
      // Give it a moment in case the event was just created and needs time to be available
      setTimeout(async () => {
        try {
          const eventData = await eventApi.getEvent(id!);
          setEvent(eventData);
          setLoading(false);
        } catch (retryError) {
          console.error("Retry failed:", retryError);
          // Don't show toast error, just redirect silently
          navigate("/events");
          setLoading(false);
        }
      }, 2000);
    }
  };

  const checkRegistrationStatus = async () => {
    if (!id) return;

    setCheckingRegistration(true);
    try {
      const status = await eventApi.checkRegistrationStatus(id);
      setIsRegistered(status.isRegistered);
    } catch (error) {
      console.error("Error checking registration status:", error);
    } finally {
      setCheckingRegistration(false);
    }
  };

  const handleRegister = async () => {
    if (!isAuthenticated) {
      toast.error("Ju duhet të kyçeni për t'u regjistruar për evente");
      navigate("/login");
      return;
    }

    if (!id) return;

    setRegistrationLoading(true);
    try {
      await eventApi.registerForEvent(id);
      setIsRegistered(true);
      toast.success("U regjistruat me sukses");
    } catch (error: any) {
      toast.error(error.message || "Regjistrimi dështoi");
    } finally {
      setRegistrationLoading(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!id) return;

    setRegistrationLoading(true);
    try {
      await eventApi.cancelRegistration(id);
      setIsRegistered(false);
      toast.success("Regjistrimi u anulua me sukses");
    } catch (error: any) {
      toast.error(error.message || "Anulimi i regjistrimit dështoi");
    } finally {
      setRegistrationLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && event) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast.success("Lidhja u kopjua në clipboard");
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Lidhja u kopjua në clipboard");
    }
  };

  const addToCalendar = () => {
    if (!event) return;

    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title
    )}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent(
      event.description
    )}&location=${encodeURIComponent(event.location)}`;

    window.open(calendarUrl, "_blank");
  };

  const handleDeleteEvent = async () => {
    if (!id || !event) return;

    const confirmDelete = window.confirm(
      `Jeni i sigurt që doni të fshini eventin "${event.title}"? Ky veprim nuk mund të anullohet.`
    );

    if (!confirmDelete) return;

    setDeleteLoading(true);
    try {
      await eventApi.deleteEvent(id);
      toast.success("Eventi u fshi me sukses");
      navigate("/events");
    } catch (error: any) {
      toast.error(error.message || "Fshirja e eventit dështoi");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Duke ngarkuar detajet e eventit...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-4">Eventi nuk u gjet</p>
            <Button onClick={() => navigate("/events")}>Kthehu te Eventet</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const now = new Date();
  const isEventPast = endDate < now;
  const isRegistrationOpen = event.status === "upcoming" && !isEventPast;
  const canCancelRegistration =
    isRegistered &&
    event.allowCancellation &&
    new Date(startDate.getTime() - event.cancellationDeadlineHours * 60 * 60 * 1000) > now;
  const isOrganizer = user && event.organizer.id === user.id;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("sq-AL", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("sq-AL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto max-w-4xl px-6 md:px-10">
          {/* Back Button */}
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate("/events")} className="text-primary hover:text-primary/80">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kthehu te Eventet
            </Button>
          </div>

          {/* Event Header */}
          <div className="relative mb-8">
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-100">
              <img
                src={
                  event.imageUrl ||
                  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
                }
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <Badge
                className={cn(
                  "px-3 py-1 text-sm font-semibold",
                  event.category === "Akademik" && "bg-blue-100 text-blue-800 hover:bg-blue-200",
                  event.category === "Kulturor" && "bg-purple-100 text-purple-800 hover:bg-purple-200",
                  event.category === "Sportiv" && "bg-green-100 text-green-800 hover:bg-green-200",
                  event.category === "Social" && "bg-orange-100 text-orange-800 hover:bg-orange-200",
                  event.category === "Teknologjik" && "bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
                )}
              >
                {event.category}
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
              {isOrganizer && (
                <Button 
                  size="sm" 
                  variant="destructive" 
                  className="bg-red-600/90 hover:bg-red-600"
                  onClick={handleDeleteEvent}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>

              <div className="prose prose-gray max-w-none mb-8">
                <p className="text-lg text-gray-700 leading-relaxed">{event.description}</p>
              </div>

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Tag className="w-5 h-5 mr-2" />
                    Etiketat
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Organizer Info */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Organizatori
                  </h3>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{event.organizer.name}</p>
                      <p className="text-sm text-gray-600">{event.organizer.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Detajet e Eventit</h3>

                  {/* Date and Time */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start">
                      <Calendar className="w-5 h-5 text-primary mt-0.5 mr-3" />
                      <div>
                        <p className="font-medium">{formatDate(startDate)}</p>
                        <p className="text-sm text-gray-600">
                          {formatTime(startDate)} - {formatTime(endDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-primary mt-0.5 mr-3" />
                      <div>
                        <p className="font-medium">Lokacioni</p>
                        <p className="text-sm text-gray-600">{event.location}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Users className="w-5 h-5 text-primary mt-0.5 mr-3" />
                      <div>
                        <p className="font-medium">Kapaciteti</p>
                        <p className="text-sm text-gray-600">Deri në {event.maxAttendees} pjesëmarrës</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <DollarSign className="w-5 h-5 text-primary mt-0.5 mr-3" />
                      <div>
                        <p className="font-medium">Çmimi</p>
                        <p className="text-sm text-gray-600">
                          {event.ticketPrice === 0 ? "Falas" : `€${event.ticketPrice}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="mb-6">
                    <Badge
                      variant={event.status === "upcoming" ? "default" : "secondary"}
                      className="w-full justify-center py-2"
                    >
                      {event.status === "upcoming" && "I Ardhshëm"}
                      {event.status === "ongoing" && "Në Vazhdim"}
                      {event.status === "completed" && "I Përfunduar"}
                      {event.status === "cancelled" && "I Anuluar"}
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {isRegistrationOpen && !isRegistered && (
                      <Button className="w-full" size="lg" onClick={handleRegister} disabled={registrationLoading}>
                        {registrationLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Duke u regjistruar...
                          </>
                        ) : (
                          "Regjistrohu për Event"
                        )}
                      </Button>
                    )}

                    {isRegistered && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center p-3 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                          <span className="text-green-800 font-medium">Jeni regjistruar për këtë event</span>
                        </div>

                        {canCancelRegistration && (
                          <Button
                            variant="outline"
                            className="w-full text-red-600 border-red-200 hover:bg-red-50"
                            onClick={handleCancelRegistration}
                            disabled={registrationLoading}
                          >
                            {registrationLoading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                                Duke anuluar...
                              </>
                            ) : (
                              <>
                                <X className="w-4 h-4 mr-2" />
                                Anulo Regjistrimin
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    )}

                    {!isRegistrationOpen && event.status === "upcoming" && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                        <p className="text-yellow-800 text-sm">Regjistrimi për këtë event është mbyllur</p>
                      </div>
                    )}

                    {isEventPast && (
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
                        <p className="text-gray-600 text-sm">Ky event ka përfunduar</p>
                      </div>
                    )}

                    {!isAuthenticated && isRegistrationOpen && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                        <p className="text-blue-800 text-sm mb-2">Duhet të kyçeni për t'u regjistruar</p>
                        <Button size="sm" onClick={() => navigate("/login")} className="w-full">
                          Kyçuni
                        </Button>
                      </div>
                    )}

                    <Button variant="outline" className="w-full" onClick={addToCalendar}>
                      <Calendar className="w-4 h-4 mr-2" />
                      Shto në Kalendar
                    </Button>

                    <Button variant="outline" className="w-full" onClick={handleShare}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Ndaj Eventin
                    </Button>

                    {isOrganizer && (
                      <Button 
                        variant="destructive" 
                        className="w-full" 
                        onClick={handleDeleteEvent}
                        disabled={deleteLoading}
                      >
                        {deleteLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Duke fshirë...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Fshi Eventin
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventDetails;

