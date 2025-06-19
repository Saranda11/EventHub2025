export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Mock events data
    const mockEvents = [
      {
        id: 1,
        title: "Konferenca e Teknologjisë",
        description: "Një event i shkëlqyer për të mësuar teknologji të reja",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000).toISOString(),
        location: "Prishtinë, Kosovë",
        category: "Teknologjik",
        status: "upcoming",
        maxAttendees: 100,
        ticketPrice: 0,
        imageUrl: "https://via.placeholder.com/400x200",
        organizer: {
          id: 1,
          name: "EventHub Team",
          email: "team@eventhub.com"
        }
      }
    ];
    
    res.status(200).json({ 
      events: mockEvents,
      total: mockEvents.length,
      message: "Events loaded successfully from Vercel API!"
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 