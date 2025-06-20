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
    const { email, password } = req.body;
    
    // Mock authentication for now
    if (email === 'admin@eventhub.com' && password === 'admin123') {
      res.status(200).json({ 
        success: true,
        message: "Login successful!",
        token: "mock_jwt_token_123",
        user: {
          id: 1,
          name: "Admin User",
          email: "admin@eventhub.com"
        }
      });
    } else {
      res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 