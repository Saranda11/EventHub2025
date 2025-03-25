
import React from 'react';
import { Link } from 'react-router-dom';
import EventCard, { EventProps } from './EventCard';
import { ArrowRight } from 'lucide-react';

const mockEvents: EventProps[] = [
  // {
  //   id: "1",
  //   title: "Konferenca Tech për Studentë",
  //   description: "Mëso teknologjitë e fundit nga ekspertët e industrisë. Ngjarja përfshin panele, workshope dhe networking.",
  //   date: "2023-06-15",
  //   time: "10:00 - 17:00",
  //   location: "Universiteti i Mitrovicës, Salla A1",
  //   category: "Teknologjik",
  //   image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
  //   attendees: 210,
  //   capacity: 250,
  //   organizer: "Klubi i Studentëve të Shkencave Kompjuterike"
  // },
  // // {
  //   id: "2",
  //   title: "Workshop: Dizajn Grafik për Fillestarë",
  //   description: "Mëso bazat e dizajnit grafik, me fokus në Adobe Photoshop dhe Illustrator. Sill laptopin tënd dhe fillo të dizajnosh.",
  //   date: "2023-11-18",
  //   time: "15:00 - 18:00",
  //   location: "Universiteti AAB, Salla B3",
  //   category: "Akademik",
  //   image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
  //   attendees: 45,
  //   capacity: 50,
  //   organizer: "Klubi i Dizajnit"
  // },
//   {
//     id: "3",
//     title: "FrontEnd Development",
//     description: "Zbuloni botën e zhvillimit FrontEnd përmes një ngjarjeje të dedikuar për dizajnin dhe ndërtimin e faqeve interaktive dhe moderne.",
//     date: "2023-11-22",
//     time: "13:00 - 18:00",
//     location: "Universiteti i Mitrovicës, Salla A2",
//     category: "Teknologjik",
//     image: "https://images.unsplash.com/photo-1555949963-aa79dcee981d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
//     attendees: 150,
//     capacity: 200,
//     organizer: "Klubi i Studentëve të Shkencave Kompjuterike"
//   }
// ,  
  // {
  //   id: "4",
  //   title: "Netë Poezie dhe Muzikë",
  //   description: "Mbrëmje kulturore me poezitë dhe muzikë nga studentët. Ndiq performancat dhe shpërndaj talentin tënd.",
  //   date: "2023-11-25",
  //   time: "19:00 - 22:00",
  //   location: "Teatri Kombëtar i Kosovës",
  //   category: "Kulturor",
  //   image: "https://images.unsplash.com/photo-1576485436509-a7d286952b65?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
  //   attendees: 120,
  //   capacity: 150,
  //   organizer: "Klubi Letrar dhe Artistik"
  // }
];

const FeaturedEvents = () => {
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
          {mockEvents.map((event, index) => (
            <div 
              key={event.id} 
              className="animate-fade-in" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
