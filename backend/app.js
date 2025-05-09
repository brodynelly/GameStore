const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// CORS configuration
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With', 'Access-Control-Allow-Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Enable pre-flight requests for all routes
app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mock data
const games = [
  {
    id: 1,
    title: 'Cosmic Odyssey',
    price: 29.99,
    description: 'Embark on an epic journey through the cosmos, exploring uncharted planets and encountering mysterious alien civilizations.',
    shortDescription: 'A space exploration adventure game with stunning visuals.',
    imageUrl: 'https://images.unsplash.com/photo-1581822261290-991b38693d1b?w=600&h=400&fit=crop&q=80',
    developer: 'Nova Studios',
    releaseDate: '2023-07-15',
    genres: ['Adventure', 'Sci-Fi', 'Open World'],
    rating: 4.8,
    inStock: true
  },
  {
    id: 2,
    title: 'Phantom Realm',
    price: 24.99,
    description: 'Delve into a haunting world where reality and illusion blur. Solve intricate puzzles and uncover the dark secrets of the Phantom Realm.',
    shortDescription: 'A haunting puzzle game set in a mysterious realm.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=400&fit=crop&q=80',
    developer: 'Twilight Games',
    releaseDate: '2023-10-31',
    genres: ['Puzzle', 'Horror', 'Mystery'],
    rating: 4.6,
    inStock: true
  },
  {
    id: 3,
    title: 'Pixie Forest',
    price: 19.99,
    description: 'A charming adventure through an enchanted forest filled with magical creatures. Help the pixies restore balance to their world.',
    shortDescription: 'A whimsical adventure in a magical forest.',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&h=400&fit=crop&q=80',
    developer: 'Whimsy Works',
    releaseDate: '2023-04-22',
    genres: ['Adventure', 'Family', 'Fantasy'],
    rating: 4.5,
    inStock: true
  },
  {
    id: 4,
    title: 'Tech Revolution',
    price: 34.99,
    description: 'Build and manage your own tech company, compete with rivals, and revolutionize the digital world with innovative products.',
    shortDescription: 'A business simulation game set in the tech industry.',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop&q=80',
    developer: 'Simulation Masters',
    releaseDate: '2023-08-10',
    genres: ['Simulation', 'Strategy', 'Business'],
    rating: 4.3,
    inStock: true
  },
  {
    id: 5,
    title: 'Neon Knights',
    price: 27.99,
    description: 'Fight for control in a cyberpunk city where corporations rule and hackers are the new rebels. Fast-paced combat in a neon-lit dystopia.',
    shortDescription: 'A cyberpunk action game with fast-paced combat.',
    imageUrl: 'https://images.unsplash.com/photo-1605979257913-1704eb7b6246?w=600&h=400&fit=crop&q=80',
    developer: 'Cyber Studios',
    releaseDate: '2023-06-05',
    genres: ['Action', 'Cyberpunk', 'RPG'],
    rating: 4.7,
    inStock: true
  },
  {
    id: 6,
    title: 'Ancient Legends',
    price: 39.99,
    description: 'Immerse yourself in a vast open world inspired by ancient mythologies. Slay legendary beasts and become a hero of old.',
    shortDescription: 'An open-world RPG based on ancient mythologies.',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop&q=80',
    developer: 'Mythic Games',
    releaseDate: '2023-01-20',
    genres: ['RPG', 'Open World', 'Fantasy'],
    rating: 4.9,
    inStock: true
  },
  {
    id: 7,
    title: 'Ocean Deep',
    price: 22.99,
    description: 'Explore the mysteries of the ocean in this visually stunning underwater adventure. Discover new species and ancient ruins.',
    shortDescription: 'An underwater exploration adventure with stunning visuals.',
    imageUrl: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=600&h=400&fit=crop&q=80',
    developer: 'Aquatic Arts',
    releaseDate: '2023-03-17',
    genres: ['Adventure', 'Exploration', 'Educational'],
    rating: 4.4,
    inStock: true
  },
  {
    id: 8,
    title: 'Speed Demons',
    price: 32.99,
    description: 'Push your racing skills to the limit in this high-octane racing game featuring customizable vehicles and dynamic tracks.',
    shortDescription: 'A high-speed racing game with customizable vehicles.',
    imageUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&h=400&fit=crop&q=80',
    developer: 'Velocity Studios',
    releaseDate: '2023-09-08',
    genres: ['Racing', 'Sports', 'Multiplayer'],
    rating: 4.2,
    inStock: true
  }
];

