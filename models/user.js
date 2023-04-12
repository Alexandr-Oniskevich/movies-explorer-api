const mongoose = require('mongoose');
const validator = require('validator');

// Схема базы данных пользователя
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Александр',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (correct) => validator.isEmail(correct),
      message: 'Некорректный адрес email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);