const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const limiter = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const { MONGO, NODE_ENV } = process.env;
const handlerErrors = require('./middlewares/handlerErrors');
const Router = require('./routes/index');

const { MONGO_DEV } = require('./utils/constants');

// подключаемся к серверу mongo
mongoose.set('strictQuery', false);
mongoose.connect(NODE_ENV === 'production' ? MONGO : MONGO_DEV);
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
