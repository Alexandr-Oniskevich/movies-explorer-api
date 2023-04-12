const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const { createUsers, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const { ERROR_SERVER } = require('./utils/constants');
const NotFoundError = require('./utils/errors/NotFoundError');

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');

const app = express();
app.use(cors());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply the rate limiting middleware to all requests
app.use(limiter);
app.use(helmet());
app.disable('x-powered-by');

app.use(express.json());
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().email()
        .required(),
      password: Joi.string()
        .required(),
    }),
  }),
  createUsers,
);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email()
        .required(),
      password: Joi.string()
        .required(),
    }),
  }),

  login,
);

app.use('/users', auth, usersRouter);
app.use('/movies', auth, moviesRouter);

app.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не найдена'));
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = err.status || ERROR_SERVER, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === ERROR_SERVER
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
