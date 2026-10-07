const express = require('express');
const http = require('http');
const { Server: SocketIOServer } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middlewares
app.use(cors());
app.use(express.json());

// Attach io to request object for socket broadcasting in controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Root Welcome Page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>StreetBite (FoodOnWheels) API Server</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; background: #0F172A; color: #F8FAFC; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
          .card { background: #1E293B; border: 1px solid #334155; padding: 40px; border-radius: 24px; text-align: center; max-width: 500px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
          h1 { color: #FF7A00; margin-top: 0; }
          .badge { display: inline-block; background: rgba(16, 185, 129, 0.2); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.3); padding: 4px 12px; border-radius: 999px; font-weight: bold; font-size: 12px; margin-bottom: 20px; }
          a.btn { display: inline-block; background: #FF7A00; color: white; padding: 12px 24px; border-radius: 12px; font-weight: bold; text-decoration: none; margin-top: 15px; transition: transform 0.2s; }
          a.btn:hover { transform: scale(1.05); }
          .links { margin-top: 25px; font-size: 14px; color: #94A3B8; }
          .links a { color: #38BDF8; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">● BACKEND API ONLINE</div>
          <h1>StreetBite Server</h1>
          <p>Express REST API & Socket.IO backend services are active.</p>
          <a href="http://localhost:3000" class="btn">Open Main Website (Port 3000) →</a>
          <div class="links">
            <p>API Health Check: <a href="/api/health">/api/health</a></p>
          </div>
        </div>
      </body>
    </html>
  `);
});

// Routes
const authRoutes = require('./routes/authRoutes');
const businessRoutes = require('./routes/businessRoutes');
const menuRoutes = require('./routes/menuRoutes');
const specialsRoutes = require('./routes/specialsRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const dealRoutes = require('./routes/dealRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const videoRoutes = require('./routes/videoRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const rewardsRoutes = require('./routes/rewardsRoutes');
const userRoutes = require('./routes/userRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');

const initSocket = require('./sockets/socketHandler');

app.use('/api/auth', authRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/specials', specialsRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/rewards', rewardsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Phase 3 — Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: "FoodOnWheels API is working",
    timestamp: new Date()
  });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Socket.IO Connections & Event Handlers
initSocket(io);

const PORT = process.env.PORT || 5000;

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Error: Port ${PORT} is already in use by another process.`);
    console.error(`👉 Stop the existing process running on port ${PORT} or run:`);
    console.error(`   Get-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess | Stop-Process -Force`);
    process.exit(1);
  }
});

const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`🚀 FoodOnWheels Backend Server listening on http://localhost:${PORT}`);
  });
};

// Server entrypoint
startServer();