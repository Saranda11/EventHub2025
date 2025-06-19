import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EventProps {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image: string;
  attendees: number;
  capacity?: number;
  organizer: string;
}

const EventCard = ({ event }: { event: EventProps }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Handle mouse move for the light effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Reset the coords when mouse leaves
  const handleMouseLeave = () => {
    setCoords({ x: 0, y: 0 });
  };

  // Date formatting
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("sq-AL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Handle navigation to event details
  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Option 1: Navigate in same tab
    navigate(`/events/${event.id}`);

    // Option 2: Open in new tab (uncomment this and comment above if you want new tab)
    // window.open(`/events/${event.id}`, '_blank');
  };

  return (
    <div
      ref={cardRef}
      className="magic-card overflow-hidden bg-card rounded-xl shadow-sm border border-border/60 hover:shadow-md hover:border-border transition-all duration-300"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        {
          "--x": `${coords.x}px`,
          "--y": `${coords.y}px`,
        } as React.CSSProperties
      }
    >
      <div className="relative overflow-hidden aspect-video">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span
            className={cn(
              "px-3 py-1 text-xs font-semibold rounded-full",
              event.category === "Akademik" && "bg-blue-100 text-blue-800",
              event.category === "Kulturor" && "bg-purple-100 text-purple-800",
              event.category === "Sportiv" && "bg-green-100 text-green-800",
              event.category === "Social" && "bg-orange-100 text-orange-800",
              event.category === "Teknologjik" && "bg-indigo-100 text-indigo-800"
            )}
          >
            {event.category}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center space-x-2 mb-3 text-xs text-foreground/70">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-foreground/30"></div>
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            <span>{event.time}</span>
          </div>
        </div>

        <h3 className="font-display text-xl font-semibold mb-2 line-clamp-2 text-balance">{event.title}</h3>

        <p className="text-sm text-foreground/70 mb-4 line-clamp-2">{event.description}</p>

        <div className="flex items-center mb-4 text-sm">
          <MapPin className="w-4 h-4 text-foreground/70 mr-2" />
          <span className="text-foreground/70 truncate">{event.location}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-foreground/70">
            <Users className="w-4 h-4 mr-1" />
            <span>
              {event.attendees}
              {event.capacity && ` / ${event.capacity}`} pjesëmarrës
            </span>
          </div>

          <button
            onClick={handleViewDetails}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary hover:text-white rounded-lg transition-all duration-200 hover:shadow-md cursor-pointer z-10 relative"
          >
            <span>Më shumë</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
