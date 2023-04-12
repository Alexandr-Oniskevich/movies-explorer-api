const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMovies, createMovies, deleteMovies,
} = require('../controllers/movies');

router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string()
      .required(),
    director: Joi.string()
      .required(),
    duration: Joi.number()
      .required(),
    year: Joi.string()
      .required(),
    description: Joi.string()
      .required(),
    image: Joi.string().pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/).required(),
    // https://habr.com/ru/post/66931/
    trailerLink: Joi.string().pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/).required(),
    thumbnail: Joi.string().pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/).required(),
    movieId: Joi.number()
      .required(),
    nameRU: Joi.string()
      .required(),
    nameEN: Joi.string()
      .required(),
  }),
}), createMovies);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24)
      .required(),
  }),
}), deleteMovies);

module.exports = router;
