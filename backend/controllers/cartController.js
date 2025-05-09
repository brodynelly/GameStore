const Cart = require('../models/Cart');
const Game = require('../models/Game');
const mongoose = require('mongoose');

// Get cart items
exports.getCart = async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    let cart = await Cart.findOne({ userId }).populate('items.gameId');
    if (!cart) {
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }

    const cartItems = cart.items.map(item => ({
      ...item.gameId.toObject(),
      quantity: item.quantity
    }));

    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add to cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    const { gameId, quantity } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Convert gameId to ObjectId if it's a string
    const gameObjectId = typeof gameId === 'string' ? new mongoose.Types.ObjectId(gameId) : gameId;

    const game = await Game.findById(gameObjectId);
    if (!game || !game.inStock) {
      return res.status(400).json({ message: 'Game not available' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Find existing item using ObjectId comparison
    const existingItem = cart.items.find(item => 
      item.gameId.toString() === gameObjectId.toString()
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ gameId: gameObjectId, quantity });
    }

    await cart.save();
    await cart.populate('items.gameId');

    const cartItems = cart.items.map(item => ({
      ...item.gameId.toObject(),
      quantity: item.quantity
    }));

    res.json({
      message: 'Game added to cart',
      cart: cartItems
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: error.message });
  }
};

// Remove from cart
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    const gameId = req.params.gameId;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.gameId.toString() !== gameId);
    await cart.save();
    await cart.populate('items.gameId');

    const cartItems = cart.items.map(item => ({
      ...item.gameId.toObject(),
      quantity: item.quantity
    }));

    res.json({
      message: 'Game removed from cart',
      cart: cartItems
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update cart item quantity
exports.updateQuantity = async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    const { gameId, quantity } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(item => item.gameId.toString() === gameId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      return this.removeFromCart(req, res);
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.gameId');

    const cartItems = cart.items.map(item => ({
      ...item.gameId.toObject(),
      quantity: item.quantity
    }));

    res.json({
      message: 'Cart updated',
      cart: cartItems
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 