const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors()); // Allow frontend requests (on a different port)
app.use(bodyParser.json()); // Parse JSON bodies

// Middleware to authenticate tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Token received:', token); // Debugging

  if (!token) return res.status(401).json({ message: 'Access token required' });

  jwt.verify(token, 'secretKey', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

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

let cart = [];
let users = [{ id: 1, username: 'admin', password: 'admin' }];

// Routes
// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the Game Store API!');
});

// Get all games
app.get('/api/games', (req, res) => {
  res.json(games);
});

// User authentication middleware
app.get('/api/protected-route', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Get game by ID
app.get('/api/games/:id', (req, res) => {
  const game = games.find((g) => g.id === parseInt(req.params.id));
  if (game) {
    res.json(game);
  } else {
    res.status(404).json({ message: 'Game not found' });
  }
});

// Add to cart
app.post('/api/cart', authenticateToken, (req, res) => {
  const { gameId, quantity } = req.body;
  const game = games.find((g) => g.id === gameId);

  if (game && game.inStock) {
    const existingItem = cart.find((item) => item.gameId === gameId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ gameId, quantity });
    }
    res.json({ message: 'Game added to cart', cart });
  } else {
    res.status(400).json({ message: 'Game not available' });
  }
});

// Get cart items
app.get('/api/cart', (req, res) => {
  const cartItems = cart.map((item) => {
    const game = games.find((g) => g.id === item.gameId);
    return { ...game, quantity: item.quantity };
  });
  res.json(cartItems);
});

// Remove from cart
app.delete('/api/cart/:gameId', (req, res) => {
  const gameId = parseInt(req.params.gameId);
  cart = cart.filter((item) => item.gameId !== gameId);
  res.json({ message: 'Game removed from cart', cart });
});

// User login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username && u.password === password);

  if (user) {
    const token = jwt.sign({ id: user.id, username: user.username }, 'secretKey', { expiresIn: '1h' });
    const userWithToken = { id: user.id, username: user.username, token };
    res.json(userWithToken);
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});


// User registration
app.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body;
  if (users.find((u) => u.username === username)) {
    res.status(400).json({ message: 'Username already exists' });
  } else {
    const newUser = { id: users.length + 1, username, password };
    users.push(newUser);
    const token = jwt.sign({ id: newUser.id, username: newUser.username }, 'secretKey', { expiresIn: '1h' });
    const userWithToken = { id: newUser.id, username: newUser.username, token };
    res.json(userWithToken);
  }
});


// Start server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;

