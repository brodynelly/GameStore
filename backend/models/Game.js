const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  developer: {
    type: String,
    required: true
  },
  releaseDate: {
    type: Date,
    required: true
  },
  genres: [{
    type: String
  }],
  rating: {
    type: Number,
    required: true
  },
  inStock: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Game', gameSchema); 