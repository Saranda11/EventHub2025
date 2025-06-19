# EventHub Backend API

A Node.js backend API built with Express and MongoDB, using TypeScript.

## Features

- User authentication with JWT (access and refresh tokens)
- MongoDB integration with Mongoose
- TypeScript support
- Clean architecture with controller-service-repository pattern
- Request validation and error handling

## Prerequisites

- Node.js (LTS version recommended)
- MongoDB (local or Atlas)

## Project Structure

```
backend/
├── src/
│   ├── controllers/    # Request handlers
│   ├── middlewares/    # Express middlewares
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   └── server.ts       # Entry point
├── .env.example        # Environment variables example
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## Setup

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in the root directory (use .env.example as a template):

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/eventhub
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
NODE_ENV=development
```

## Running the application

### Development mode

```bash
npm run dev
```

### Production build

```bash
npm run build
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout user (requires authentication)

### User

- `GET /api/user/profile` - Get user profile (requires authentication)
- `PATCH /api/user/profile` - Update user profile (requires authentication)

## License

ISC
