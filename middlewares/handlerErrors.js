const { ERROR_SERVER } = require('../utils/constants');

module.exports = (err, req, res, next) => {
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
};
