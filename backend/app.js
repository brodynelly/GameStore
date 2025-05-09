const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/database');
const gameRoutes = require('./routes/gameRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');

// Connect to MongoDB
connectDB();

// Normalize a port into a number, string, or false
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val; // Named pipe
  }

  if (port >= 0) {
    return port; // Port number
  }

  return false;
};

// Define ports
const STATIC_PORT = 3000; // Fixed port for the first server
const DYNAMIC_PORT = normalizePort(process.env.PORT || '4000'); // Dynamic port for the second server

// -------------------- First Server (Static Port) --------------------
const staticApp = express();

staticApp.get('/', (req, res) => {
  res.json({ dynamicPort: DYNAMIC_PORT }); // Serve the dynamic port number
});

staticApp.listen(STATIC_PORT, () => {
  console.log(`Static server is running on Port ${STATIC_PORT}`);
});

// -------------------- Second Server (Dynamic Port) --------------------
const dynamicApp = express();

// CORS configuration
dynamicApp.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With', 'Access-Control-Allow-Origin', 'user-id'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Enable pre-flight requests for all routes
dynamicApp.options('*', cors());

dynamicApp.use(bodyParser.json());
dynamicApp.use(bodyParser.urlencoded({ extended: true }));

// Routes
dynamicApp.use('/api/games', gameRoutes);
dynamicApp.use('/api/auth', authRoutes);
dynamicApp.use('/api/cart', cartRoutes);

// Home route
dynamicApp.get('/', (req, res) => {
  res.send('Welcome to the Game Store API!');
});

// Event listener for HTTP server "error" event
const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof DYNAMIC_PORT === 'string' ? `Pipe ${DYNAMIC_PORT}` : `Port ${DYNAMIC_PORT}`;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Event listener for HTTP server "listening" event
const onListening = () => {
  const bind = typeof DYNAMIC_PORT === 'string' ? `Pipe ${DYNAMIC_PORT}` : `Port ${DYNAMIC_PORT}`;
  console.log(`Dynamic server is running on ${bind}`);
};

// Start the dynamic server
const dynamicServer = dynamicApp.listen(DYNAMIC_PORT);
dynamicServer.on('error', onError);
dynamicServer.on('listening', onListening); 

module.exports = { staticApp, dynamicApp };