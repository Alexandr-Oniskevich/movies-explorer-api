const mongoose = require('mongoose');
const validator = require('validator');

// Схема базы данных карточки
const moviesSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  director: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  duration: {
    type: Number,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  year: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (correct) => validator.isURL(correct),
      message: 'Некорректный URL',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (correct) => validator.isURL(correct),
      message: 'Некорректный URL',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (correct) => validator.isURL(correct),
      message: 'Некорректный URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  nameEN: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

module.exports = mongoose.model('movies', moviesSchema);
