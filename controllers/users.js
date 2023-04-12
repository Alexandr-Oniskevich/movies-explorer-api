require('dotenv').config();
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../utils/errors/NotFoundError');
const BadRequestError = require('../utils/errors/BadRequestError');
const NotUsersFound = require('../utils/errors/NotUsersFound');
const ConflictRequest = require('../utils/errors/ConflictRequest');
const { SUCCESS, BASE_ERROR } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const login = (req, res, next) => {
  const { email, password } = req.body;
  User
    .findOne({ email }).select('+password')
    .orFail(new NotUsersFound('Пользователь не найден'))
    .then((user) => bcrypt.compare(password, user.password).then((matched) => {
      if (matched) {
        // аутентификация успешна
        return user;
        // хеши не совпали — отклоняем промис
      }
      return next(new NotUsersFound('Неправильная почта или пароль'));
    }))
    .then((user) => {
      const token = jsonwebtoken.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(SUCCESS).send(user))
    .catch(next);
};

const getUsers = (req, res, next) => User.find({})
  .then((users) => res.status(SUCCESS).send(users))
  .catch(next);

const getUsersId = (req, res, next) => User.findById(req.params.userId)
  .then((user) => {
    if (user) {
      res.send(user);
    } else {
      next(new NotFoundError('Пользователь по указанному _id не найден'));
    }
  })
  .catch((error) => {
    if (error.name === 'CastError') {
      next(new BadRequestError('Некорректный _id пользователя'));
    } else {
      next(error);
    }
  });

const createUsers = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(SUCCESS).send({
      email: user.email,
      name: user.name,
    }))
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      } else if (error.code === BASE_ERROR) {
        next(new ConflictRequest('Пользователь с указанной почтой уже есть в системе'));
      } else {
        next(error);
      }
    });
};

const changeUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, {
    new: true,
    runValidators: true,
  })
    .then((userInfo) => res.send(userInfo))
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(error);
      }
    });
};

module.exports = {
  getUsers,
  getUsersId,
  createUsers,
  changeUserInfo,
  // changeAvatar,
  login,
  getCurrentUser,
};
