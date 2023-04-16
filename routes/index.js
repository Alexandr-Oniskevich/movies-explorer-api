const Router = require('express').Router();
const { validateRegister, validateAuth } = require('../utils/validation');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const auth = require('../middlewares/auth');
const NotFoundError = require('../utils/errors/NotFoundError');
const { createUsers, login } = require('../controllers/users');

Router.post('/signup', validateRegister, createUsers);

Router.post('/signin', validateAuth, login);

Router.use('/users', auth, usersRouter);
Router.use('/movies', auth, moviesRouter);

Router.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не найдена'));
});

module.exports = Router;
