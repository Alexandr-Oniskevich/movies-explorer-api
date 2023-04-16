const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const limiter = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const handlerErrors = require('./middlewares/handlerErrors');
// const NotFoundError = require('./utils/errors/NotFoundError');
const Router = require('./routes/index');

// подключаемся к серверу mongo
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO);

const app = express();
app.use(cors());

app.use(requestLogger);
app.use(express.json());
// Apply the rate limiting middleware to all requests
app.use(limiter);
app.use(helmet());
app.disable('x-powered-by');

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', Router);
app.use(errorLogger);
app.use(errors());

app.use(handlerErrors);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