// User-specific carts
const userCarts = new Map();

// Helper function to get user cart
function getUserCart(userId) {
  if (!userCarts.has(userId)) {
    userCarts.set(userId, []);
  }
  return userCarts.get(userId);
}

let users = [{ id: 1, email: 'testuser@gmail.com', password: 'password123' }];

// Routes
// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the Game Store API!');
});

// Get all games
app.get('/api/games', (req, res) => {
  res.json(games);
});

// Get game by ID
app.get('/api/games/:id', (req, res) => {
  const gameId = parseInt(req.params.id);
  const game = games.find((g) => g.id === gameId);
  if (game) {
    res.json(game);
  } else {
    res.status(404).json({ message: 'Game not found' });
  }
});

// Add to cart
app.post('/api/cart', (req, res) => {
  const { gameId, quantity } = req.body;
  const userId = req.headers['user-id']; // Get user ID from headers

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const game = games.find((g) => g.id === gameId);
  if (!game || !game.inStock) {
    return res.status(400).json({ message: 'Game not available' });
  }

  const userCart = getUserCart(userId);
  const existingItem = userCart.find((item) => item.gameId === gameId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    userCart.push({ gameId, quantity });
  }

  res.json({
    message: 'Game added to cart',
    cart: userCart.map(item => {
      const game = games.find(g => g.id === item.gameId);
      return { ...game, quantity: item.quantity };
    })
  });
});

// Get cart items
app.get('/api/cart', (req, res) => {
  const userId = req.headers['user-id']; // Get user ID from headers

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const userCart = getUserCart(userId);
  const cartItems = userCart.map((item) => {
    const game = games.find((g) => g.id === item.gameId);
    return { ...game, quantity: item.quantity };
  });

  res.json(cartItems);
});

// Remove from cart
app.delete('/api/cart/:gameId', (req, res) => {
  const userId = req.headers['user-id']; // Get user ID from headers
  const gameId = parseInt(req.params.gameId);

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const userCart = getUserCart(userId);
  const updatedCart = userCart.filter((item) => item.gameId !== gameId);
  userCarts.set(userId, updatedCart);

  res.json({
    message: 'Game removed from cart',
    cart: updatedCart.map(item => {
      const game = games.find(g => g.id === item.gameId);
      return { ...game, quantity: item.quantity };
    })
  });
});

// Update cart item quantity
app.put('/api/cart', (req, res) => {
  const userId = req.headers['user-id']; // Get user ID from headers
  const { gameId, quantity } = req.body;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const userCart = getUserCart(userId);
  const item = userCart.find((item) => item.gameId === gameId);

  if (!item) {
    return res.status(404).json({ message: 'Item not found in cart' });
  }

  if (quantity <= 0) {
    return this.removeFromCart(gameId);
  }

  item.quantity = quantity;
  res.json({
    message: 'Cart updated',
    cart: userCart.map(item => {
      const game = games.find(g => g.id === item.gameId);
      return { ...game, quantity: item.quantity };
    })
  });
});

// User login
app.post('/api/auth/login', (req, res) => {
  console.log('Received login request');
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
  
  const { email, password } = req.body;
  console.log('Extracted credentials:', { email, password });
  console.log('Available users:', JSON.stringify(users, null, 2));
  
  const user = users.find((u) => u.email === email && u.password === password);
  console.log('Found user:', user);

  if (user) {
    console.log('Login successful');
    res.json({ message: 'Login successful', user });
  } else {
    console.log('Login failed - invalid credentials');
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// User registration
app.post('/api/auth/register', (req, res) => {
  const { email, password } = req.body;
  if (users.find((u) => u.email === email)) {
    res.status(400).json({ message: 'Email already exists' });
  } else {
    const newUser = { id: users.length + 1, email, password };
    users.push(newUser);
    res.json({ message: 'Registration successful', user: newUser });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;

