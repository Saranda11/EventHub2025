import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import EventCard, { EventProps } from './EventCard';
import { ArrowRight } from 'lucide-react';
import { eventApi, EventResponse } from '../lib/eventApi';

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

const FeaturedEvents = () => {
  // Fetch featured events using React Query
  const {
    data: eventsData,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["featured-events"],
    queryFn: async () => {
      console.log("Fetching featured events...");
      try {
        const result = await eventApi.getEvents({
          status: 'upcoming',
          limit: 4,
          page: 1
        });
        console.log("Featured events fetched successfully:", result);
        return result;
      } catch (error) {
        console.error("Error fetching featured events:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Transform backend event data to frontend event props
  const transformEventData = (backendEvent: BackendEventResponse | EventResponse): EventProps => {
    const startDate = new Date(backendEvent.startDate);
    const endDate = new Date(backendEvent.endDate);
    
    // Handle both _id (MongoDB) and id fields
    const eventId = "_id" in backendEvent ? backendEvent._id : backendEvent.id;
    
    // Format time range
    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('sq-AL', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    };
    
    const timeRange = `${formatTime(startDate)} - ${formatTime(endDate)}`;
    
    return {
      id: eventId,
      title: backendEvent.title,
      description: backendEvent.description,
      date: backendEvent.startDate,
      time: timeRange,
      location: backendEvent.location,
      category: backendEvent.category,
      image: backendEvent.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
      attendees: 0, // This would need to come from registration data
      capacity: backendEvent.maxAttendees,
      organizer: backendEvent.organizer?.name || "Unknown Organizer"
    };
  };

  const events = eventsData?.events?.map(transformEventData) || [];

  if (loading) {
    return (
      <section className="section-padding">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">Evente të Spikatura</h2>
              <p className="text-lg text-foreground/70 max-w-2xl">
                Zbulo aktivitetet më interesante që po ndodhin në universitetet e Kosovës
              </p>
            </div>
            
            <Link to="/events" className="mt-4 md:mt-0 btn-secondary flex items-center gap-2">
              <span>Shiko të gjitha</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-muted rounded-xl h-48 mb-4"></div>
                <div className="bg-muted rounded h-4 mb-2"></div>
                <div className="bg-muted rounded h-4 w-3/4 mb-2"></div>
                <div className="bg-muted rounded h-4 w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-padding">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">Evente të Spikatura</h2>
              <p className="text-lg text-foreground/70 max-w-2xl">
                Zbulo aktivitetet më interesante që po ndodhin në universitetet e Kosovës
              </p>
            </div>
            
            <Link to="/events" className="mt-4 md:mt-0 btn-secondary flex items-center gap-2">
              <span>Shiko të gjitha</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="text-center py-12">
            <p className="text-lg text-foreground/70 mb-4">Nuk mundën të ngarkohen event-et në këtë moment.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary"
            >
              Provo përsëri
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">Evente të Spikatura</h2>
            <p className="text-lg text-foreground/70 max-w-2xl">
              Zbulo aktivitetet më interesante që po ndodhin në universitetet e Kosovës
            </p>
          </div>
          
          <Link to="/events" className="mt-4 md:mt-0 btn-secondary flex items-center gap-2">
            <span>Shiko të gjitha</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-foreground/70 mb-4">Nuk ka evente të disponueshme për momentin.</p>
            <Link to="/create-event" className="btn-primary">
              Krijo Event të parë
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((event, index) => (
              <div 
                key={event.id} 
                className="animate-fade-in" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedEvents;
