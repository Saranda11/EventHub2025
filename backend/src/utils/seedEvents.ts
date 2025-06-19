import mongoose from "mongoose";
import Event from "../models/eventModel";
import User from "../models/userModel";
import dotenv from "dotenv";

dotenv.config();

const sampleEvents = [
  {
    title: "Konferenca Tech për Studentë",
    description:
      "Mëso teknologjitë e fundit nga ekspertët e industrisë. Ngjarja përfshin panele, workshope dhe networking për studentët e interesuar në teknologji dhe inovacion.",
    startDate: new Date("2025-02-15T10:00:00Z"),
    endDate: new Date("2025-02-15T17:00:00Z"),
    location: "Universiteti i Prishtinës, Salla A1",
    category: "Teknologjik",
    maxAttendees: 250,
    ticketPrice: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    tags: ["teknologji", "networking", "workshop"],
  },
  {
    title: "Workshop: Dizajn Grafik për Fillestarë",
    description:
      "Mëso bazat e dizajnit grafik, me fokus në Adobe Photoshop dhe Illustrator. Sill laptopin tënd dhe fillo të dizajnosh projekte reale nën udhëheqjen e dizajnerëve profesionistë.",
    startDate: new Date("2025-02-18T15:00:00Z"),
    endDate: new Date("2025-02-18T18:00:00Z"),
    location: "Universiteti AAB, Salla B3",
    category: "Akademik",
    maxAttendees: 50,
    ticketPrice: 10,
    imageUrl:
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    tags: ["dizajn", "workshop", "adobe"],
  },
  {
    title: "Turnir Futbolli Ndëruniversitar",
    description:
      "Gara e madhe e futbollit mes universiteteve të Kosovës. Regjistro ekipin tënd dhe fito çmimin e madh. Pjesëmarrja është e hapur për të gjithë studentët, me ekipe prej 7 lojtarësh.",
    startDate: new Date("2025-02-22T13:00:00Z"),
    endDate: new Date("2025-02-22T18:00:00Z"),
    location: "Fusha e Sportit, Qyteti Studentor",
    category: "Sportiv",
    maxAttendees: 200,
    ticketPrice: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    tags: ["futboll", "sport", "turnir"],
  },
  {
    title: "Netë Poezie dhe Muzikë",
    description:
      "Mbrëmje kulturore me poezitë dhe muzikë nga studentët. Ndiq performancat dhe shpërndaj talentin tënd në një atmosferë artistike që promovon krijimtarinë dhe shprehjen.",
    startDate: new Date("2025-02-25T19:00:00Z"),
    endDate: new Date("2025-02-25T22:00:00Z"),
    location: "Teatri Kombëtar i Kosovës",
    category: "Kulturor",
    maxAttendees: 150,
    ticketPrice: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    tags: ["poezie", "muzikë", "kulturë"],
  },
  {
    title: "Sesion Informimi për Bursa Ndërkombëtare",
    description:
      "Informacione dhe këshilla për aplikimin në bursa ndërkombëtare për studime bachelor, master dhe PhD. Përfaqësues nga ambasada të ndryshme do të ndajnë mundësitë e disponueshme.",
    startDate: new Date("2025-03-01T12:00:00Z"),
    endDate: new Date("2025-03-01T14:00:00Z"),
    location: "Universiteti i Prishtinës, Amfiteatri i Madh",
    category: "Akademik",
    maxAttendees: 300,
    ticketPrice: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    tags: ["bursa", "studime", "ndërkombëtare"],
  },
  {
    title: "Hackathon: Zgjidhje Digjitale për Qytete të Mençura",
    description:
      "48 orë sfidë programimi për krijimin e zgjidhjeve inovative për problemet urbane. Punoj në ekipe, krijoj prototipe funksionale dhe fito çmime të vlefshme nga sponsorët.",
    startDate: new Date("2025-03-05T09:00:00Z"),
    endDate: new Date("2025-03-07T09:00:00Z"),
    location: "Innovation Centre Kosovo",
    category: "Teknologjik",
    maxAttendees: 100,
    ticketPrice: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    tags: ["hackathon", "programim", "inovacion"],
  },
  {
    title: "Trajnim: Aftësi Komunikimi dhe Prezantimi",
    description:
      "Workshop praktik për zhvillimin e aftësive të komunikimit dhe prezantimit publik, thelbësore për karrierën tuaj. Perfeksiono teknikat e prezantimit me feedback të menjëhershëm.",
    startDate: new Date("2025-03-10T15:00:00Z"),
    endDate: new Date("2025-03-10T18:00:00Z"),
    location: "Universiteti UBT, Salla C5",
    category: "Akademik",
    maxAttendees: 50,
    ticketPrice: 15,
    imageUrl:
      "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    tags: ["komunikim", "prezantim", "aftësi"],
  },
  {
    title: "Ekspozitë e Projekteve Studentore të Arkitekturës",
    description:
      "Shfaqje e projekteve më të mira të studentëve të Arkitekturës nga universitetet e Kosovës. Vizito dhe voto për projektin më inovativ, duke i dhënë mundësi studentëve të shfaqin talentet e tyre.",
    startDate: new Date("2025-03-15T10:00:00Z"),
    endDate: new Date("2025-03-15T18:00:00Z"),
    location: "Galeria e Arteve e Kosovës",
    category: "Kulturor",
    maxAttendees: 150,
    ticketPrice: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    tags: ["arkitekturë", "ekspozitë", "projekte"],
  },
];

async function seedEvents() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/eventhub");
    console.log("Connected to MongoDB");

    // Find or create a default organizer user
    let organizer = await User.findOne({ email: "organizer@eventhub.com" });

    if (!organizer) {
      organizer = await User.create({
        name: "EventHub Organizer",
        email: "organizer@eventhub.com",
        password: "hashedpassword", // This should be properly hashed in real scenario
        role: "admin",
      });
      console.log("Created default organizer user");
    }

    // Clear existing events
    // await Event.deleteMany({});
    console.log("Cleared existing events");

    // Create sample events
    const eventsWithOrganizer = sampleEvents.map((event) => ({
      ...event,
      organizer: organizer!._id,
    }));

    if ((await Event.countDocuments()) === 0) {
      await Event.insertMany(eventsWithOrganizer);
      console.log(`Successfully seeded ${sampleEvents.length} events`);
    }

    // Close connection
    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error seeding events:", error);
    process.exit(1);
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedEvents();
}

export default seedEvents;
