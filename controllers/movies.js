const Movies = require('../models/movies');
const NotFoundError = require('../utils/errors/NotFoundError');
const BadRequestError = require('../utils/errors/BadRequestError');
const Forbidden = require('../utils/errors/Forbidden');

const { SUCCESS } = require('../utils/constants');

const getMovies = (req, res, next) => Movies.find({}).sort({ createdAt: -1 })
  .then((movies) => res.send(movies))
  .catch(next);
// создание фильма
const createMovies = (req, res, next) => {
  Movies.create({ owner: req.user._id, ...req.body })
    .then((movie) => res.status(SUCCESS).send(movie))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании фильма'));
      } else {
        next(error);
      }
    });
};
// удаление фильма
const deleteMovies = (req, res, next) => Movies.findById(req.params.movieId)
  .then((movie) => {
    if (!movie) {
      next(new NotFoundError('Фильм по указанному _id не найден'));
      return;
    }
    if (!(movie.owner.equals(req.user._id))) {
      next(new Forbidden('Фильм создан не вами. Он не может быть удалён'));
      return;
    }
    movie.deleteOne()
      .then(() => res.send({ message: 'Фильм удалён' }))
      .catch(next);
  })
  .catch(next);

module.exports = {
  getMovies, createMovies, deleteMovies,
};
