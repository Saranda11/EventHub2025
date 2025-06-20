export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const { name, email, password } = req.body;
    
    // Mock registration
    if (name && email && password) {
      res.status(201).json({ 
        success: true,
        message: "Registration successful!",
        user: {
          id: Date.now(),
          name: name,
          email: email
        }
      });
    } else {
      res.status(400).json({ 
        success: false,
        message: "All fields are required" 
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 